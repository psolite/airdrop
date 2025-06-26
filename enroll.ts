import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor"
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json"
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed" });

// Create our program
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// Create the PDA for our enrollment account
const account_seeds = [
    Buffer.from("prereqs"),
    keypair.publicKey.toBuffer(),
];

const [account_key, _account_bump] =
    PublicKey.findProgramAddressSync(account_seeds, program.programId);

const mintCollection = new PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");

const mintTs = Keypair.generate();

// Execute the initialize transaction
// (async () => {
//     try {
//         const txhash = await program.methods
//             .initialize("psolite")
//             .accountsPartial({
//                 user: keypair.publicKey,
//                 account: account_key,
//                 system_program: SYSTEM_PROGRAM_ID,
//             })
//             .signers([keypair])
//             .rpc();
//         console.log(`Success! Check out your TX here:
// https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
//     } catch (e) {
//         console.error(`Oops, something went wrong: ${e}`);
//     }
// })()

// https://explorer.solana.com/tx/4ADNqq62nNGXxd94HNNm7HUdQKnHtjTMN8k5QnXDWRkEnzmu3fQeahU3am5ZbyXM1S1CXmWHgQAA1TDgcTRsP7WD?cluster=devnet



// Execute the submitTs transaction
(async () => {
    try {
        console.log(account_key.toBase58());
        const txhash = await program.methods
            .submitTs()
            .accountsPartial({
                user: keypair.publicKey,
                account: account_key,
                authority: new PublicKey("5xstXUdRJKxRrqbJuo5SAfKf68y7afoYwTeH1FXbsA3k"),
                mint: mintTs.publicKey,
                collection: mintCollection,
                mpl_core_program: MPL_CORE_PROGRAM_ID,
                system_program: SYSTEM_PROGRAM_ID,

            })
            .signers([keypair, mintTs])
            .rpc();
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();

//https://explorer.solana.com/tx/5vUeixwuTLaENUUN8aR3kM2hop92AV3r5gbzpnhBAiCtoiiUxvVb7dSrTV6v6TpBJaLck2pZFPBQAhBVv4QbCx4i?cluster=devnet
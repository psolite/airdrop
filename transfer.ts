import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js"
import wallet from "./dev-wallet.json"

const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define our Turbin3 public key
const to = new PublicKey("ChiTDkUqjYnmgtDYDWvSYQ9dwJgfRAZ3nvFRDRD2KYtR");

// Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// (async () => {
//     try {
//         const transaction = new Transaction().add(
//             SystemProgram.transfer({
//                 fromPubkey: from.publicKey,
//                 toPubkey: to,
//                 lamports: LAMPORTS_PER_SOL / 10,
//             })
//         );
//         transaction.recentBlockhash = (
//             await connection.getLatestBlockhash('confirmed')
//         ).blockhash;
//         transaction.feePayer = from.publicKey;
//         // Sign transaction, broadcast, and confirm
//         const signature = await sendAndConfirmTransaction(
//             connection,
//             transaction,
//             [from]
//         );
//         console.log(`Success! Check out your TX here:
// https://explorer.solana.com/tx/${signature}?cluster=devnet`);
//     } catch (e) {
//         console.error(`Oops, something went wrong: ${e}`);
//     }
// })();

// My transaction link that sent 0.1 SOL to My Turbin3 Wallet 
// https://explorer.solana.com/tx/46bWr9KPRLgNxhAasb2dt6XTSaPCYGeCZsWjAzoeGGQ6xsBJCRhysMsx2p9ks3yqvXoR7NDM6SFc2arJZfSx99mY?cluster=devnet

// To Empty my devnet wallet into my Turbin3 wallet

(async () => {
    try {
        // Get balance of dev wallet
        const balance = await connection.getBalance(from.publicKey)
        // Create a test transaction to calculate fees
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance,
            })
        );
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;
        // Calculate exact fee rate to transfer entire SOL amount out of account minus fees
        const fee = (await connection.getFeeForMessage(transaction.compileMessage(),'confirmed')).value || 0;
        // Remove our transfer instruction to replace it
        transaction.instructions.pop();

        // Now add the instruction back with correct amount of lamports
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee,
            })
        );
        // Sign transaction, broadcast, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log(`Success! Check out your TX here:
https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

// My transaction link that emptied my devnet wallet into my Turbin3 wallet
//https://explorer.solana.com/tx/3sbvdUdcVR2bBs961iPiJTjqVJwZ54jaAMuvZeSRZxcF2XEXaFekgq9SstLBxES27dhrPT1V4RNL9czLJUqReYAN?cluster=devnet
import { Program, web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import {
    Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID, AccountLayout, MintLayout, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

import fs from 'fs';
import { GlobalPool, BirthPool } from './types';

const POOL_SIZE = 424120;
const GLOBAL_AUTHORITY_SEED = "global-authority";
const REWARD_TOKEN_MINT = new PublicKey("8EoML7gaBJsgJtepm25wq3GuUCqLYHBoqd3HP1JxtyBx");
const PROGRAM_ID = "FnHXok1nLqh5rVJLjseYx9WhtLWnXkRVBLaPjRH3i7rz";

anchor.setProvider(anchor.Provider.local(web3.clusterApiUrl('devnet')));
const solConnection = anchor.getProvider().connection;
const payer = anchor.getProvider().wallet;
console.log(payer.publicKey.toBase58());

const idl = JSON.parse(
    fs.readFileSync(__dirname + "/breed.json", "utf8")
);
let rewardVault: PublicKey = null;
let program: Program = null;

// Address of the deployed program.
const programId = new anchor.web3.PublicKey(PROGRAM_ID);

// Generate the program client from IDL.
program = new anchor.Program(idl, programId);
console.log('ProgramId: ', program.programId.toBase58());

const main = async () => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    console.log('GlobalAuthority: ', globalAuthority.toBase58());

    rewardVault = await getAssociatedTokenAccount(globalAuthority, REWARD_TOKEN_MINT);
    console.log('RewardVault: ', rewardVault.toBase58());
    console.log(await solConnection.getTokenAccountBalance(rewardVault));

    // await initProject(payer.publicKey);

    const globalPool: GlobalPool = await getGlobalState();
    console.log("globalPool =", globalPool.admin.toBase58(), globalPool.breedTimes.toNumber());

    // await add(payer.publicKey, new PublicKey('FvVKssmkvAxTh1P9WLtoiCQExss4rpmt3ddqiap4eK3r'), 2);
    // await add(payer.publicKey, new PublicKey('LzRJvRA9zWcFDk8KwMPkVeZ3zbm6mw4sEdNmkChh9Sn'), 2);
    // await breed(payer.publicKey, new PublicKey('554AJqCuVFWL7ZHtLqmh18NvuC4UYLP12Bc8fN4RvTex'), new PublicKey('H9JhKgyyPmc17zkTdUUuBZhyQZ6pdnrTHHufYBFDz7LF'), 2);
    // await breed(payer.publicKey, new PublicKey('D79yrn3PaNqjdJgV8HrVeBR35EuK2LTFS637psei5fW1'), new PublicKey('LzRJvRA9zWcFDk8KwMPkVeZ3zbm6mw4sEdNmkChh9Sn'), 2);

    const birthPool: BirthPool = await getUserPoolState();
    console.log(birthPool.amountCount2.toNumber(), birthPool.nftTier2[0].toBase58());



    // await initUserPool(payer.publicKey);



};

export const initProject = async (
    userAddress: PublicKey,
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let userPoolKey = await PublicKey.createWithSeed(
        userAddress,
        "birth-pool",
        program.programId,
    );
    console.log(POOL_SIZE);
    let ix = SystemProgram.createAccountWithSeed({
        fromPubkey: userAddress,
        basePubkey: userAddress,
        seed: "birth-pool",
        newAccountPubkey: userPoolKey,
        lamports: await solConnection.getMinimumBalanceForRentExemption(POOL_SIZE),
        space: POOL_SIZE,
        programId: program.programId,
    });
    console.log(ix);

    const tx = await program.rpc.initialize(
        bump, {
        accounts: {
            admin: payer.publicKey,
            globalAuthority,
            birthPool: userPoolKey,
            vault: rewardVault,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [
            ix
        ],
        signers: [],
    });
    await solConnection.confirmTransaction(tx, "confirmed");

    console.log("txHash =", tx);
    return false;
}

export const add = async (userAddress: PublicKey, mint: PublicKey, tier: number) => {
    const globalPool: GlobalPool = await getGlobalState();
    let admin = globalPool.admin;
    console.log(userAddress.toBase58());
    console.log(admin.toBase58());
    if (userAddress.toBase58() !== admin.toBase58()) return;
    let userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);
    console.log("Add NFT = ", mint.toBase58(), userTokenAccount.toBase58());

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        globalAuthority,
        [mint]
    );

    let userPoolKey = await PublicKey.createWithSeed(
        userAddress,
        "birth-pool",
        program.programId,
    );
    console.log("Dest NFT Account = ", destinationAccounts[0].toBase58())

    const tx = await program.rpc.add(
        bump, new anchor.BN(tier), {
        accounts: {
            owner: userAddress,
            birthPool: userPoolKey,
            globalAuthority,
            userTokenAccount,
            destNftTokenAccount: destinationAccounts[0],
            nftMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [
            ...instructions,
        ],
        signers: [],
    });
    await solConnection.confirmTransaction(tx, "singleGossip");
    console.log("txHash =", tx);
}

export const breed = async (userAddress: PublicKey, mintFirst: PublicKey, mintSecond: PublicKey, tier: number) => {

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    let userTokenAccountFirst = await getAssociatedTokenAccount(userAddress, mintFirst);
    let userTokenAccountSecond = await getAssociatedTokenAccount(userAddress, mintSecond);


    console.log("Tier Ready NFT1 = ", mintFirst.toBase58(), userTokenAccountFirst.toBase58());
    console.log("Tier Ready NFT2 = ", mintSecond.toBase58(), userTokenAccountSecond.toBase58());

    const globalPool: GlobalPool = await getGlobalState();
    let admin = globalPool.admin;
    let userPoolKey = await PublicKey.createWithSeed(
        admin,
        "birth-pool",
        program.programId,
    );

    const poolState: BirthPool = await getUserPoolState();
    let index = 0;
    let birth = null;

    switch (tier) {
        case 2:
            index = poolState.amountCount2.toNumber() - 1;
            birth = poolState.nftTier2[index];
            break;
        case 3:
            index = poolState.amountCount3.toNumber() - 1;
            birth = poolState.nftTier3[index];
            break;
        case 4:
            index = poolState.amountCount4.toNumber() - 1;
            birth = poolState.nftTier4[index];
            break;
        case 5:
            index = poolState.amountCount5.toNumber() - 1;
            birth = poolState.nftTier5[index];
            break;
        case 6:
            index = poolState.amountCount6.toNumber() - 1;
            birth = poolState.nftTier6[index];
            break;
        case 7:
            index = poolState.amountCount7.toNumber() - 1;
            birth = poolState.nftTier7[index];
            break;
        case 8:
            index = poolState.amountCount8.toNumber() - 1;
            birth = poolState.nftTier8[index];
            break;
        case 9:
            index = poolState.amountCount9.toNumber() - 1;
            birth = poolState.nftTier9[index];
            break;
        case 10:
            index = poolState.amountCount10.toNumber() - 1;
            birth = poolState.nftTier10[index];
            break;
        default:
            throw Error('Invalid Tier');

    }



    let result1 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        globalAuthority,
        [mintFirst, mintSecond, birth]
    );

    let firstDest = result1.destinationAccounts[0];
    let secondDest = result1.destinationAccounts[1];
    let birthAcc = result1.destinationAccounts[2];

    let result2 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        userAddress,
        [REWARD_TOKEN_MINT, birth]
    );
    let userUtil = result2.destinationAccounts[0];
    let bornAcc = result2.destinationAccounts[1];

    console.log("Dest NFT Account = ", result1.destinationAccounts[0].toBase58());

    const tx = await program.rpc.breed(
        bump, new anchor.BN(tier), {
        accounts: {
            owner: userAddress,
            globalAuthority,
            birthPool: userPoolKey,
            firstMint: mintFirst,
            firstUserTokenAccount: userTokenAccountFirst,
            firstDestNftTokenAccount: firstDest,
            secondMint: mintSecond,
            secondUserTokenAccount: userTokenAccountSecond,
            secondDestNftTokenAccount: secondDest,
            utilTokenAccount: userUtil,
            vaultUtilTokenAccount: rewardVault,
            birthMint: birth,
            birthPoolAccount: birthAcc,
            userBornAccount: bornAcc,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [
            ...result1.instructions,
            ...result2.instructions,
        ],
        signers: [],
    }
    );
    await solConnection.confirmTransaction(tx, "singleGossip");
}


export const getGlobalState = async (
): Promise<GlobalPool | null> => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    try {
        let globalState = await program.account.globalPool.fetch(globalAuthority);
        return globalState as GlobalPool;
    } catch {
        return null;
    }
}

export const getUserPoolState = async (
): Promise<BirthPool | null> => {

    const globalPool: GlobalPool = await getGlobalState();
    let userAddress = globalPool.admin;

    let userPoolKey = await PublicKey.createWithSeed(
        userAddress,
        "birth-pool",
        program.programId,
    );
    console.log('Birth Pool: ', userPoolKey.toBase58());
    try {
        let poolState = await program.account.birthPool.fetch(userPoolKey);
        return poolState as BirthPool;
    } catch {
        return null;
    }
}

const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    return associatedTokenAccountPubkey;
}

export const getATokenAccountsNeedCreate = async (
    connection: anchor.web3.Connection,
    walletAddress: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    nfts: anchor.web3.PublicKey[],
) => {
    let instructions = [], destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        if (walletAddress != owner) {
            const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
            response = await connection.getAccountInfo(userAccount);
            if (!response) {
                const createATAIx = createAssociatedTokenAccountInstruction(
                    userAccount,
                    walletAddress,
                    walletAddress,
                    mint,
                );
                instructions.push(createATAIx);
            }
        }
    }
    return {
        instructions,
        destinationAccounts,
    };
}

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}

main();
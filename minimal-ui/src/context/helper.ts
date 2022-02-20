import { web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import {
    AccountInfo,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { programs } from '@metaplex/js';
import { IDL } from './breed';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { GlobalPool, BirthPool } from './types';

const POOL_SIZE = 424120;
const GLOBAL_AUTHORITY_SEED = "global-authority";
const REWARD_TOKEN_MINT = new PublicKey("8EoML7gaBJsgJtepm25wq3GuUCqLYHBoqd3HP1JxtyBx");
const PROGRAM_ID = "FnHXok1nLqh5rVJLjseYx9WhtLWnXkRVBLaPjRH3i7rz";
const PUBLISH_NETWORK = "devnet"

export const solConnection = new web3.Connection(web3.clusterApiUrl(PUBLISH_NETWORK));


export const getNftMetaData = async (nftMintPk: PublicKey) => {
    let { metadata: { Metadata } } = programs;
    let metadataAccount = await Metadata.getPDA(nftMintPk);
    const metadat = await Metadata.load(solConnection, metadataAccount);
    return metadat;
}

export const initProject = async (
    wallet: WalletContextState
) => {
    if (!wallet.publicKey) return;
    let cloneWindow: any = window;

    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    const rewardVault = await getAssociatedTokenAccount(globalAuthority, REWARD_TOKEN_MINT);

    let userPoolKey = await PublicKey.createWithSeed(
        wallet.publicKey,
        "birth-pool",
        program.programId,
    );
    console.log(POOL_SIZE);
    let ix = SystemProgram.createAccountWithSeed({
        fromPubkey: wallet.publicKey,
        basePubkey: wallet.publicKey,
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
            admin: wallet.publicKey,
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

    await new Promise((resolve, reject) => {
        solConnection.onAccountChange(globalAuthority, (data: AccountInfo<Buffer> | null) => {
            if (!data) reject();
            resolve(true);
        });
    });
    console.log("txHash =", tx);
    return false;
}
const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
        ));
     return associatedTokenAccountPubkey[0];
}

export const getGlobalState = async (): Promise<GlobalPool | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    const [globalAuthority] = await PublicKey.findProgramAddress(
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
export const getUserPoolState = async (): Promise<BirthPool | null> => {
    
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    
    let globalPool: GlobalPool | null = await getGlobalState();
    if (globalPool === null) return null;
    
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
    

export const add = async (userAddress: PublicKey, mint: PublicKey, tier: number) => {
    const globalPool: GlobalPool | null = await getGlobalState();
    if (globalPool === null) return null;
    let admin = globalPool.admin;
    if (userAddress.toBase58() !== admin.toBase58()) return;

    let userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);
    let accountOfNFT = await getNFTTokenAccount(mint);
    if (userTokenAccount.toBase58() !== accountOfNFT.toBase58()) {
        let nftOwner = await getOwnerOfNFT(mint);
        if (nftOwner.toBase58() === userAddress.toBase58()) userTokenAccount = accountOfNFT;
        else {
            console.log('Error: Nft is not owned by user');
            return;
        }
    }
    console.log("Add NFT = ", mint.toBase58(), userTokenAccount.toBase58());

    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

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
   
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    let userTokenAccountFirst = await getAssociatedTokenAccount(userAddress, mintFirst);
    let accountOfNFTF = await getNFTTokenAccount(mintFirst);
    if (userTokenAccountFirst.toBase58() !== accountOfNFTF.toBase58()) {
        let nftOwner = await getOwnerOfNFT(mintFirst);
        if (nftOwner.toBase58() === userAddress.toBase58()) userTokenAccountFirst = accountOfNFTF;
        else {
            console.log('Error: Nft is not owned by user');
            return;
        }
    }
    
    let userTokenAccountSecond = await getAssociatedTokenAccount(userAddress, mintSecond);
    let accountOfNFTS = await getNFTTokenAccount(mintSecond);
    if (userTokenAccountSecond.toBase58() !== accountOfNFTS.toBase58()) {
        let nftOwner = await getOwnerOfNFT(mintSecond);
        if (nftOwner.toBase58() === userAddress.toBase58()) userTokenAccountSecond = accountOfNFTS;
        else {
            console.log('Error: Nft is not owned by user');
            return;
        }
    }
    
    console.log("Tier Ready NFT1 = ", mintFirst.toBase58(), userTokenAccountFirst.toBase58());
    console.log("Tier Ready NFT2 = ", mintSecond.toBase58(), userTokenAccountSecond.toBase58());

    const globalPool: GlobalPool | null = await getGlobalState();
    if (globalPool === null) return null;

    let admin = globalPool.admin;
    let userPoolKey = await PublicKey.createWithSeed(
        admin,
        "birth-pool",
        program.programId,
    );

    const poolState: BirthPool | null = await getUserPoolState();
    if (poolState === null) return null;
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

    const rewardVault = await getAssociatedTokenAccount(globalAuthority, REWARD_TOKEN_MINT);

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
    return birth;
}

export const getATokenAccountsNeedCreate = async (
    connection: anchor.web3.Connection,
    walletAddress: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    nfts: anchor.web3.PublicKey[],
) => {
    let instructions = [], destinationAccounts = [];
    for (const mint of nfts) {
        console.log(owner, "this is owner")
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
        if (walletAddress !== owner) {
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
const getOwnerOfNFT = async (nftMintPk : PublicKey) : Promise<PublicKey> => {
    let tokenAccountPK = await getNFTTokenAccount(nftMintPk);
    let tokenAccountInfo = await solConnection.getAccountInfo(tokenAccountPK);
    
    console.log("nftMintPk=", nftMintPk.toBase58());
    console.log("tokenAccountInfo =", tokenAccountInfo);
  
    if (tokenAccountInfo && tokenAccountInfo.data ) {
      let ownerPubkey = new PublicKey(tokenAccountInfo.data.slice(32, 64))
      console.log("ownerPubkey=", ownerPubkey.toBase58());
      return ownerPubkey;
    }
    return new PublicKey("");
}
  
const getTokenAccount = async (mintPk : PublicKey, userPk: PublicKey) : Promise<PublicKey> => {
    let tokenAccount = await solConnection.getProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters: [
          {
            dataSize: 165
          },
          {
            memcmp: {
              offset: 0,
              bytes: mintPk.toBase58()
            }
          },
          {
            memcmp: {
              offset: 32,
              bytes: userPk.toBase58()
            }
          },
        ]
      }
    );
    return tokenAccount[0].pubkey;
}
  
const getNFTTokenAccount = async (nftMintPk : PublicKey) : Promise<PublicKey> => {
    console.log("getNFTTokenAccount nftMintPk=", nftMintPk.toBase58());
    let tokenAccount = await solConnection.getProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters: [
          {
            dataSize: 165
          },
          {
            memcmp: {
              offset: 64,
              bytes: '2'
            }
          },
          {
            memcmp: {
              offset: 0,
              bytes: nftMintPk.toBase58()
            }
          },
        ]
      }
    );
    return tokenAccount[0].pubkey;
}
  
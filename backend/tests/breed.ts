import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, MintLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { Breed } from '../target/types/breed';
import { associated } from '@project-serum/anchor/dist/cjs/utils/pubkey';

const BN = anchor.BN;

const GLOBAL_AUTHORITY_SEED = "global-authority";
const REWARD_TOKEN_MINT = new PublicKey("8EoML7gaBJsgJtepm25wq3GuUCqLYHBoqd3HP1JxtyBx");
const POOL_SIZE = 424_120;

// Configure the client to use the local cluster.
const provider = anchor.Provider.env();
anchor.setProvider(provider);

describe('breed', async () => {

  const program = anchor.workspace.Breed as Program<Breed>;
  const superOwner = anchor.web3.Keypair.fromSecretKey(new Uint8Array([68, 144, 227, 93, 108, 210, 244, 244, 106, 95, 251, 125, 193, 185, 188, 236, 201, 187, 183, 80, 224, 74, 8, 27, 75, 2, 108, 171, 73, 78, 205, 222, 220, 219, 10, 217, 133, 198, 76, 32, 120, 199, 53, 79, 201, 57, 8, 189, 98, 235, 234, 122, 65, 49, 224, 170, 161, 209, 80, 107, 99, 67, 72, 152]));
  const user = anchor.web3.Keypair.fromSecretKey(new Uint8Array([68, 144, 227, 93, 108, 210, 244, 244, 106, 95, 251, 125, 193, 185, 188, 236, 201, 187, 183, 80, 224, 74, 8, 27, 75, 2, 108, 171, 73, 78, 205, 222, 220, 219, 10, 217, 133, 198, 76, 32, 120, 199, 53, 79, 201, 57, 8, 189, 98, 235, 234, 122, 65, 49, 224, 170, 161, 209, 80, 107, 99, 67, 72, 152]));
  const reward = anchor.web3.Keypair.fromSecretKey(new Uint8Array([154, 43, 74, 184, 192, 57, 192, 123, 59, 172, 107, 58, 107, 47, 129, 73, 187, 15, 160, 217, 13, 135, 47, 181, 246, 63, 94, 26, 245, 108, 183, 36, 107, 138, 196, 135, 102, 88, 153, 43, 141, 165, 202, 167, 48, 225, 231, 113, 123, 61, 176, 248, 90, 204, 240, 109, 165, 204, 141, 5, 100, 184, 81, 99]));

  console.log('Reward Token: ', reward.publicKey.toBase58());
  const rewardToken = new Token(
    provider.connection,
    REWARD_TOKEN_MINT,
    TOKEN_PROGRAM_ID,
    superOwner,
  )

  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );
  console.log('GlobalAuthority: ', globalAuthority.toBase58());

  const rewardVault = await getAssociatedTokenAccount(globalAuthority, REWARD_TOKEN_MINT);
  console.log('RewardVault: ', rewardVault.toBase58());

  let nft_token_mint = null;
  let userTokenAccount = null;
  let nft_token_mint_first = null;
  let userTokenAccountFirst = null;
  let nft_token_mint_second = null;
  let userTokenAccountSecond = null;

  it('Is initialized!', async () => {
    // Add your test here.
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(superOwner.publicKey, 9000000000),
      "confirmed"
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 9000000000),
      "confirmed"
    );

    console.log("super owner =", superOwner.publicKey.toBase58());
    console.log("user =", user.publicKey.toBase58());

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );

    // Allocate memory for the account
    const balanceNeeded = await Token.getMinBalanceRentForExemptMint(
      provider.connection,
    );

    const transaction = new anchor.web3.Transaction();
    transaction.add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: superOwner.publicKey,
        newAccountPubkey: REWARD_TOKEN_MINT,
        lamports: balanceNeeded,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
    );
    transaction.add(
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        REWARD_TOKEN_MINT,
        9,
        superOwner.publicKey,
        superOwner.publicKey,sola
      ),
    );
    transaction.add(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        REWARD_TOKEN_MINT,
        rewardVault,
        globalAuthority,
        superOwner.publicKey,
      ),
    );
    const txId = await provider.send(transaction, [reward]);
    await provider.connection.confirmTransaction(txId);


    console.log("globalAuthority =", globalAuthority.toBase58());

    let userPoolKey = await PublicKey.createWithSeed(
      user.publicKey,
      "birth-pool",
      program.programId,
    );
    console.log(POOL_SIZE);
    let ix = SystemProgram.createAccountWithSeed({
      fromPubkey: user.publicKey,
      basePubkey: user.publicKey,
      seed: "birth-pool",
      newAccountPubkey: userPoolKey,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(POOL_SIZE),
      space: POOL_SIZE,
      programId: program.programId,
    });

    const tx = await program.rpc.initialize(
      bump, {
      accounts: {
        admin: superOwner.publicKey,
        globalAuthority,
        birthPool: userPoolKey,
        vault: rewardVault,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
      instructions: [
        ix
      ],
      signers: [superOwner],
    });
    console.log("Your transaction signature", tx);
  });

  it('Add NFT to Birth 2-pool', async () => {
    // Mint one Tier NFT for user
    nft_token_mint = await Token.createMint(
      provider.connection,
      user,
      superOwner.publicKey,
      null,
      0,
      TOKEN_PROGRAM_ID
    );
    userTokenAccount = await nft_token_mint.createAccount(user.publicKey);
    await nft_token_mint.mintTo(
      userTokenAccount,
      superOwner,
      [],
      1
    );
    console.log("TIER NFT = ", nft_token_mint.publicKey.toBase58(), userTokenAccount.toBase58());

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
      provider.connection,
      user.publicKey,
      globalAuthority,
      [nft_token_mint.publicKey]
    );

    console.log("Dest NFT Account = ", destinationAccounts[0].toBase58());
    console.log("Program ID =", program.programId.toBase58());

    let userPoolKey = await PublicKey.createWithSeed(
      user.publicKey,
      "birth-pool",
      program.programId,
    );

    const tx = await program.rpc.add(
      bump, 2, {
      accounts: {
        owner: user.publicKey,
        birthPool: userPoolKey,
        globalAuthority,
        userTokenAccount,
        destNftTokenAccount: destinationAccounts[0],
        nftMint: nft_token_mint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      instructions: [
        ...instructions,
      ],
      signers: [user],
    }
    );
    await provider.connection.confirmTransaction(tx, "singleGossip");
    // let poolState = await program.account.birthPool.fetch(userPoolKey);
    // console.log(poolState);

  });

  it('It is breed', async () => {
    nft_token_mint_first = await Token.createMint(
      provider.connection,
      user,
      superOwner.publicKey,
      null,
      0,
      TOKEN_PROGRAM_ID
    );
    userTokenAccountFirst = await nft_token_mint_first.createAccount(user.publicKey);

    await nft_token_mint_first.mintTo(
      userTokenAccountFirst,
      superOwner,
      [],
      1
    );
    console.log("TIER1 NFT1 = ", nft_token_mint_first.publicKey.toBase58(), userTokenAccountFirst.toBase58());

    nft_token_mint_second = await Token.createMint(
      provider.connection,
      user,
      superOwner.publicKey,
      null,
      0,
      TOKEN_PROGRAM_ID
    );
    userTokenAccountSecond = await nft_token_mint_second.createAccount(user.publicKey);

    await nft_token_mint_second.mintTo(
      userTokenAccountSecond,
      superOwner,
      [],
      1
    );
    console.log("TIER1 NFT2 = ", nft_token_mint_second.publicKey.toBase58(), userTokenAccountSecond.toBase58());

    let userPoolKey = await PublicKey.createWithSeed(
      user.publicKey,
      "birth-pool",
      program.programId,
    );
    let poolState = await program.account.birthPool.fetch(userPoolKey);
    let index = poolState.amountCount2.toNumber() - 1;
    let birth = poolState.nftTier2[index];

    let result1 = await getATokenAccountsNeedCreate(
      provider.connection,
      user.publicKey,
      globalAuthority,
      [nft_token_mint_first.publicKey, nft_token_mint_second.publicKey, birth]
    );

    let first_dest_acc = result1.destinationAccounts[0];
    let second_dest_acc = result1.destinationAccounts[1];
    let birth_acc = result1.destinationAccounts[2];

    let result2 = await getATokenAccountsNeedCreate(
      provider.connection,
      user.publicKey,
      user.publicKey,
      [REWARD_TOKEN_MINT, birth]
    );

    let user_util_acc = result2.destinationAccounts[0];
    let born_acc = result2.destinationAccounts[1];

    if (result2.instructions.length > 0) {
      const transaction = new anchor.web3.Transaction();
      for (let ins of result2.instructions)
        transaction.add(ins);
      const txId = await provider.send(transaction, [user]);
      await provider.connection.confirmTransaction(txId);
    }

    await rewardToken.mintTo(
      user_util_acc,
      superOwner.publicKey,
      [],
      10_000_000_000
    );

    console.log("Birth NFT = ", birth.toBase58());
    console.log('owner', user.publicKey.toBase58(), '\nGlobalAuthority',
      globalAuthority.toBase58(), '\nBirthpool',
      userPoolKey.toBase58(), '\nFirst Mint=    ',
      nft_token_mint_first.publicKey.toBase58(), '\n First User Token Acc:  ',
      userTokenAccountFirst.toBase58(), '\n First Dest Token Acc',
      first_dest_acc.toBase58(), '\n Second Mint      ',
      nft_token_mint_second.publicKey.toBase58(), '\n Second User Token Acc: ',
      userTokenAccountSecond.toBase58(), '\n Second Dest Token Acc',
      second_dest_acc.toBase58(), '\n Util token Acc',
      user_util_acc.toBase58(), '\n Vault util Token Acc',
      rewardVault.toBase58(), '\n Birth Mint',
      birth.toBase58(), '\n Birth POol acc   ',
      birth_acc.toBase58(), '\n User BOrn acc ',
      born_acc.toBase58(), '\n Token Program',
      TOKEN_PROGRAM_ID.toBase58());
    const tx = await program.rpc.breed(
      bump, 2, {
      accounts: {
        owner: user.publicKey,
        globalAuthority,
        birthPool: userPoolKey,
        firstMint: nft_token_mint_first.publicKey,
        firstUserTokenAccount: userTokenAccountFirst,
        firstDestNftTokenAccount: first_dest_acc,
        secondMint: nft_token_mint_second.publicKey,
        secondUserTokenAccount: userTokenAccountSecond,
        secondDestNftTokenAccount: second_dest_acc,
        utilTokenAccount: user_util_acc,
        vaultUtilTokenAccount: rewardVault,
        birthMint: birth,
        birthPoolAccount: birth_acc,
        userBornAccount: born_acc,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      instructions: [
        ...result1.instructions,
        // ...result2.instructions,
      ],
      signers: [user],
    }
    );
    await provider.connection.confirmTransaction(tx, "singleGossip");
    poolState = await program.account.birthPool.fetch(userPoolKey);
    console.log(poolState.amountCount2.toNumber());
    console.log(poolState.amountCount1.toNumber());

  });

});

export const getATokenAccountsNeedCreate = async (
  connection: anchor.web3.Connection,
  walletAddress: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey,
  nfts: anchor.web3.PublicKey[],
) => {
  let instructions = [], destinationAccounts = [];
  for (const mint of nfts) {
    const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
    const response = await connection.getAccountInfo(destinationPubkey);
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
  }
  return {
    instructions,
    destinationAccounts,
  };
}

export const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
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

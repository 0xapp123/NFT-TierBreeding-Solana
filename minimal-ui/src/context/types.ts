import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export interface GlobalPool {
    admin: PublicKey,       // 32
    breedTimes: anchor.BN,  // 8
}

export interface BirthPool {
    admin: PublicKey,
    nftTier2: PublicKey[],
    nftTier3: PublicKey[],
    nftTier4: PublicKey[],
    nftTier5: PublicKey[],
    nftTier6: PublicKey[],
    nftTier7: PublicKey[],
    nftTier8: PublicKey[],
    nftTier9: PublicKey[],
    nftTier10: PublicKey[],
    amountCount1: anchor.BN,
    amountCount2: anchor.BN,
    amountCount3: anchor.BN,
    amountCount4: anchor.BN,
    amountCount5: anchor.BN,
    amountCount6: anchor.BN,
    amountCount7: anchor.BN,
    amountCount8: anchor.BN,
    amountCount9: anchor.BN,
    amountCount10: anchor.BN,
}

export interface Item {
    firstNftAddress: PublicKey,
    seecondNftAddress: PublicKey,
}
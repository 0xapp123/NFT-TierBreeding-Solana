import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { PublicKey } from '@solana/web3.js';
import { breed, getNftMetaData, getUserPoolState } from '../../context/helper';
import { TIER1_CREATOR, TIER2_CREATOR } from '../../config';

export default function BasicButtons({ NFTaddr1, NFTaddr2, walletAddress, setAddress, ...props }) {
  const buttonClicked = async () => {
    console.log('NFTaddr1    ', NFTaddr1);
    console.log('NFTaddr2    ', NFTaddr2);
    const poolState = await getUserPoolState();

    const NFTdata1 = await getNftMetaData(new PublicKey(NFTaddr1));
    const NFTdata2 = await getNftMetaData(new PublicKey(NFTaddr2));

    if (
      NFTdata1.data.data.creators[0].address === TIER1_CREATOR &&
      NFTdata2.data.data.creators[0].address === TIER1_CREATOR
    ) {
      if (poolState.amountCount2.toNumber() === 0) {
        alert("There isn't any Tier2! Please wait to charge them!");
        return;
      }
      const birth = await breed(
        new PublicKey(walletAddress),
        new PublicKey(NFTaddr1),
        new PublicKey(NFTaddr2),
        2
      );
      setAddress(birth.toBase58());
    }

    if (
      NFTdata1.data.data.creators[0].address === TIER2_CREATOR &&
      NFTdata2.data.data.creators[0].address === TIER2_CREATOR
    ) {
      if (poolState.amountCount3.toNumber() === 0) {
        alert("There isn't any Tier3! Please wait to charge them!");
        return;
      }
      const birth = await breed(
        new PublicKey(walletAddress),
        new PublicKey(NFTaddr1),
        new PublicKey(NFTaddr2),
        3
      );
      setAddress(birth.toBase58());
    }
  };

  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained" className="button" id="roll-button" onClick={buttonClicked}>
        Swap
      </Button>
    </Stack>
  );
}

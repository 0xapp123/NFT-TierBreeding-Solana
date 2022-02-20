import Deposit from '../components/deposit/Deposit';
import Dice from '../components/Dice';
import Dice2 from '../components/Dice2';
import Dice3 from '../components/Dice3';
import { useEffect, useState } from 'react';
import { web3 } from '@project-serum/anchor';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { useWallet } from '@solana/wallet-adapter-react';
import { TIER2_CREATOR, TIER1_CREATOR, TIER3_CREATOR } from '../config';

export default function Home() {
  // const solConnection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
  const solConnection = new web3.Connection(web3.clusterApiUrl('devnet'));
  // ------------page state-----------
  const wallet = useWallet();

  // ------------content state-----------
  const [unstaked1, setUnstaked1] = useState([]);
  const [unstaked2, setUnstaked2] = useState([]);
  const [unstaked3, setUnstaked3] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');

  const getNFTs = async () => {
    let nftDump1 = [];
    let nftDump2 = [];
    let nftDump3 = [];

    const unstakedNftList = await getMetadataDetail();
    console.log(unstakedNftList, 'unstakedNFTList-===========-');
    if (unstakedNftList !== undefined) {
      for (let item of unstakedNftList) {
        if (item.data.creators && item.data.creators[0]?.address === TIER2_CREATOR) {
          await fetch(item.data.uri)
            .then((resp) => resp.json())
            .then((json) => {
              nftDump1.push({
                name: json.name,
                image: json.image,
                mint: item.mint
              });
            });
        }
        if (item.data.creators && item.data.creators[0]?.address === TIER1_CREATOR) {
          await fetch(item.data.uri)
            .then((resp) => resp.json())
            .then((json) => {
              nftDump2.push({
                name: json.name,
                image: json.image,
                mint: item.mint
              });
            });
        }
        if (item.data.creators && item.data.creators[0]?.address === TIER3_CREATOR) {
          await fetch(item.data.uri)
            .then((resp) => resp.json())
            .then((json) => {
              nftDump3.push({
                name: json.name,
                image: json.image,
                mint: item.mint
              });
            });
        }
      }
    }
    setUnstaked1(nftDump2);
    setUnstaked2(nftDump1);
    setUnstaked3(nftDump3);
    console.log(nftDump1, '===>unstaked nfts -1');
    console.log(nftDump2, '===>unstaked nfts -2');
    console.log(nftDump3, '===>unstaked nfts -3');
  };

  const getMetadataDetail = async () => {
    const nftsList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey,
      connection: solConnection
    });
    return nftsList;
  };

  const updatePageStates = () => {
    getNFTs();
    setWalletAddress(wallet.publicKey.toBase58());
  };

  useEffect(() => {
    console.log(wallet.publicKey, 'walletpubkey');
    if (wallet.publicKey !== null) {
      updatePageStates();
    } else {
      setUnstaked1([]);
      setUnstaked2([]);
    }
    // eslint-disable-next-line
  }, [wallet.connected]);

  return (
    <div className="main-content">
      <Dice mintFirst={unstaked1} />
      <Dice2 mintSecond={unstaked2} />
      <Dice3 mintThird={unstaked3} />
      <Deposit walletAddress={walletAddress} />
    </div>
  );
}

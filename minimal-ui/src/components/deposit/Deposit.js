import { useState } from 'react';
import BasicButtons from './BasicButtons';
import ColorTextFields from './ColorTextFields';
import ColorTextFields2 from './ColorTextFields2';
import { useWallet } from '@solana/wallet-adapter-react';
import ColorTextFields3 from './ColorTextFields3';
export default function Deposit({ walletAddress, ...props }) {
  const wallet = useWallet();
  const [NFTaddr1, setNFTaddr1] = useState('');
  const [NFTaddr2, setNFTaddr2] = useState('');
  const [address, setAddress] = useState('');

  return (
    <div className="deposit">
      {wallet.publicKey !== null && (
        <>
          <ColorTextFields setNFTaddr1={(e) => setNFTaddr1(e)} />
          <ColorTextFields2 setNFTaddr2={(e) => setNFTaddr2(e)} />
          <BasicButtons
            NFTaddr1={NFTaddr1}
            NFTaddr2={NFTaddr2}
            walletAddress={walletAddress}
            setAddress={(value) => setAddress(value)}
          />
          <ColorTextFields3 address={address} />
        </>
      )}
    </div>
  );
}

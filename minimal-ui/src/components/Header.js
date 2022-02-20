import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Header() {
  return (
    <div className="header">
      <div className="wallet-button">
        <WalletModalProvider>
          <WalletMultiButton />
        </WalletModalProvider>
      </div>
      <div className="header-content">
        <h1>
          🌞🎲💦<span className="enivro">enviro</span> UPGRADE SYSTEM💦🎲🌞
        </h1>
      </div>
    </div>
  );
}

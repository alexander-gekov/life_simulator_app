import { ConnectWallet, ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs, Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

const Home: NextPage = () => {
  // This is the address of our Life Simulator contract. You can find it in the Thirdweb dashboard.
  const {contract} = useContract("0x09E25aE9b62d8A3221694964fc8D13Ff9fdab4cA");

  // This is the address of the currently connected user's wallet.
  const address = useAddress();

  // This is a list of all the NFTs owned by the currently connected user.
  const { data: nfts } = useOwnedNFTs(contract, address);

  // This is the Elder NFT. We'll use it to show a confetti animation when the user owns it.
  const elderOwned = nfts?.find(nft => nft.metadata.id === "3");

  const { width, height } = useWindowSize()

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Confetti animation if we own the Elder NFT */}
        {elderOwned ? <Confetti width={width} height={height} /> : null}
        {/* Connect Wallet button */}
        <div className={styles.connect}>
          <ConnectWallet />
        </div>
        {elderOwned ? <div className={styles.celebrateText}>CONGRATULATIONS! YOU WON!</div> : null}
        {/* The Grid displaying our NFTs */}
        <div className={styles.grid}>{nfts?.map(nft => <div className={styles.nft} key={nft.metadata.id.toString()}>
          <ThirdwebNftMedia width="300"  metadata={nft.metadata} />
          {nft.metadata.name}
          <div>({nft.quantityOwned})</div>
          </div>)}</div>
        {/* Button for claiming a Baby NFT */}
        <Web3Button contractAddress="0x09E25aE9b62d8A3221694964fc8D13Ff9fdab4cA" action={contract => contract.erc1155.claim(0,1)}>Claim a Baby</Web3Button>
        <hr style={{margin: 10}} />
        {/* Button for aging our human */}
        <Web3Button accentColor="blue" contractAddress="0x09E25aE9b62d8A3221694964fc8D13Ff9fdab4cA" action={contract => contract.call("age")}>Age 💀</Web3Button>
      </main>
    </div>
  );
};

export default Home;

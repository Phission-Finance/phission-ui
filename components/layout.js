import Navbar from "./navbar";
import bg from "../assets/background.jpg";
import styles from "./layout.module.css";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Layout({ children }) {
    const { isConnected } = useAccount();
    return (
        <div className={styles.page}>
            <Navbar className={styles.navbar} />
            <main className={styles.main}>
                {isConnected ? (
                    <div>
                        <div className={styles.disclaimer}>
                            <p className={styles.disclaimerText}>
                                Disclaimer.
                                <br />
                                This brand-new protocol unlocks yield never seen before in DeFi. Please examine the docs
                                and understand all the risks before continuing.
                                <br />
                                Welcome to Phission.Finance but take care, anon.
                            </p>
                        </div>
                        {children}
                        <br />
                        <br />
                    </div>
                ) : (
                    <div className={styles.container}>
                        <h3>Connect Wallet to use Phission</h3>
                        <ConnectButton />
                    </div>
                )}
            </main>
            {/*<Footer />*/}
        </div>
    );
}

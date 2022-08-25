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
                                Phission is a brand-new, unaudited protocol that relies on novel mechanisms. Please read
                                the documentation and smart contracts to understand the risks involved.
                                <br />
                                <br />
                                By continuing, you affirm that you are not a United states citizen, resident or entity
                                and that you have read and agree to the{" "}
                                <a href="https://phission-finance.gitbook.io/phission/getting-started/phission-finance#terms-of-use">
                                    Terms of Use
                                </a>{" "}
                                outlined in the documentation.
                                <br />
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

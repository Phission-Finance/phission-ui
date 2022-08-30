// import Navbar from "./navbar";
import styles from "./layout.module.css";
import {useAccount} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useState} from "react";
import Image from "next/image";
import ghLogo from '../assets/github.svg'
import twitterLogo from '../assets/twitter.svg'
import discordLogo from '../assets/discord.svg'
import Navbar from "./navbar";

export default function Layout({children}) {
    const {isConnected} = useAccount();
    const [hideDisclaimer, setHideDisclaimer] = useState(false);

    async function openInNewTab(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    return (
        <div className={styles.page}>
            <Navbar className={styles.navbar}/>
            <main className={styles.main}>
                {isConnected ? (
                    <div>
                        <div hidden={hideDisclaimer} className={styles.disclaimer}>
                            <p className={styles.disclaimerText}>
                                Phission is a brand-new, unaudited protocol that relies on novel mechanisms. Please read
                                the documentation and smart contracts to understand the risks involved.
                                <br/>
                                <br/>
                                By continuing, you affirm that you are not a United States citizen, resident or entity
                                and that you have read and agree to the{" "}
                                <a href="https://phission-finance.gitbook.io/phission/getting-started/phission-finance#terms-of-use">
                                    Terms of Use
                                </a>{" "}
                                outlined in the documentation.
                                <br/>
                                <br/>
                                Welcome to Phission.Finance but take care, anon.
                            </p>
                            <button onClick={() => setHideDisclaimer(true)}>Close</button>
                        </div>
                        {children}
                        <br/>
                        <br/>
                    </div>
                ) : (
                    <div className={styles.container}>
                        <h3>Connect Wallet to use Phission</h3>
                        <ConnectButton/>
                    </div>
                )}
            </main>
            <footer className={styles.footer}>
                <div className={styles.footerLogo}
                     onClick={() => openInNewTab("https://github.com/Phission/Phission-Finance")}>
                    <Image src={ghLogo.src} alt={"github"} height={"60px"} width={"40px"}/>
                </div>
                <div className={styles.footerLogo} onClick={() => openInNewTab("https://twitter.com/PhissionFinance")}>
                    <Image src={twitterLogo.src} alt={"twitter"} height={"60px"} width={"40px"}/>
                </div>
                <div className={styles.footerLogo}
                     onClick={() => openInNewTab("https://discord.com/invite/fXJDRr9PwW")}>
                    <Image src={discordLogo.src} alt={"discord"} height={"60px"} width={"40px"}/>
                </div>
            </footer>
        </div>
    );
}

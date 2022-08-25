import Head from "next/head";
import Link from "next/link";
import styles from "./navbar.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { tokenDictionary } from "../const/const";
import LoadingButton from "./loadingButton";
import { useAccount } from "wagmi";
import logo from "../assets/logo2.svg";
import Image from "next/image";

export default function Navbar() {
    const { isConnected } = useAccount();

    async function addAssetsToWallet() {
        for (const [key, t] of Object.entries(tokenDictionary)) {
            // @ts-ignore
            addAssetToWallet(t.address, t.symbol, t.decimals);
        }
    }

    async function addAssetToWallet(address, symbol, decimals) {
        try {
            if (window.ethereum) {
                const wasAdded = await window.ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                        type: "ERC20", // Initially only supports ERC20, but eventually more!
                        options: {
                            address: address, // The address that the token is at.
                            symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
                            decimals: decimals, // The number of decimals in the token
                            // image: tokenImage, // A string url of the token logo
                        },
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Head>
                <title>Phission Finance</title>
            </Head>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <Link href="/">
                        <a>
                            <Image src={logo} alt={"phission"} layout="fill" objectFit="contain" />
                        </a>
                    </Link>
                </div>

                {isConnected ? (
                    <div className={styles.menuItems}>
                        <Link href="/zap">
                            <a className={styles.menuItem}>Zap</a>
                        </Link>

                        <Link href="/mint">
                            <a className={styles.menuItem}>Mint</a>
                        </Link>

                        <Link href="/stake">
                            <a className={styles.menuItem}>Stake</a>
                        </Link>

                        <Link href="/redeem">
                            <a className={styles.menuItem}>Redeem</a>
                        </Link>

                        <Link href="">
                            <a
                                className={styles.menuItem}
                                onClick={async () =>
                                    window.open("https://phission-finance.gitbook.io/", "_blank", "noopener,noreferrer")
                                }
                            >
                                Docs
                            </a>
                        </Link>
                    </div>
                ) : (
                    ""
                )}

                <div className={styles.walletInfo}>
                    <LoadingButton
                        text={"Add Tokens"}
                        action={addAssetsToWallet}
                        disabled={false}
                        className={styles.addTokens}
                        width={"100px"}
                    />

                    <ConnectButton />
                </div>
            </header>
        </>
    );
}

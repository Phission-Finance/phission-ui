import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import {RainbowKitProvider, getDefaultWallets, darkTheme, midnightTheme} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import bg from '../assets/background.png'
import favicon from '../assets/favicon.ico'
import Layout from '../components/layout'
import {useRouter} from "next/router";
import {utils} from "ethers";
import {useState} from "react";
import Head from "next/head";


const verifyHash = "0x5c3a609fc84334a2bedf159a9bd27d7e098e4a2ddca182e7bab3ad3d9362965d"

const { chains, provider, webSocketProvider } = configureChains(
  [
    // chain.mainnet,
      chain.ropsten,
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC',
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});




function MyApp({ Component, pageProps }: AppProps) {

    const [verify, setVerify] = useState(true)

    // const router = useRouter()
    // if (router.query.secret) {
    //     let hash = utils.keccak256(utils.toUtf8Bytes(router.query.secret as string))
    //     if (hash === verifyHash) {
    //         if (!verify) {
    //             setVerify(true)
    //         }
    //     }
    // }

    // console.log("query", router.query);

    if (verify) {
        return (
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider showRecentTransactions={true} chains={chains}>
                    <Head>
                        <link rel="shortcut icon" href={favicon.src} />
                        <title>Phission Finance</title>
                    </Head>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </RainbowKitProvider>
            </WagmiConfig>
        );
    } else {
        return (
            <div className="placeholder-background" style={{backgroundImage: `url(${bg.src})`,}}></div>
        )
    }

}

export default MyApp;

import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import {RainbowKitProvider, getDefaultWallets, darkTheme, midnightTheme} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Layout from '../components/layout'
import Head from "next/head";

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
      // chain.ropsten,
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
        return (
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider showRecentTransactions={true} chains={chains}>
                    <Head>
                        <title>Phission Finance</title>
                    </Head>

                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </RainbowKitProvider>
            </WagmiConfig>
        );
}

export default MyApp;

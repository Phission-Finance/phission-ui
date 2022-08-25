import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import {RainbowKitProvider, getDefaultWallets, darkTheme, midnightTheme} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import bg from '../assets/background.png'
import Layout from '../components/layout'


const LIVE = true

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
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

    if (LIVE) {
        return (
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider showRecentTransactions={true} chains={chains}>
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

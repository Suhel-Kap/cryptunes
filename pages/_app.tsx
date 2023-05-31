import '../styles/globals.css'
import type {AppProps} from 'next/app'
import '@rainbow-me/rainbowkit/styles.css';

import {
    darkTheme,
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {Chain, configureChains, createClient, WagmiConfig} from 'wagmi'
import {alchemyProvider} from 'wagmi/providers/alchemy';
import {publicProvider} from 'wagmi/providers/public';
import '@/styles/globals.css'
import {OrbisProvider} from "../contexts/OrbisContext";

const mantleTestnet: Chain = {
    name: 'Mantle Testnet',
    id: 5001,
    rpcUrls: {
        default: {
            http: ["https://rpc.testnet.mantle.xyz"]
        },
        public: {
            http: ["https://rpc.testnet.mantle.xyz"]
        }
    },
    testnet: true,
    nativeCurrency: {
        decimals: 18,
        name: "$BIT",
        symbol: "BIT"
    },
    network: "mantle",
}

const {chains, provider} = configureChains(
    [mantleTestnet],
    [
        alchemyProvider({apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID!}),
        publicProvider()
    ]
);

const {connectors} = getDefaultWallets({
    appName: 'Cryptunes',
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

function MyApp({Component, pageProps}: AppProps) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains} theme={darkTheme()} coolMode modalSize={"compact"}>
                <OrbisProvider>
                    <Component {...pageProps} />
                </OrbisProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

export default MyApp

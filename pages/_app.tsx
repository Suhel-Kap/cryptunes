import '../styles/globals.css'
import type {AppProps} from 'next/app'
import '@rainbow-me/rainbowkit/styles.css';

import {
    darkTheme,
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {configureChains, createClient, WagmiConfig} from 'wagmi';
import {fantomTestnet} from 'wagmi/chains';
import {alchemyProvider} from 'wagmi/providers/alchemy';
import {publicProvider} from 'wagmi/providers/public';
import '@/styles/globals.css'
import {OrbisProvider} from "../contexts/OrbisContext";

const {chains, provider} = configureChains(
    [fantomTestnet],
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

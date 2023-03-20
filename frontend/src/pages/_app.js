import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
// switchNetwork(bssctestChain);
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { goerli, optimismGoerli, bscTestnet } from '@wagmi/core/chains'
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import '../styles/Home.module.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';


const { chains, provider } = configureChains([goerli, optimismGoerli, bscTestnet], [publicProvider()])
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )

}

export default MyApp

import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
// switchNetwork(bssctestChain);
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { goerli, optimismGoerli, polygonMumbai } from '@wagmi/core/chains'
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import '../styles/Home.module.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

const scrollAlpha = {
  id: 534353,
  name: 'scrollAlpha',
  network: 'scrollAlpha',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      'http': ['https://alpha-rpc.scroll.io/l2']
    },
  },
  testnet: true,
}


const polygonZk = {
  id: 1442,
  name: 'polygonZk',
  network: 'polygonZk',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      'http': ['https://rpc.public.zkevm-test.net']
    },
  },
  testnet: true,
}

const { chains, provider } = configureChains([goerli, optimismGoerli, polygonMumbai, scrollAlpha, polygonZk], [publicProvider()])
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

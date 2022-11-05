import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
const activeChainId = ChainId.Goerli;

const config = {
  projectId: '9405909119',
  theme: 'dark',
  accentColor: 'default',
  ethereum: {
    appName: 'web3Modal'
  }
}

function MyApp({ Component, pageProps }) {
  return <>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  </>
}

export default MyApp

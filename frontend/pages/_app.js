import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from "react";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import Head from "next/head";
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
  useEffect(() => {
      import("bootstrap/dist/js/bootstrap");
  }, []);
  return <>
    <ThirdwebProvider desiredChainId={activeChainId}>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  </>
}

export default MyApp

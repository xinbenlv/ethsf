import Head from 'next/head'
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Home() {
  return <>
    <Head>
       <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <ConnectWallet />
  </>
}

import {ConnectWallet} from "@thirdweb-dev/react";

import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <div className="d-flex flex-column h-100">
            <div className="flex-shrink-0">
                <div className="container">
                    <h1 className="mt-5">ETHSF</h1>
                    <ConnectWallet/>
                </div>
            </div>
        </div>
    );
}

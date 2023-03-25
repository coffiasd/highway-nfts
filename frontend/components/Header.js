import Image from 'next/image'
import networkConfig from "../utils/network_config.json";
import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import Link from 'next/link';
import { useEffect } from 'react';
import { alertService } from '../services';

export default function Header() {
    //alert options
    const options = {
        autoClose: true,
        keepAfterRouteChange: false
    }
    // const router = useRouter()
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();
    const { isConnected } = useAccount();
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    // const { chainId } = chain;

    useEffect(() => {
        let chains = [];
        networkConfig.map(function (item, index) {
            chains.push(Number(item.id));
        });
        if (chain) {
            console.log(chains, chain);
            if (!chains.includes(chain.id)) {
                alertService.info("please swith to the correct network", options);
            }
        }

    }, [chain])


    return (
        <div className="navbar bg-base-100 border-solid border-b-2">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href="/">Homepage</Link></li>
                        <li><Link href="/mint">Mint</Link></li>
                        <li><Link href="/swap">Swap</Link></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost normal-case text-xl">Highway NFTs</a>
            </div>
            {/* <div className="flex-1 ml-3">
                <ul className='flex flex-row justify-between gap-6'>
                    <li className="cursor-pointer">
                        <Link href="/">
                            <Image src="/highway.png" width={100} height={80} />
                        </Link>
                    </li>
                    <li>
                        <Link href="/mint" className='text-black text-base font-semibold cursor-pointer items-center justify-center hover:text-red-400'>
                            Mint
                        </Link>
                    </li>
                    <li>
                        <Link href="/swap" className='text-black text-base font-semibold cursor-pointer items-center justify-center hover:text-red-400'>
                            Swap
                        </Link>
                    </li>
                </ul>
            </div> */}

            <div className="flex-none">
            </div>

            <div className="navbar-end">
                {/* {isConnected && <button className="btn btn-sm btn-outline btn-warning ml-3 normal-case" onClick={() => switchNetwork()}>Switch</button>} */}

                {/* {isConnected && ['id1', 'id2', 'id3'].in != 5001 && <button className="btn btn-sm btn-warning ml-3 normal-case" onClick={() => switchNetwork(5)}>switch net</button>} */}

                {!isConnected && (<button className="btn btn-sm btn-outline btn-warning ml-3 normal-case" onClick={openConnectModal}>connect wallet</button>)}

                {isConnected && chain &&
                    (<><button className="btn btn-sm btn-outline btn-success ml-3 normal-case" onClick={openAccountModal}>Profile</button><button className="btn btn-sm btn-outline btn-error ml-3 normal-case " onClick={openChainModal}>Chain</button></>)
                }


            </div>
        </div >
    )
}
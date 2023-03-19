import Image from 'next/image'
import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { useRouter } from 'next/router'
import Link from 'next/link';
import styles from '../src/styles/Home.module.css';

export default function Header() {
    const router = useRouter()
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();
    const { isConnected } = useAccount();
    const { switchNetwork } = useSwitchNetwork()
    const { chain } = useNetwork();

    return (
        <div className="navbar text-neutral-content border-solid border-b-2">
            <div className="flex-1 ml-3">
                <ul className='flex flex-row justify-between gap-6'>
                    <li className="cursor-pointer">
                        <Link href="/">
                            <Image src="/eth-logo.png" width={40} height={40} />
                        </Link>
                    </li>
                    <li>
                        <Link href="/mint" className='text-black cursor-pointer ml-2 flex items-center justify-center h-10 hover:bg-accent p-2 rounded-xl'>
                            <div className={`${styles.leftToRight}` + "text-2xl font-semibold"}>
                                mint
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/swap" className='text-black cursor-pointer flex items-center justify-center h-10 hover:bg-orange-200 p-2 rounded-xl'>
                            <div className={`${styles.leftToRight}` + "text-2xl font-semibold"}>
                                swap
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="flex-none">
            </div>

            <div className="navbar-end">
                {isConnected && chain.id != 5001 && <button className="btn btn-sm btn-warning ml-3 normal-case" onClick={() => switchNetwork(5001)}>switch net</button>}

                {!isConnected && (<button className="btn btn-sm btn-warning ml-3 normal-case" onClick={openConnectModal}>connect wallet</button>)}

                {isConnected && chain && chain.id == 5001 &&
                    (<><button className="btn btn-sm btn-primary ml-3 normal-case" onClick={openAccountModal}>Profile</button><button className="btn btn-sm btn-primary ml-3 normal-case " onClick={openChainModal}>Chain</button><button className="btn btn-sm btn-primary mx-3 normal-case " onClick={() => { router.push('/profile') }}>Info</button></>)
                }
            </div>
        </div >
    )
}
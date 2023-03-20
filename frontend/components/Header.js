import Image from 'next/image'
import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi'
import Link from 'next/link';

export default function Header() {
    // const router = useRouter()
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();
    const { isConnected } = useAccount();
    const { chain } = useNetwork();

    return (
        <div className="navbar text-neutral-content border-solid border-b-2">
            <div className="flex-1 ml-3">
                <ul className='flex flex-row justify-between gap-6'>
                    <li className="cursor-pointer">
                        <Link href="/">
                            <Image src="/eth-logo.png" width={20} height={20} />
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
            </div>

            <div className="flex-none">
            </div>

            <div className="navbar-end">
                {/* {isConnected && <button className="btn btn-sm btn-outline btn-warning ml-3 normal-case" onClick={() => switchNetwork()}>Switch</button>} */}

                {!isConnected && (<button className="btn btn-sm btn-outline btn-warning ml-3 normal-case" onClick={openConnectModal}>connect wallet</button>)}

                {isConnected && chain &&
                    (<><button className="btn btn-sm btn-outline btn-success ml-3 normal-case" onClick={openAccountModal}>Profile</button><button className="btn btn-sm btn-outline btn-error ml-3 normal-case " onClick={openChainModal}>Chain</button></>)
                }
            </div>
        </div >
    )
}
import Link from 'next/link';
import { FaWrench } from "react-icons/fa";
import dynamic from 'next/dynamic';
import { Web3Storage } from 'web3.storage'

const AvatarList = dynamic(() => import('../components/AvatarList'), {
    ssr: false,
})

export default function Banner() {
    /// get web3.storage config token
    function getAccessToken() {
        console.log(process.env);
        return process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN
    }

    /// get a new web3.storage client
    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() })
    }

    async function listWithLimits() {
        const client = makeStorageClient()

        // get today's date and subtract 1 day
        const d = new Date()
        d.setDate(d.getDate())

        // the list method's before parameter accepts an ISO formatted string
        const before = d.toISOString()

        // limit to ten results
        const maxResults = 18

        for await (const upload of client.list({ before, maxResults })) {
            // console.log("upload:", upload)
            console.log("https://" + upload.cid + ".ipfs.w3s.link/avatar.png");
        }
    }

    // listWithLimits();

    return (
        <div className="dark:bg-gray-800 overflow-hidden relative lg:flex lg:items-center h-screen">

            <div className="w-full py-12 ml-10 -mt-20 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
                <h2 className="text-2xl font-extrabold text-black dark:text-white sm:text-4xl">
                    <span className="block">
                        Cross Chains Highway NFTs
                    </span>
                </h2>
                <p className="text-md mt-4 text-gray-400">
                    Generate NFTs by yourself, choose the best one, put it on the blockchain forever.
                </p>
                <div className="lg:mt-0 lg:flex-shrink-0">
                    <div className="mt-12 inline-flex">
                        <Link href="#myAvatar">
                            <button className="btn btn-wide btn-warning gap-2">
                                Customize
                                <FaWrench size="1rem" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-rows-3 grid-flow-col gap-6 mr-32 -mt-20">
                {[...Array(18)].map((x, i) => (
                    <div key={i}><AvatarList /></div>
                ))}

            </div>
        </div>
    )
}
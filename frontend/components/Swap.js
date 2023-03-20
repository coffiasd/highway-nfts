import { BiSortAlt2, BiCog } from "react-icons/bi";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { ethers } from 'ethers'
import networkConfig from "../utils/network_config.json";
import { useEffect, useState } from "react";
import {
    useChainModal,
} from '@rainbow-me/rainbowkit';

import styles from '../src/styles/Home.module.css';
import Image from "next/image";

//alert
import { alertService } from '../services';
import ERC20ABI from 'erc-20-abi';

import mintJSON from '../utils/mint.json';
import { useNetwork, useAccount } from 'wagmi'

// const NFTs = [
//     { "image": "/azuki2.png" },
//     { "image": "/azuki2.png" },
//     { "image": "/azuki2.png" },
//     { "image": "/azuki2.png" },
//     { "image": "/azuki2.png" }
// ];

export default function Swap() {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(contractAddress, mintJSON.abi, signer);
    const { openChainModal } = useChainModal();
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();

    //button loading
    const [loading, setLoading] = useState("");

    //default stage 0
    const [stage, setStage] = useState(0);

    // modal
    const [modal, setModal] = useState("");
    const [modalToken, setModalToken] = useState("");
    const [modalto, setModalto] = useState("");

    //token option
    const [NFTs, setNFTs] = useState([]);
    const [NFT, setNFT] = useState(null);
    const [to, setTo] = useState(null);

    //swap address
    const [swapAddress, setSwapAddress] = useState("");

    //alert options
    const options = {
        autoClose: true,
        keepAfterRouteChange: false
    }

    // getNFTsList();
    useEffect(() => {
        getNFTsList();
    }, [chain])

    async function connectWallet(network, type) {

    }

    async function getTokenURI(tokenId) {
        const tokenURI = await connectedContract.tokenURI(tokenId);
        console.log("tokenURI:", tokenURI);
        return JSON.parse(tokenURI);
    }

    //get user NFTs list
    async function getNFTsList() {
        if (!address) {
            return
        }
        let ret = [];
        let list = await connectedContract.getTokenListArray(address);
        console.log("NFTs:", list);
        for (let i = 0; i < list.length; i++) {
            ret.push(await getTokenURI(list[i]));
        }
        console.log("ret", ret);
        setNFTs(ret);
    }

    const AddresshandleChange = (event) => {
        setSwapAddress(event.target.value);
    };

    //to change event.
    async function selecttoChangeHandle(index) {
        myModal6ClickHandle();
        setTo(index);
    }

    /// control modal
    const modalClick = () => {
        if (modal == "") {
            setModal("modal-open");
        } else {
            setModal("");
        }
    }

    const myModal5ClickHandle = () => {
        if (modalToken == "") {
            setModalToken("modal-open");
        } else {
            setModalToken("");
        }
    }

    const myModal6ClickHandle = () => {
        if (modalto == "") {
            setModalto("modal-open");
        } else {
            setModalto("");
        }
    }

    window.onclick = function (event) {
        var modal5 = document.getElementById('my-modal-5');
        var modal6 = document.getElementById('my-modal-6');
        var modal = document.getElementById('my-modal');
        if (event.target == modal5) {
            myModal5ClickHandle();
        }

        if (event.target == modal6) {
            myModal6ClickHandle();
        }

        if (event.target == modal) {
            modalClick();
        }
    }

    function buttonHtml() {
        if (stage == 1) {
            return <button onClick={() => { }} className={`btn btn-primary w-full normal-case my-5 rounded-xl ${loading}`}>transfer</button>
        } else if (stage == 2) {
            return <button onClick={() => redeemHandle(signedVAA, networkConfig[to], fromAddrs, toAddrs, alertService, setStage, setLoading, swapAmount, setfromBalance, settoBalance, fromBalance, toBalance)} className={`btn btn-primary w-full normal-case my-5 rounded-xl ${loading}`}>redeem</button>
        } else {
            return <button disabled className="btn btn-primary w-full normal-case my-5 rounded-xl">Type Address</button>
            // return <div className="radial-progress" style={{ "--value": 70 }}>70%</div>
        }
    }

    function chooseNFT(image) {
        setModal("");
        setNFT({ "Image": image });
    }

    return (
        <div className="bg-white">

            {/* <div className={`modal ${modalToken} cursor-pointer ${styles.modalSelf}`} id="my-modal-5">
                <div className="modal-box bg-base-100">
                    <h3 className="text-lg font-bold">Select Network</h3>
                    <div className="divider"></div>
                    <div className="flex flex-col">

                        {networkConfig.map((item, key) => (
                            <div className="flex flex-row cursor-pointer hover:bg-warning rounded-2xl p-1" key={key} onClick={() => selectfromChangeHandle(key)}>
                                <div>
                                    <Image alt="" src={item.path} width={25} height={25} />
                                </div>
                                <div className="ml-3 text-base">{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div> */}

            <div className={`modal ${modalto} cursor-pointer ${styles.modalSelf}`} id="my-modal-6">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Select Network</h3>
                    <div className="divider"></div>
                    <div className="flex flex-col">
                        {networkConfig.map((item, key) => (
                            <div className="flex flex-row h-10 cursor-pointer hover:bg-warning p-2 rounded-2xl" key={key} onClick={() => selecttoChangeHandle(key)}>
                                <div className="w-1/12 align-middle">
                                    <Image alt="" src={item.path} width={25} height={25} />
                                </div>
                                <div className="w-9/12 mb-4">
                                    <div>{item.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`modal ${modal} cursor-pointer ${styles.modalSelf}`} id="my-modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Select NFT</h3>
                    <div className="divider"></div>
                    <div className="flex flex-wrap justify-center">
                        {NFTs.map((item, key) => (
                            <div className="my-2 mx-2 flex flex-col justify-center items-center hover:text-red-400">
                                <div>
                                    <Image className='rounded-full' width={100} height={100} src={item.image} onClick={() => { chooseNFT(item.image) }} alt="" />
                                </div>
                                <div className='mt-1'>
                                    {item.name}
                                </div>
                            </div>
                        ))}

                        {NFTs == [] && "<>Empty List</>"}
                    </div>

                </div>
            </div>

            <div className="w-1/4 min-w-max h-auto border-solid border-2 rounded-2xl m-auto p-1 text-sm">

                <div className="w-full px-6 py-4">
                    <span className="text-xl">
                        NFTs Transfer Highway
                    </span>
                    <BiCog className="cursor-pointer float-right" size="1.5rem" />
                </div>

                <div className="flex flex-col px-5 py-2">
                    <div className="h-auto border-solid border-2 rounded-2xl my-5 p-2">
                        <span className="">
                            From
                        </span>
                        <div className="w-96 flex flex-row p-2 gap-x-32 rounded-2xl m-3">
                            <div className="w-1/2">
                                {chain && chain.id ? (<div className="w-auto p-2 flex flex-row border-solid border-2 rounded-2xl cursor-pointer" onClick={openChainModal}>
                                    <div className="flex"
                                    >
                                        {/* <Image alt="" src={networkConfig[from].path} width={20} height={20}></Image> */}
                                    </div>
                                    <div className="flex-auto text-center mx-1">{chain.name}</div>
                                    <div className="flex"><BiChevronDown size="1rem" />
                                    </div>
                                </div>) : (<div className="w-auto p-2 flex flex-row border-solid border-2 rounded-2xl px-2 cursor-pointer" onClick={openChainModal}>
                                    <div className="flex-auto text-center">SELECT</div>
                                    <div className="flex"><BiChevronDown size="1rem" /></div>
                                </div>)}
                            </div>

                            <div className="w-1/2">
                                {NFT != null ? (<div className="p-2 flex flex-row border-solid border-2 rounded-2xl cursor-pointer" onClick={modalClick}>
                                    <div className="flex-1"
                                    ><Image className="rounded-full" alt="" src={NFT.Image} width={20} height={20}></Image>
                                    </div>
                                    <div className="flex-auto ml-5">NFT</div>
                                    <div className="flex"><BiChevronDown size="1rem" />
                                    </div>
                                </div>) : (<div className="p-2 flex flex-row border-solid border-2 rounded-2xl cursor-pointer" onClick={modalClick}>
                                    <div className="flex-auto text-center">NFT</div>
                                    <div className="flex"><BiChevronDown size="1rem" />
                                    </div>
                                </div>)}
                            </div>

                        </div>


                    </div>
                    <div className="m-auto">
                        <BiSortAlt2 className="cursor-pointer" size="1.4rem" />
                    </div>
                    <div className="h-auto border-solid border-2 rounded-2xl my-5 p-2">
                        <span className="">
                            To
                        </span>
                        <div className="flex flex-row p-2 gap-x-32 border-primary rounded-2xl m-3">
                            <div className="w-full">
                                {to != null ? (<div className="w-auto p-2 flex flex-row border-solid border-2 rounded-2xl cursor-pointer" onClick={myModal6ClickHandle}>
                                    <div className="flex"
                                    ><Image alt="" src={networkConfig[to].path} width={20} height={20}></Image>
                                    </div>
                                    <div className="flex-auto text-center mx-1">{networkConfig[to].name}</div>
                                    <div className="flex"><BiChevronDown size="1rem" />
                                    </div>
                                </div>) : (<div className="w-auto p-2 flex flex-row border-solid border-2 rounded-2xl px-2 cursor-pointer" onClick={myModal6ClickHandle}>
                                    <div className="flex-auto text-center">SELECT</div>
                                    <div className="flex"><BiChevronDown size="1rem" /></div>
                                </div>)}
                            </div>
                        </div>
                    </div>

                    <div className="h-auto border-solid border-2 rounded-2xl p-2">
                        <input type="text" placeholder="Type Receiver Address" value={swapAddress} className="text-primary input input-ghost w-full max-w-xs focus:outline-0 focus:text-primary" onChange={AddresshandleChange} />
                    </div>

                    <div>
                        {buttonHtml()}
                    </div>
                </div>

            </div>
        </div >
    )
}
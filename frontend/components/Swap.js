import { BiSortAlt2, BiCog, BiChevronDown, BiChevronsDown } from "react-icons/bi";
import { ethers } from 'ethers'
import networkConfig from "../utils/network_config.json";
import { useEffect, useState } from "react";
import {
    useChainModal,
} from '@rainbow-me/rainbowkit';

import styles from '../src/styles/Home.module.css';
import Image from "next/image";
const { utils } = require('@hyperlane-xyz/utils');
//alert
import { alertService } from '../services';

import mintJSON from '../utils/mint.json';
import { useNetwork, useAccount } from 'wagmi'


export default function Swap() {
    const keyStr =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

    const triplet = (e1, e2, e3) =>
        keyStr.charAt(e1 >> 2) +
        keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
        keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
        keyStr.charAt(e3 & 63)


    const rgbDataURL = (r, g, b) =>
        `data:image/gif;base64,R0lGODlhAQABAPAA${triplet(0, r, g) + triplet(b, 255, 255)
        }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

    const { openChainModal } = useChainModal();
    const { chain } = useNetwork();
    const { address } = useAccount();
    const [max, setMax] = useState(0);
    const [process, setProcess] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (process < max) {
                setProcess(process + 1);
            } else {
                clearInterval(intervalId);
            }
        }, 500);
        return () => clearInterval(intervalId);
    }, [process, max]);

    //button loading
    const [loading, setLoading] = useState("");

    //default stage 0
    const [stage, setStage] = useState(0);

    // modal
    const [modal, setModal] = useState("");
    const [modalToken, setModalToken] = useState("");
    const [modalto, setModalto] = useState("");
    const [modalmsg, setModalmsg] = useState("");

    //token option
    const [NFTs, setNFTs] = useState([]);
    const [NFT, setNFT] = useState(null);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    //swap address
    const [swapAddress, setSwapAddress] = useState("");

    //alert options
    const options = {
        autoClose: true,
        keepAfterRouteChange: false
    }

    // alertService.info("upload success", options);

    function getConnectContract() {
        let contractAddress;
        networkConfig.map(function (item) {
            if (item.id == chain.id) {
                contractAddress = item.contract;
            }
        });
        /// interact with blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(contractAddress, mintJSON.abi, signer);
    }

    // getNFTsList();
    useEffect(() => {
        if (!address) {
            return
        }
        getNFTsList();
        networkConfig.map(function (item) {
            if (item.id == chain.id) {
                setFrom(item);
            }
        });

        // console.log(stage, from, to, swapAddress);
        if (stage == 0 && from && to != null && swapAddress && NFT != null && NFT != "") {
            setStage(1);
        }

    }, [chain, to, swapAddress, address, NFT])


    async function waitForTransactionCompletion(txHash) {
        let receipt = null;
        while (!receipt) {
            receipt = await new ethers.providers.Web3Provider(window.ethereum).getTransactionReceipt(txHash);
            console.log("waitForTransactionCompletion", receipt);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return receipt;
    }

    async function waitForMessageCompletion(messageId) {
        setMax(35);
        while (true) {
            const baseUrl = 'https://explorer.hyperlane.xyz/api'
            const action = 'module=message&action=get-messages'
            const url = `${baseUrl}?${action}&origin-tx-hash=${messageId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            let ret = data.result;
            console.log(ret);
            if (ret.length > 0) {
                if (ret[0].status == "pending") {
                    setMax(65);
                }
                if (ret[0].status == "delivered") {
                    setMax(100);
                    return
                }
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    async function transferRemote() {
        if (!ethers.utils.isAddress(address)) {
            setSwapAddress("");
            alertService("address invalid", options);
            return
        }
        setLoading("loading");
        console.log(from, networkConfig[to]);
        if (from.id == networkConfig[to].id) {
            //same network
            const tx = await getConnectContract().transferFrom(address, swapAddress, NFT.tokenId);
            await tx.wait();
            setLoading("");
        } else {
            //remote network
            //interchainGasPayment 
            let interchainGasPayment = await getConnectContract().quoteGasPayment(networkConfig[to].id);
            console.log("interchainGasPayment", interchainGasPayment);
            console.log(NFT);
            // const contract = new ethers.Contract(contractAddress, abi, signer);
            const tx = await getConnectContract().transferRemote(networkConfig[to].id, utils.addressToBytes32(swapAddress), NFT.tokenId, { value: interchainGasPayment });
            // const receipt = await waitForTransactionCompletion(tx.hash);
            myModalMsgClickHandle();
            setLoading("");
            await waitForMessageCompletion(tx.hash);
        }
        setSwapAddress("");
        setNFT(null);
    }

    async function getTokenURI(tokenId) {
        console.log(tokenId);
        let tokenURI;
        try {
            tokenURI = await getConnectContract().tokenURI(tokenId);
        } catch (error) {
            console.log(error);
            return
        }

        // console.log("tokenURI:", tokenURI);
        let tokenURIJson = JSON.parse(tokenURI);
        tokenURIJson.image = "https://" + tokenURIJson.image + ".ipfs.w3s.link/avatar.png";
        tokenURIJson.tokenId = tokenId.toNumber();
        return tokenURIJson
    }

    //get user NFTs list
    async function getNFTsList() {
        if (!address) {
            return
        }
        let ret = [];
        let list = await getConnectContract().getTokenListArray(address);
        for (let i = 0; i < list.length; i++) {
            if (list[i] == 0) continue;
            let item = await getTokenURI(list[i]);
            if (!item) continue;
            ret.push(item);
        }
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

    const myModalMsgClickHandle = () => {
        if (modalmsg == "") {
            setModalmsg("modal-open");
        } else {
            setModalmsg("");
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
            return <button onClick={transferRemote} className={`btn btn-success w-full normal-case my-5 rounded-xl ${loading}`}>Transfer</button>
        } else {
            return <button disabled className="btn btn-primary w-full normal-case my-5 rounded-xl">Type Address</button>
        }
    }

    function chooseNFT(item) {
        setModal("");
        setNFT(item);
        console.log(item);
    }

    return (
        <div className="bg-white">
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
                    {/* <div className="divider"></div> */}
                    <div className="flex flex-wrap justify-center mt-5 ">
                        {NFTs.map((item, key) => (
                            <div key={key} className="my-2 mx-2 flex flex-col justify-center items-center hover:text-red-400">
                                <div>
                                    <Image className='rounded-full' blurDataURL={rgbDataURL(237, 181, 6)} placeholder="blur" width={100} height={100} src={item.image} onClick={() => { chooseNFT(item) }} alt="" />
                                </div>
                                <div className='mt-1'>
                                    {item.name}
                                </div>
                            </div>
                        ))}

                        {NFTs.length == 0 && <div className="alert">
                            <div>
                                <span>Do not hold any hyperERC721</span>
                            </div>
                            <div className="flex-none">
                                <button onClick={modalClick} className="btn btn-sm btn-error btn-outline">Okay</button>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>

            <div className={`modal ${modalmsg} cursor-pointer ${styles.modalSelf}`} id="my-modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold mb-3">message</h3>
                    <div className="flex flex-col justify-center mt-5">
                        <progress className="progress progress-info w-full" value={process} max="100"></progress>
                        <div className='flex flex-row mt-5 justify-between mx-2'>
                            <div>Sent</div>
                            <div>Finalized</div>
                            <div>Validated</div>
                            <div>Relayed</div>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={myModalMsgClickHandle} className="btn btn-sm btn-error btn-outline mt-5">Close</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="w-1/4 min-w-max h-auto border-solid border rounded-2xl m-auto p-1 text-sm">

                <div className="w-full px-6 py-4">
                    <span className="text-xl">
                        NFTs Transfer Highway
                    </span>
                    <BiCog className="cursor-pointer float-right" size="1.5rem" />
                </div>

                <div className="flex flex-col px-5 py-2">
                    <div className="h-auto border-solid border rounded-2xl my-5 p-2">
                        <span className="">
                            From
                        </span>
                        <div className="w-96 flex flex-row p-2 gap-x-32 rounded-2xl m-3">
                            <div className="w-1/2">
                                {chain != null && chain.id ? (<div className="w-auto p-2 flex flex-row border-solid border rounded-2xl cursor-pointer" onClick={openChainModal}>
                                    <div className="flex"
                                    >
                                        <Image alt="" src={from != null && from.path} width={20} height={20}></Image>
                                    </div>
                                    <div className="flex-auto text-center mx-1">{from && from.name}</div>
                                    <div className="flex"><BiChevronDown size="1rem" />
                                    </div>
                                </div>) : (<div className="w-auto p-2 flex flex-row border-solid border rounded-2xl px-2 cursor-pointer" onClick={openChainModal}>
                                    <div className="flex-auto text-center">SELECT</div>
                                    <div className="flex"><BiChevronDown size="1rem" /></div>
                                </div>)}
                            </div>

                            <div className="w-1/2">
                                {NFT != null ? (<div className="p-2 flex flex-row border-solid border rounded-2xl cursor-pointer" onClick={modalClick}>
                                    <div className="flex-1"
                                    ><Image className="rounded-full" blurDataURL={rgbDataURL(237, 181, 6)} placeholder="blur" alt="" src={NFT.image} width={20} height={20}></Image>
                                    </div>
                                    <div className="flex-auto ml-5">NFT</div>
                                    <div className="flex"><BiChevronDown size="1rem" />
                                    </div>
                                </div>) : (<div className="p-2 flex flex-row border-solid border rounded-2xl cursor-pointer" onClick={modalClick}>
                                    <div className="flex-auto text-center">NFT</div>
                                    <div className="flex"><BiChevronDown size="1rem" />
                                    </div>
                                </div>)}
                            </div>

                        </div>

                    </div>
                    <div className="m-auto">
                        <BiChevronsDown className="" size="1.4rem" />
                    </div>
                    <div className="h-auto border-solid border rounded-2xl my-5 p-2">
                        <span className="">
                            To
                        </span>
                        <div className="flex flex-row p-2 gap-x-32 border-primary rounded-2xl m-3">
                            <div className="w-full">
                                {to != null ? (<div className="w-auto p-2 flex flex-row border-solid border rounded-2xl cursor-pointer" onClick={myModal6ClickHandle}>
                                    <div className="flex"
                                    ><Image alt="" src={networkConfig[to].path} width={20} height={20}></Image>
                                    </div>
                                    <div className="flex-auto text-center mx-1">{networkConfig[to].name}</div>
                                    <div className="flex"><BiChevronDown size="1rem" />
                                    </div>
                                </div>) : (<div className="w-auto p-2 flex flex-row border-solid border rounded-2xl px-2 cursor-pointer" onClick={myModal6ClickHandle}>
                                    <div className="flex-auto text-center">SELECT</div>
                                    <div className="flex"><BiChevronDown size="1rem" /></div>
                                </div>)}
                            </div>
                        </div>
                    </div>

                    <div className="h-auto border-solid border rounded-2xl p-2">
                        <input type="text" placeholder="Type Receiver Address" value={swapAddress} className="text-success focus:text-success input input-ghost w-full" onChange={AddresshandleChange} />
                    </div>

                    <div>
                        {buttonHtml()}
                    </div>
                </div>

            </div>
        </div >
    )
}
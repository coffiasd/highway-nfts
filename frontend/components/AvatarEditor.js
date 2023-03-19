import { useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import SectionWrapper from './SectionWrapper.js';
import Face from './src/face/index.js';
import Hair from "./src/hair/index.js"
import Hat from "./src/hat/index.js"
import Eyes from "./src/eyes/index.js"
import Glasses from "./src/glasses/index.js"
import Ear from "./src/ear/index.js"
import Nose from "./src/nose/index.js"
import Mouth from "./src/mouth/index.js"
import Shirt from "./src/shirt/index.js"
import classnames from 'classnames'
// import { FaArchive, FaLock } from "react-icons/fa";
import { defaultOptions } from "./src/utils"
import domtoimage from "dom-to-image";
import { Web3Storage } from 'web3.storage'
import { alertService } from '../services';
import { ethers } from "ethers";
import { useAccount, useNetwork } from 'wagmi'
import mintJSON from '../utils/mint.json';

export default function AvatarEditor() {
  /// init configs
  const [config, setConfig] = useState(genConfig());
  const [readyMint, setReadyMint] = useState(false);
  const [isCodeShow, setIsCodeShow] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [statusIsLoading, setStatusIsLoading] = useState("");
  const [upLoadBtn, setUpLoadBtn] = useState("done");
  const [cid, setCid] = useState("");
  const myDefaultOptions = genDefaultOptions(defaultOptions)
  const [modal, setModal] = useState("");
  /// interact with blockchain
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const connectedContract = new ethers.Contract(contractAddress, mintJSON.abi, signer);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const options = {
    autoClose: true,
    keepAfterRouteChange: false
  }

  /// generate default config
  function genDefaultOptions(opts) {
    const hairSet = new Set(opts.hairStyleMan.concat(opts.hairStyleWoman))
    return {
      ...opts,
      hairStyle: Array.from(hairSet)
    }
  }

  /// get web3.storage config token
  function getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN
  }

  /// get a new web3.storage client
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() })
  }

  /// store your pic
  async function storeWithProgress() {
    // set btn state
    setIsLoading("loading");
    setUpLoadBtn("uploading");

    //get image info
    const scale = 2;
    const node = document.getElementById("myAvatar");
    const blob = await domtoimage.toBlob(node, {
      height: node.offsetHeight * scale,
      style: {
        transform: `scale(${scale}) translate(${node.offsetWidth / 2 / scale}px, ${node.offsetHeight / 2 / scale}px)`,
        "border-radius": 0
      },
      width: node.offsetWidth * scale
    });

    //set timeout
    setTimeout(() => {
      setIsLoading("");
    }, 7000);

    //add file
    const files = [
      new File([blob], 'avatar.png'),
    ]

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    let uploaded = 0

    const onStoredChunk = size => {
      uploaded += size
      const pct = 100 * (uploaded / totalSize)
      console.log(`Uploading... ${pct.toFixed(2)}% complete`)
      //change btn state 
      setIsLoading("");
      setReadyMint(true);
      alertService.info("upload success", options);
    }

    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
      setCid(cid);
      console.log('uploading files with cid:', cid)
    }

    // makeStorageClient returns an authorized web3.storage client instance
    const client = makeStorageClient()

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk })
  }

  /// switch to next config
  const switchConfig = (type, currentOpt) => {
    const opts = myDefaultOptions[type]
    const currentIdx = opts.findIndex(item => item === currentOpt)
    const newIdx = (currentIdx + 1) % opts.length
    config[type] = opts[newIdx]
    setConfig((prev) => ({
      ...prev,
      type: opts[newIdx],
    }));
  }

  /// change code show state
  const toggleCodeShow = () => {
    console.log(isCodeShow);
    setIsCodeShow(!isCodeShow);
  }

  /// generate config string
  const genCodeString = () => {
    const ignoreAttr = ['id']
    const myConfig = Object.keys(config)
      .filter(key => !ignoreAttr.includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: config[key] }), {})

    return JSON.stringify(myConfig, null, 2)
  }


  const getTokenURI = async () => {
    const tu = await connectedContract.getTokenURI();
    return parseInt(ethers.utils.hexlify(tu));
  }

  /// public mint function.
  const publicMint = async (sendCid) => {
    // change loading state
    setIsLoading("loading");

    //set timeout
    setTimeout(() => {
      setIsLoading("");
    }, 12000);

    if (!isConnected) {
      alertService.info("please connect wallet", options);
      setIsLoading("");
      return;
    }

    if (chain.id != 80001) {
      setIsLoading("");
      alertService.info("please switch to mumbai net", options);
      return;
    }

    await connectedContract.publicMint(sendCid, genCodeString(), {
      value: ethers.utils.parseEther("0.01"),
      // nonce: window.ethersProvider.getTransactionCount(address, "latest"),
      gasLimit: ethers.utils.hexlify(0x100000), //100000
    });

    setReadyMint(false);
    setIsLoading("");
    modalClick();
  }

  /// control modal
  const modalClick = () => {
    if (modal == "") {
      setModal("modal-open");
    } else {
      setModal("");
    }
  }

  /// view on os
  const openSeaUrl = async () => {
    const id = await getTokenURI();
    const url = "https://testnets.opensea.io/zh-CN/assets/mumbai/" + contractAddress + "/" + id;
    window.open(url);
  }

  /// check <cid> status
  async function checkStatus() {
    setStatusIsLoading("loading");
    const client = makeStorageClient()
    const status = await client.status(cid)
    console.log(status);
    if (status) {
      alertService.info("Status:" + status.pins[0].status + ",PeerId:" + status.pins[0].peerId, options);
    } else {
      alertService.info("not ready", options);
    }
    setStatusIsLoading("");
  }

  return (
    <div className="flex flex-col justify-center items-center bg-white">

      <div className={`modal ${modal}`} id="my-modal-2">
        <div className="card glass">
          <figure><Avatar style={{ width: "10rem", height: "10rem" }} {...config} /></figure>
          <div className="card-body">
            <h2 className="card-title">Congratulations!</h2>
            <p>successful mint your NFT</p>
            <div className="card-actions justify-end">
              <button className="btn btn-info btn-sm" onClick={() => modalClick()}>Yah</button>
              <button className="btn btn-info btn-sm" onClick={() => openSeaUrl()}>OpenSea</button>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-5xl font-bold mb-10">Design an Cross Chain NFT</h1>

      <div id="myAvatar">
        <Avatar style={{ width: "10rem", height: "10rem" }} {...config} />
      </div>
      <div className="AvatarEditor rounded-full flex items-cent mt-20 mb-2 outline-dotted outline-2">
        <SectionWrapper
          className="w-8 h-8 rounded-full p-2 mx-2 text-black mt-2"
          tip="Face"
          switchConfig={() => switchConfig('faceColor', config.faceColor)}
        >
          <Face color={config.faceColor} />
        </SectionWrapper>

        <SectionWrapper
          className="w-8 h-8 rounded-full p-2 mx-2 text-black mt-2"
          tip="Hair"
          switchConfig={() => switchConfig('hairStyle', config.hairStyle)}
        >
          <Hair style={config.hairStyle} color="#fff" />
        </SectionWrapper>

        <SectionWrapper
          className="w-8 h-8 rounded-full p-2 mx-2  text-black mt-2"
          tip="Hat"
          switchConfig={() => switchConfig('hatStyle', config.hatStyle)}
        >
          <Hat style={config.hatStyle} color="#fff" />
        </SectionWrapper>

        <SectionWrapper
          className="w-8 h-8 rounded-full p-2 mx-2  text-black mt-2"
          tip="Eyes"
          switchConfig={() => switchConfig('eyeStyle', config.eyeStyle)}
        >
          <Eyes style={config.eyeStyle} color="#fff" />
        </SectionWrapper>


        <SectionWrapper
          className="w-8 h-8 rounded-full p-2 mx-2 text-black mt-2"
          tip="Glasses"
          switchConfig={() => switchConfig('glassesStyle', config.glassesStyle)}
        >
          <Glasses style={config.glassesStyle} color="#fff" />
        </SectionWrapper>

        <SectionWrapper
          className="w-8 h-8 rounded-full p-2 mx-2 text-black mt-2"
          tip="Ear"
          switchConfig={() => switchConfig('earSize', config.earSize)}
        >
          <Ear size={config.earSize} color="#fff" />
        </SectionWrapper>

        <SectionWrapper
          className="w-8 h-8 rounded-full p-2 mx-2 text-black mt-2"
          tip="Nose"
          switchConfig={() => switchConfig('noseStyle', config.noseStyle)}
        >
          <Nose style={config.noseStyle} color="#fff" />
        </SectionWrapper>

        <SectionWrapper
          className="w-8 h-8 rounded-full p-2 mx-2 text-black mt-2"
          tip="Mouth"
          switchConfig={() => switchConfig('mouthStyle', config.mouthStyle)}
        >
          <Mouth style={config.mouthStyle} color="#fff" />
        </SectionWrapper>


        <SectionWrapper
          className="w-8 h-8 rounded-full p-2 mx-2 text-black mt-2"
          tip="Shirt"
          switchConfig={() => switchConfig('shirtStyle', config.shirtStyle)}
        >
          <Shirt style={config.shirtStyle} color="#fff" />
        </SectionWrapper>

        <div className="divider w-0.5 h-5 rounded mx-2 mt-2" />
        <div className="mx-2 relative flex justify-center">
          <i
            className={classnames("iconfont icon-code text-xl  cursor-pointer transition duration-300 hover:text-green-100 mt-2", {
              banTip: isCodeShow
            })}
            data-tip="Properties"
            onClick={() => toggleCodeShow()} />
          <div className={classnames("rounded-lg bg-white p-5 absolute bottom-full codeBlock mb-4 mt-2", {
            active: isCodeShow
          })}>
            <pre className="text-xs highres:text-sm text-cyan-50">{genCodeString(config)}</pre>
          </div>
        </div>


      </div>

      <div className="tooltip tooltip-open tooltip-bottom tooltip-accent mb-20" data-tip="click to change" >
      </div>

      <div className="inline-flex">
        {readyMint ? (<button className={`btn btn-wide btn-warning gap-2 text-gray-50 mb-10 ${isLoading}`} onClick={() => publicMint(cid)}>
          MINT
        </button>) : (<button className={`btn btn-wide btn-warning gap-2 text-gray-50 mb-10 ${isLoading}`} onClick={() => storeWithProgress()}>
          {upLoadBtn}
        </button>)
        }
      </div>

      <>
        {cid ? (<button className={`btn btn-wide btn-secondary gap-2 text-gray-50 mb-10 ${statusIsLoading}`} onClick={() => checkStatus()}>Status</button>) : ""}
      </>
    </div >
  );
}
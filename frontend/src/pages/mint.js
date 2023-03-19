import Head from 'next/head';
import Footer from '../../components/Footer';
import dynamic from 'next/dynamic';
import React from "react";
import { Alert } from '../../components/alert.jsx';
const AvatarList = dynamic(() => import('../../components/AvatarList'), {
    ssr: false,
})

const Header = dynamic(() => import('../../components/Header'), {
    ssr: false,
})

const AvatarEditor = dynamic(() => import('../../components/AvatarEditor'), {
    ssr: false,
})

export default function Home() {
    return (
        <div className="min-h-screen" data-theme="">
            <Head>
                <title>Mint NFTs</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Alert />
            <Header />

            <div className='flex items-center justify-center h-screen -mt-10'>
                <div className="hidden" >
                    <AvatarList />
                </div>
                <AvatarEditor />
            </div>


            <Footer />
        </div >
    )
}
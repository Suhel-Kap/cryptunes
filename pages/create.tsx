import Head from "next/head";
import Layout from "@/components/Layout";
import CreateSpaceCard from "@/components/CreateSpaceCard";
import Accordion from "@/components/Accordion";
import {useEffect} from "react";
import {useAccount} from "wagmi";

export default function CreateNFT() {
    const {isConnected, isDisconnected} = useAccount()
    useEffect(() => {
        if(isDisconnected){
            alert("Please connect your wallet to continue")
            window.location.href = "/"
        }
    }, [isConnected,isDisconnected])

    return (
        <>
            <Head>
                <title>Cryptunes - Create NFT</title>
                <meta name="description" content="Dynamic NFT platform"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Layout>
                <div className="flex flex-col justify-center items-center w-full h-auto absolute top-11">
                    <CreateSpaceCard/>
                    <div className="divider"></div>
                    <Accordion />
                </div>
            </Layout>
        </>
    )
}
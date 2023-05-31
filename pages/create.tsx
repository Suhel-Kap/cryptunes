import Head from "next/head";
import Layout from "@/components/Layout";
import CreateSpaceCard from "@/components/CreateSpaceCard";
import Accordion from "@/components/Accordion";
import {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import {useIsMounted} from "@/hooks/useIsMounted";

export default function CreateNFT() {
    const {address, isConnected, isDisconnected} = useAccount()
    const mounted = useIsMounted()
    const [spaces, setSpaces] = useState<string[]>(["No Spaces"])
    const [hasSpaces, setHasSpaces] = useState<boolean>(false)

    useEffect(() => {
        if (isDisconnected) {
            alert("Please connect your wallet to continue")
            window.location.href = "/"
        }
    }, [isConnected, isDisconnected])

    useEffect(() => {
        if (!address) return
        if (!mounted) return
        fetch("/api/getUserSpaces", {
            method: "POST",
            body: JSON.stringify({address}),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    setSpaces(["Select Space", ...data])
                    setHasSpaces(true)
                } else {
                    setSpaces(["No Spaces"])
                    setHasSpaces(false)
                }
            })
    }, [mounted, address])

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
                    <Accordion hasSpace={hasSpaces} spaces={spaces}/>
                </div>
            </Layout>
        </>
    )
}
import Head from "next/head";
import Layout from "@/components/Layout";
import SpaceCard from "@/components/SpaceCard";
import {useEffect, useState} from "react";

export default function Explore(){
    const [collections, setCollections] = useState<{name: string, groupId: string}[]>([])
    useEffect(() => {
        fetch("/api/getSpaces", {
            method: "GET"
        }).then(res => res.json()).then(data => {
            const collections = JSON.parse(data)
            setCollections(collections)
        })
    }, [])

    return (
        <>
            <Head>
                <title>Cryptunes - Explore</title>
                <meta name="description" content="Dynamic NFT platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <div className="grid gap-5 grid-cols-3 p-5">
                    {collections.map((collection, index) => (
                        <SpaceCard key={index} collection={collection} />
                    ))}
                </div>
            </Layout>
        </>
    )
}
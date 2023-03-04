import Head from "next/head";
import Layout from "@/components/Layout";
import SpaceCard from "@/components/SpaceCard";

export default function Explore(){
    return (
        <>
            <Head>
                <title>Cryptunes - Explore</title>
                <meta name="description" content="Dynamic NFT platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <div className="grid gap-5 grid-cols-3 p-5">
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                </div>
            </Layout>
        </>
    )
}
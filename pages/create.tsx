import Head from "next/head";
import Layout from "@/components/Layout";
import CreateSpaceCard from "@/components/CreateSpaceCard";

export default function CreateNFT() {
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
                    <CreateSpaceCard />
                    <div className="divider"></div>
                    <CreateSpaceCard />
                </div>
            </Layout>
        </>
    )
}
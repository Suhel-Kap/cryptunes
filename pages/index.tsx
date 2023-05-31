import type {NextPage} from 'next'
import Head from 'next/head'
import Layout from "@/components/Layout";
import Link from "next/link";
import styles from "@/styles/header.module.css"
import clsx from "clsx";

const points = [
    {
        title: "Create your Space",
        body: "Easily get started on our platform by choosing a name and image for your space."
    },
    {
        title: "Create Unique NFTs",
        body: "With our platform, you can create a wide range of NFTs, including stable diffusion-generated NFTs using open-AI Dalle-2 APIs, interactive visualizers using the CID of HTML pages, song albums, classic image NFTs, and even ticket NFTs."
    },
    {
        title: "Host a Decentralized Community",
        body: "Join our decentralized discord like community by default with orbis.club on the Ceramic Network and connect with like-minded individuals"
    },
    {
        title: "Add Talented Artists to your Space",
        body: "The Space Admin has the ability to invite new artists to create special, one-of-a-kind creations for your collection."
    },
    {
        title: "Network with Other Creators",
        body: "Expand your creative network by visiting our Group Chat page and connect with other talented creators."
    }
]

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Cryptunes</title>
                <meta name="description" content="Dynamic NFT platform"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Layout>
                <div className={clsx("flex flex-col justify-center items-center w-full h-fit absolute top-11", styles.righteous)}>
                    <div className="flex flex-col justify-center items-center w-full h-96 py-20 my-48">
                        <h1 className={clsx("text-4xl font-bold text-center text-slate-600 my-4", styles.righteous)}>
                            <span className={clsx("text-purple-700", styles.righteous)}>Cryptunes</span> is a community oriented NFT platform
                        </h1>
                        <p className="text-xl text-center text-slate-400 my-4 font-thin">
                            Create your own NFTs, join a community, and connect with other creators.
                        </p>
                        <div className="btn-group my-4">
                            <button className="btn btn-primary btn-lg">
                                <Link href={"https://github.com/Suhel-Kap/cryptunes"}>
                                    <a target={"_blank"}>Source Code</a>
                                </Link>
                            </button>
                            <button className="btn btn-secondary btn-lg">
                                <Link href={"/create"}>
                                    <a>Create NFT</a>
                                </Link>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center w-full h-fit mt-14">
                        <h1 className={clsx("text-4xl font-bold text-center text-slate-100 my-4", styles.righteous)}>
                            How it works
                        </h1>
                        <div className="flex flex-col justify-center items-center h-fit" style={{width: "50%"}}>
                            {points.map((point, index) => (
                                <div key={index} className="flex flex-row justify-center items-center w-full h-fit">
                                    <div className={clsx("flex flex-col", styles.righteous)}>
                                        <h1 className={clsx("text-2xl font-bold text-center text-slate-600 my-4", styles.righteous)}>
                                            {point.title}
                                        </h1>
                                        <p className="text-xl text-center text-slate-400 my-4 font-thin">
                                            {point.body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Home

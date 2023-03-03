import Head from "next/head";
import Layout from "@/components/Layout";
// @ts-ignore
import {Discussion} from "@orbisclub/components";
import "@orbisclub/components/dist/index.modern.css";
import {useOrbisContext} from "../contexts/OrbisContext";

export default function Discussions() {
    const value = useOrbisContext()
    return (
        <>
            <Head>
                <title>Cryptunes - Discussions</title>
                <meta name="description" content="Dynamic NFT platform"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Layout>
                <div className="w-full" style={{height: "50rem"}}>
                    <Discussion
                        theme="kjzl6cwe1jw145fc6mkd8j1cf4ng3iq8onx25s451dvaxzgz9cu2p42cqfgiq54"
                        context={value.CHANNEL_ID}/>
                </div>
            </Layout>
        </>
    )
}
import Head from "next/head";
import Layout from "@/components/Layout";

export default function User(){
    return (
        <>
            <Head>
                <title>Cryptunes - User</title>
                <meta name="description" content="Dynamic NFT platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                User
            </Layout>
        </>
    )
}
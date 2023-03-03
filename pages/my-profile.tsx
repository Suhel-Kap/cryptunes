import Head from "next/head";
import Layout from "@/components/Layout";

export default function MyProfile(){
    return (
        <>
            <Head>
                <title>Cryptunes - Profile</title>
                <meta name="description" content="Dynamic NFT platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                My Profile
            </Layout>
        </>
    )
}
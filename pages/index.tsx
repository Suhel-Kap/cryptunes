import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from "@/components/Layout";
import Connect from "@/components/Conenct";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cryptunes</title>
        <meta name="description" content="Dynamic NFT platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Layout>
            <Connect />
            <p>Hello</p>
        </Layout>
    </>
  )
}

export default Home

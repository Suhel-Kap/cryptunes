import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from "@/components/Layout";
import Connect from "@/components/Conenct";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cryptunes</title>
        <meta name="description" content="Dynamic NFT platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Layout>
            <div className="flex flex-col justify-center items-center w-full h-fit absolute top-11">
                <h1 className="text-4xl font-bold text-center text-slate-600 my-4">
                    <span className="text-purple-700">Cryptunes</span> is a dynamic NFT platform
                </h1>
                <p className="text-xl text-center text-slate-400 my-4">
                    Create your own NFTs and sell them on the marketplace
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
        </Layout>
    </>
  )
}

export default Home

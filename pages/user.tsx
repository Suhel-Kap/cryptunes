import Head from "next/head";
import Layout from "@/components/Layout";
import CreatorCard from "@/components/CreatorCard";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useIsMounted} from "@/hooks/useIsMounted";

export default function User(){
    const [creator, setCreator] = useState<any>()
    const [isFollower, setIsFollower] = useState(false)

    const router = useRouter()
    const mounted = useIsMounted()

    useEffect(() => {
        if(mounted && router.query.address){
            fetch("/api/getProfile", {
                method: "POST",
                body: JSON.stringify({did: router.query.address}),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                const parsed = JSON.parse(data)
                setCreator(parsed)
            })
        }
    }, [router.query, mounted])

    return (
        <>
            <Head>
                <title>Cryptunes - {creator?.username}</title>
                <meta name="description" content="Dynamic NFT platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <div className="container p-10">
                    <h1 className="text-2xl font-semibold pt-5 pb-5 mb-5">Welcome
                        to {creator?.username || "this space"}&apos;s profile</h1>
                    <div className="flex flex-row justify-between">
                        <CreatorCard creator={creator}/>
                        <div className="btn-group btn-group-scrollable">
                            <button className="btn-primary btn">
                                {isFollower ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}
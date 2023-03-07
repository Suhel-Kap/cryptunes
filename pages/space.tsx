import Head from "next/head";
import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useIsMounted} from "@/hooks/useIsMounted";
import CreatorCard from "@/components/CreatorCard";

export default function Space() {
    const router = useRouter()
    const mounted = useIsMounted()

    const [info, setInfo] = useState<any>()
    const [creator, setCreator] = useState<any>()
    const [nfts, setNfts] = useState<any[]>([])

    useEffect(() => {
        console.log(router.query.groupId)
        if (mounted && router.query.groupId && !info) {
            fetch("/api/getSpaces", {
                method: "POST",
                body: JSON.stringify({
                    groupId: router.query.groupId,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                const parsed = JSON.parse(data)
                setInfo(parsed)
                const creator = parsed.creator
                fetch("/api/getProfile", {
                    method: "POST",
                    body: JSON.stringify({did: creator}),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(res => res.json()).then(data => {
                    const parsed = JSON.parse(data)
                    setCreator(parsed)
                })
            })
        }
    }, [router.query, mounted])

    useEffect(() => {
        console.log(router.query.name)
        if (mounted && router.query.name) {
            fetch("/api/getSpaceData", {
                method: "POST",
                body: JSON.stringify({
                    space: router.query.name,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                const parsed = JSON.parse(data)
                console.log(parsed)
            })
        }
    }, [router.query, mounted])

    return (
        <>
            <Head>
                <title>Cryptunes - Space</title>
                <meta name="description" content="Dynamic NFT platform"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Layout>
                <div className="container p-10">
                    <CreatorCard creator={creator} />
                    <div className="grid gap-5 grid-cols-3 p-5 mt-10">
                        {<><div className="skeleton h-80 w-80 rounded-2xl"></div><div className="skeleton h-80 w-80 rounded-2xl"></div><div className="skeleton h-80 w-80 rounded-2xl"></div></>}
                    </div>
                </div>
            </Layout>
        </>
    )
}
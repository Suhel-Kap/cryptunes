import Head from "next/head";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import {useIsMounted} from "@/hooks/useIsMounted";

export default function Space(){
    const router = useRouter()
    const mounted = useIsMounted()

    const [info, setInfo] = useState<any>()

    useEffect(() => {
        console.log(router.query.groupId)
        if(mounted && router.query.groupId && !info){
            fetch("/api/getSpaces", {
                method: "POST",
                body: JSON.stringify({
                    groupId: router.query.groupId,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                setInfo(JSON.parse(data))
            })
        }
    }, [router.query, mounted])

    return (
        <>
            <Head>
                <title>Cryptunes - Space</title>
                <meta name="description" content="Dynamic NFT platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <div className="grid gap-5 grid-cols-3 p-5">
                    <div className="card card-image-cover" style={{maxHeight: 400}}>
                        <img src={info?.content?.pfp} alt=""/>
                        <div className="card-body">
                            <h2 className="card-header">{info?.content?.name}</h2>
                            <p className="text-content2">{info?.content?.description}</p>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}
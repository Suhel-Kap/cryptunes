import Head from "next/head";
import Layout from "@/components/Layout";
import CreatorCard from "@/components/CreatorCard";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useIsMounted} from "@/hooks/useIsMounted";
import NFTCard from "@/components/NFTCard";
import {useAccount} from "wagmi";
import {useOrbisContext} from "../contexts/OrbisContext";
import toast from "react-hot-toast";
import * as dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default function User() {
    const [creator, setCreator] = useState<any>()
    const [isFollower, setIsFollower] = useState(false)
    const [nfts, setNfts] = useState<any[]>()
    const [activeTab, setActiveTab] = useState(1)
    const [data, setData] = useState<any[]>([])

    const {address} = useAccount()
    const {orbis, user} = useOrbisContext()
    const router = useRouter()
    const mounted = useIsMounted()

    useEffect(() => {
        if (mounted && router.query.address) {
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

    useEffect(() => {
        if (mounted && router.query.address) {
            fetch("/api/getUserNfts", {
                method: "POST",
                body: JSON.stringify({
                    address: router.query.address?.slice(-42),
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                const parsed = JSON.parse(data)
                console.log(parsed)
                setNfts(parsed)
            })
        }
    }, [router.query, mounted])

    useEffect(() => {
        if (mounted && router.query.address && user) {
            (async () => {
                // @ts-ignore
                await orbis.isConnected()
                // @ts-ignore
                let {data, error} = await orbis.getIsFollowing(user.did, router.query.address)
                if (data)
                    setIsFollower(data)
                await getPosts()
            })()
        }
    }, [router.query, mounted, user])

    const getPosts = async () => {
        // @ts-ignore
        const res = await orbis.getPosts({context: router!.query!.address!.slice(-42).toLowerCase(), tag: "cryptunes"})
        if (res.status === 200) {
            setData(res.data)
            console.log(res.data)
        } else {
            setData([])
        }
    }

    const handleFollow = async () => {
        const toastId = toast.loading("Loading...")
        // @ts-ignore
        await orbis.isConnected()
        // @ts-ignore
        let res = await orbis.setFollow(router.query.address, !isFollower)
        if (res.status === 200) {
            toast.success("Success", {id: toastId})
            setIsFollower(!isFollower)
        } else {
            toast("Something went wrong", {id: toastId})
        }
    }


    return (
        <>
            <Head>
                <title>Cryptunes - {creator?.username}</title>
                <meta name="description" content="Dynamic NFT platform"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Layout>
                <div className="container p-10">
                    <h1 className="text-2xl font-semibold pt-5 pb-5 mb-5">Welcome
                        to {creator?.username || "this space"}&apos;s profile</h1>
                    <div className="flex flex-row justify-between">
                        <CreatorCard creator={creator}/>
                        <div className="btn-group btn-group-scrollable">
                            <button className="btn-primary btn" onClick={handleFollow}>
                                {isFollower ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                    </div>
                    <div className="tabs gap-1 mt-5 pl-5 pt-5">
                        <input type="radio" id="tab-10" name="tab-4" className="tab-toggle"
                               onClick={() => setActiveTab(1)} defaultChecked/>
                        <label htmlFor="tab-10" className="tab tab-pill">NFTs</label>

                        <input type="radio" id="tab-11" name="tab-4" className="tab-toggle"
                               onClick={() => setActiveTab(2)}/>
                        <label htmlFor="tab-11" className="tab tab-pill">User Posts</label>
                    </div>
                    {activeTab === 1 &&
                        <div className="grid gap-5 grid-cols-3 p-5 mt-10">
                            {
                                !nfts &&
                                <>
                                    <div className="skeleton h-80 w-80 rounded-2xl"></div>
                                    <div className="skeleton h-80 w-80 rounded-2xl"></div>
                                    <div className="skeleton h-80 w-80 rounded-2xl"></div>
                                </>
                            }
                            {
                                nfts?.length === 0 &&
                                <div className="text-center flex flex-row justify-center items-center w-full">
                                    <h1 className="text-2xl font-semibold">{creator.username} has no NFTs</h1>
                                </div>
                            }
                            {
                                nfts?.map((nft, index) => (
                                    <NFTCard nft={nft} key={index}/>
                                ))
                            }
                        </div>}
                    {activeTab === 2 &&
                        <div className="w-full mt-10" style={{height: "50rem"}}>
                            {/*// @ts-ignore*/}
                            {address?.toLowerCase() === router.query.address?.slice(-42).toLowerCase() &&
                                <div className="flex flex-row justify-between items-center h-35 relative">
                                    <form onSubmit={async (e) => {
                                        e.preventDefault()
                                        // @ts-ignore
                                        const content = e.target[0].value
                                        const toastId = toast.loading("Posting...")
                                        // @ts-ignore
                                        await orbis.isConnected()
                                        // @ts-ignore
                                        const res = await orbis.createPost({
                                            body: content,
                                            // @ts-ignore
                                            context: router!.query!.address!.slice(-42).toLowerCase(),
                                            tags: [{
                                                slug: "cryptunes",
                                                title: "Cryptunes",
                                            }],
                                        })
                                        console.log(res)
                                        if (res.status === 200) {
                                            toast.success("Success", {id: toastId})
                                            // await router.reload()
                                        } else {
                                            toast.error("Something went wrong", {id: toastId})
                                        }
                                    }} className="w-full h-full">
                                <textarea className="w-full h-30 p-5 rounded-2xl border-0 bg-amber-50 text-slate-200 opacity-70"
                                          placeholder="What's on your mind?"/>
                                        <button type="submit"
                                                className="btn-primary btn absolute right-2 bottom-3">Post
                                        </button>
                                    </form>
                                </div>}
                            <div className="flex flex-col gap-5 p-5">
                                {
                                    data?.length === 0 &&
                                    <div className="text-center flex flex-row justify-center items-center w-full">
                                        <h1 className="text-2xl font-semibold">{creator.username} has no posts</h1>
                                    </div>
                                }
                                {
                                    data?.map((post, index) => (
                                        <div key={index} className="flex flex-row gap-5 bg-rose-100 h-full rounded-2xl p-4 m-5">
                                            <div className="flex flex-col gap-5">
                                                <div className="flex flex-row gap-5 items-center text-gray-100">
                                                    {post.content.body}
                                                </div>
                                                <p className="text-gray-100 font-light text-sm">{dayjs.unix(post.timestamp).fromNow()}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>
            </Layout>
        </>
    )
}
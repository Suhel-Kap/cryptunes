import Head from "next/head";
import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useIsMounted} from "@/hooks/useIsMounted";
import CreatorCard from "@/components/CreatorCard";
import NFTCard from "@/components/NFTCard";
// @ts-ignore
import {Discussion} from "@orbisclub/components";
import "@orbisclub/components/dist/index.modern.css";
import {useOrbisContext} from "../contexts/OrbisContext";
import toast from "react-hot-toast";
import {useContract} from "@/hooks/useContract";
import {ethers} from "ethers";

export default function Space() {
    const router = useRouter()
    const mounted = useIsMounted()
    const {orbis, user} = useOrbisContext()
    const {addSpaceArtist, deleteSpaceArtist} = useContract()

    const [info, setInfo] = useState<any>()
    const [groupInfo, setGroupInfo] = useState<any>()
    const [creator, setCreator] = useState<any>()
    const [nfts, setNfts] = useState<any[]>()
    const [activeTab, setActiveTab] = useState(1)
    const [isGroupMember, setIsGroupMember] = useState(false)
    const [isCreator, setIsCreator] = useState(false)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
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
                console.log(parsed)
                // @ts-ignore
                parsed.creator === user.did && setIsCreator(true)
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
        if (mounted && router.query.groupId && !groupInfo) {
            (async () => {
                // @ts-ignore
                let {data, error} = await orbis.getGroup(router.query.groupId)
                if (error) {
                    console.log(error)
                } else {
                    setGroupInfo(data)
                }
            })()
        }
    }, [router.query, mounted])

    useEffect(() => {
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
                setNfts(parsed.nftData)
            })
        }
    }, [router.query, mounted])

    useEffect(() => {
        if (mounted && router.query.groupId && user && !checked) {
            (async () => {
                // @ts-ignore
                let {data, error} = await orbis.getIsGroupMember(router.query.groupId, user.did)
                if (error) {
                    console.log(error)
                } else {
                    setIsGroupMember(data)
                }
                setChecked(true)
            })()
        }
    }, [router.query, mounted, user])

    const handleJoin = async () => {
        const {groupId} = router.query
        // @ts-ignore
        const res = await orbis.setGroupMember(groupId, true)
        if (res.status === 200) {
            toast.success("You have successfully joined the group")
            router.reload()
        } else {
            toast.error("Something went wrong")
        }
    }

    const handleLeave = async () => {
        const {groupId} = router.query
        // @ts-ignore
        const res = await orbis.setGroupMember(groupId, false)
        if (res.status === 200) {
            toast.success("You have successfully left the group")
            router.reload()
        } else {
            toast.error("Something went wrong")
        }
    }

    console.log(groupInfo)

    return (
        <>
            <Head>
                <title>Cryptunes - Space</title>
                <meta name="description" content="Dynamic NFT platform"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Layout>
                <div className="container p-10">
                    <div className="flex w-60 rounded" style={{minWidth: 600}}>
                        <div className="mr-2 w-24">
                            <img className="rounded-full h-32"
                                 src={`https://${groupInfo?.content?.pfp}.ipfs.nftstorage.link`} alt=""/>
                        </div>
                        <div className="flex flex-col justify-center items-center ">
                            <h1 className="text-4xl font-bold">Welcome to {router?.query?.name}</h1>
                            <p className="text-content text-xl">{groupInfo?.content?.description}</p>
                        </div>
                    </div>
                    <h3 className="font-semibold pt-5 pb-1 mb-0.5">Created by</h3>
                    <div className="flex flex-row justify-between">
                        <CreatorCard creator={creator}/>
                        <div className="btn-group btn-group-scrollable">
                            <button className="btn-primary btn" onClick={() => {
                                if (isGroupMember) {
                                    handleLeave()
                                } else {
                                    handleJoin()
                                }
                            }
                            }>
                                {isGroupMember ? "Leave Space" : "Join Space"}
                            </button>
                        </div>
                    </div>
                    <div className="tabs gap-1 mt-5 pl-5 pt-5">
                        <input type="radio" id="tab-10" name="tab-4" className="tab-toggle"
                               onClick={() => setActiveTab(1)} defaultChecked/>
                        <label htmlFor="tab-10" className="tab tab-pill">NFTs</label>

                        <input type="radio" id="tab-11" name="tab-4" className="tab-toggle"
                               onClick={() => setActiveTab(2)}/>
                        <label htmlFor="tab-11" className="tab tab-pill">Space Chat</label>

                        {isCreator && <><input type="radio" id="tab-12" name="tab-4" className="tab-toggle"
                                               onClick={() => setActiveTab(3)}/>
                            <label htmlFor="tab-12" className="tab tab-pill">Manage Space</label></>}
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
                                    <h1 className="text-2xl font-semibold">No NFTs in this space</h1>
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
                            <Discussion
                                theme="kjzl6cwe1jw145fc6mkd8j1cf4ng3iq8onx25s451dvaxzgz9cu2p42cqfgiq54"
                                context={router.query.groupId}/>
                        </div>
                    }
                    {activeTab === 3 &&
                        <div className="flex flex-col justify-center items-center w-full h-auto my-5">
                            <h3 className="text-2xl font-semibold my-3">Manage Space</h3>
                            <div className="card bg-rose-100" style={{maxWidth: "35rem"}}>
                                <div className="mx-auto flex w-full max-w-sm flex-col gap-1">
                                    <div className="card-header mx-auto"
                                         style={{marginTop: "1rem", flexDirection: "column"}}>
                                        <h2 className="text-stone-900">Add Artist To Space</h2>
                                    </div>
                                    <div className="card-body form-group pt-0.5">
                                        <div className="form-field my-2">
                                            <form onSubmit={(event) => {
                                                event.preventDefault()
                                                const toastId = toast.loading("Adding artist...")
                                                // @ts-ignore
                                                const address = event.target[0].value
                                                try {
                                                    ethers.utils.getAddress(address)
                                                    addSpaceArtist(router.query.name as string, address).then(() => {
                                                        toast.success("Artist added successfully", {id: toastId})
                                                    }).catch(() => {
                                                        toast.error("Something went wrong", {id: toastId})
                                                    })
                                                } catch (e) {
                                                    toast.error("Invalid address")
                                                    return
                                                }
                                            }
                                            }>
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Address <span className="text-pink-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="0x0000000000000000"
                                                    className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                                />
                                                <button type="submit" className="btn-success btn mt-2 w-full">Add
                                                    Artist
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-rose-100 mt-6" style={{maxWidth: "35rem"}}>
                                <div className="mx-auto flex w-full max-w-sm flex-col gap-1">
                                    <div className="card-header mx-auto"
                                         style={{marginTop: "1rem", flexDirection: "column"}}>
                                        <h2 className="text-stone-900">Remove Artist From Space</h2>
                                    </div>
                                    <div className="card-body form-group pt-0.5">
                                        <div className="form-field my-2">
                                            <form onSubmit={(event) => {
                                                event.preventDefault()
                                                const toastId = toast.loading("Removing artist...")
                                                // @ts-ignore
                                                const address = event.target[0].value
                                                try {
                                                    ethers.utils.getAddress(address)
                                                    deleteSpaceArtist(router.query.name as string, address).then(() => {
                                                        toast.success("Artist removed successfully", {id: toastId})
                                                    }).catch(() => {
                                                        toast.error("Something went wrong", {id: toastId})
                                                    })
                                                } catch (e) {
                                                    toast.error("Invalid address", {id: toastId})
                                                    return
                                                }
                                            }
                                            }>
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Address <span className="text-pink-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="0x0000000000000000"
                                                    className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                                />
                                                <button type="submit" className="btn-error btn mt-2 w-full">Remove
                                                    Artist
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </Layout>
        </>
    )
}
import Head from "next/head";
import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import Image from "next/image";
import SpinnerButton from "@/components/SpinnerButton";
import {useContract} from "@/hooks/useContract";
import {useAccount} from "wagmi";
import {useIsMounted} from "@/hooks/useIsMounted";
import toast from "react-hot-toast";
import uploadMetadata from "@/lib/uploadMetadata";

export default function AI() {
    const [prompt, setPrompt] = useState<string>("")
    const {declareNFT, getCurrentTokenId} = useContract()
    const {address, isDisconnected, isConnected} = useAccount()
    const [generating, setGenerating] = useState<boolean>(false)
    const mounted = useIsMounted()
    const [spaces, setSpaces] = useState<any>(["No Spaces"])
    const initalForm = {
        name: "",
        description: "",
        space: "",
        price: "",
        quantity: "",
        attributes: [
            {trait_type: "", value: ""},
        ]
    }
    const [form, setForm] = useState(initalForm)
    const [image, setImage] = useState<string>("")

    useEffect(() => {
        if (!address) return
        if (!mounted) return
        fetch("/api/getUserSpaces", {
            method: "POST",
            body: JSON.stringify({address}),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => res.json())
            .then(data => {
                setSpaces(["Select Space", ...data])
            })
    }, [mounted, address])

    useEffect(() => {
        if(isDisconnected){
            alert("Please connect your wallet to continue")
            window.location.href = "/"
        }
    }, [isConnected,isDisconnected])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setGenerating(true)
        const res = await fetch("/api/dalle", {
            method: "POST",
            body: JSON.stringify({prompt}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(res)
        const data = await res.json()
        setImage(data.name)
        setGenerating(false)
    }

    const handleFormSubmit = async (e: any) => {
        e.preventDefault()
        setGenerating(true)
        const toastId = toast.loading("Minting NFT...")
        if(!image){
            toast.error("Please select an image", {id: toastId})
            setGenerating(false)
            return
        }
        const res = await fetch("/api/uploadToIpfs", {
            method: "POST",
            body: JSON.stringify({image, name: form.name, description: form.description, ai: true}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const cid = (await res.json()).cid
        const imageUrl = `${cid}`
        const metadata = {
            name: form.name,
            image: imageUrl,
            animation_url: "",
            description: form.description,
            type: "image",
            attributes: form.attributes
        }
        const metadataUrl = await uploadMetadata(metadata)
        console.log("metadataUrl", metadataUrl)
        try{
            const currentTokenId = await getCurrentTokenId()
            console.log("currentTokenId", currentTokenId)
            const params = {
                maxSupply: parseInt(form.quantity),
                mintPrice: parseFloat(form.price),
                metadataURL: metadataUrl,
                spaceName: form.space,
            }
            console.log("params", params)
            await declareNFT(params)
            toast.success("NFT Minted", {id: toastId})
            setForm(initalForm)
            setGenerating(false)
        } catch (e){
            toast.error("Something went wrong", {id: toastId})
            console.log(e)
        }
    }

    return (
        <>
            <Head>
                <title>Cryptunes - AI NFT</title>
                <meta name="description" content="Dynamic NFT platform"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Layout>
                <div>
                    <div className="card-header mx-auto" style={{marginTop: "2.5rem", flexDirection: "column"}}>
                        <h2 className="text-4xl text-indigo-100">Create AI Generated NFT</h2>
                        <p className="text-sm text-indigo-200">Enter a detailed prompt to generate an image</p>
                    </div>
                    <div className="card-body form-group pt-0.5 my-3">
                        <form onSubmit={handleSubmit}>
                            <div className="form-field my-2">
                                <label className="block text-sm font-medium text-indigo-200">
                                    Prompt <span className="text-pink-600">*</span>
                                </label>
                                <textarea
                                    value={prompt}
                                    required
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Prompt"
                                    className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm textarea-block focus:border-0"
                                />
                            </div>
                            <div className="form-field my-2">
                                {generating && <SpinnerButton />}
                                {!generating && <button type="submit" className="btn btn-primary btn-block">Generate</button>}
                            </div>
                        </form>
                        {
                            image &&
                            <div className="flex flex-col">
                                <Image src={image} alt={"Generated image"} height={512} width={512} />
                                <form onSubmit={handleFormSubmit}>
                                    <div className="form-field my-2">
                                        <label className="block text-sm font-medium text-slate-500">
                                            Name <span className="text-pink-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Name"
                                            className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                            value={form.name}
                                            onChange={(e) => setForm({...form, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-field my-2">
                                        <label className="block text-sm font-medium text-slate-500">
                                            Description <span className="text-pink-600">*</span>
                                        </label>
                                        <textarea
                                            placeholder="Description"
                                            className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm textarea-block"
                                            value={form.description}
                                            onChange={(e) => setForm({...form, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-field my-2">
                                        <label className="block text-sm font-medium text-slate-500">
                                            Space Name <span className="text-pink-600">*</span>
                                        </label>
                                        <select required
                                                className="select block border-0 w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                                onChange={(e) => {
                                                    console.log(e.target.value)
                                                    setForm({...form, space: e.target.value})
                                                }}
                                        >
                                            {spaces.map((space: any, index: number) =>
                                                <option key={index} value={space}>{space}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-field my-2">
                                        <label className="block text-sm font-medium text-slate-500">
                                            Price <span className="text-pink-600">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            step={0.1}
                                            required
                                            placeholder="Price"
                                            className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                            value={form.price}
                                            onChange={(e) => setForm({...form, price: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-field my-2">
                                        <label className="block text-sm font-medium text-slate-500">
                                            Quantity <span className="text-pink-600">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            required
                                            placeholder="Quantity"
                                            className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                            value={form.quantity}
                                            onChange={(e) => setForm({...form, quantity: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-field my-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            Add Attributes <span className="text-pink-600">*</span>
                                        </label>
                                        <div className="flex flex-col gap-1">
                                            {form.attributes.map((attribute: any, index: number) => (
                                                <div key={index} className="flex gap-1">
                                                    <input
                                                        type="text"
                                                        placeholder="Key"
                                                        className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                                        value={attribute.key}
                                                        onChange={(e) => {
                                                            const attributes = form.attributes
                                                            attributes[index].trait_type = e.target.value
                                                            setForm({...form, attributes})
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Value"
                                                        className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                                        value={attribute.value}
                                                        onChange={(e) => {
                                                            const attributes = form.attributes
                                                            attributes[index].value = e.target.value
                                                            setForm({...form, attributes})
                                                        }}
                                                    />
                                                    <button type="button"
                                                            className="btn btn-ghost btn-sm"
                                                            onClick={() => {
                                                                const attributes = form.attributes
                                                                attributes.push({trait_type: "", value: ""})
                                                                setForm({...form, attributes})
                                                            }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                                             fill="currentColor">
                                                            <path fillRule="evenodd"
                                                                  d="M10 5a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V6a1 1 0 011-1z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    </button>
                                                    <button type="button"
                                                            className="btn btn-ghost btn-sm"
                                                            onClick={() => {
                                                                const attributes = form.attributes
                                                                attributes.splice(index, 1)
                                                                setForm({...form, attributes})
                                                            }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                                             fill="currentColor">
                                                            <path fillRule="evenodd"
                                                                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-control">
                                        {!generating && <button type="submit" className="btn bg-pink-600 w-full">Create</button>}
                                        {generating && <SpinnerButton />}
                                    </div>
                                </form>
                            </div>
                        }
                    </div>
                </div>
            </Layout>
        </>
    )
}
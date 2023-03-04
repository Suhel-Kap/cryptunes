import Head from "next/head";
import Layout from "@/components/Layout";
import {useState} from "react";
import Image from "next/image";

export default function AI() {
    const [prompt, setPrompt] = useState<string>("")
    const [form, setForm] = useState({
        name: "",
        description: "",
        space: "",
        price: "",
        quantity: "",
    })
    const [generating, setGenerating] = useState<boolean>(false)
    const [image, setImage] = useState<string>("")

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
        console.log(form)
        console.log(image)
        const res = await fetch("/api/uploadToIpfs", {
            method: "POST",
            body: JSON.stringify({image, name: form.name, description: form.description}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        console.log(data)
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
                                {generating &&
                                    <button type="button" className="btn bg-blue-500" disabled>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating
                                    </button>}
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
                                        <select required className="select border-0 px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                                onChange={(e) => setForm({...form, space: e.target.value})}
                                        >
                                            <option value="space-1">Space 1</option>
                                            <option value="space-2">Space 2</option>
                                            <option value="space-3">Space 3</option>
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
                                    <div className="form-control">
                                        <button type="submit" className="btn bg-pink-600 w-full">Create</button>
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
import Head from "next/head";
import Layout from "@/components/Layout";
import {useState} from "react";
import Image from "next/image";

export default function AI() {
    const [prompt, setPrompt] = useState<string>("")
    const [generating, setGenerating] = useState<boolean>(false)
    const [image, setImage] = useState<string>("https://oaidalleapiprodscus.blob.core.windows.net/private/org-UMNeTQLZXViSIi0ShaDqGXYi/user-PZIJWaU5vtlmaFsCmh0AzFAO/img-iPQj4A3Wk1tIKnvkGwpK7Yp2.png?st=2023-03-04T07%3A58%3A53Z&se=2023-03-04T09%3A58%3A53Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-03T17%3A00%3A29Z&ske=2023-03-04T17%3A00%3A29Z&sks=b&skv=2021-08-06&sig=IvolsaBBN%2BrVZC%2B4M7uqgTSDsDJDwOog79GKtG8CQGg%3D")

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
                            <div>
                                <Image src={image} alt={"Generated image"} height={512} width={512} />
                            </div>
                        }
                    </div>
                </div>
            </Layout>
        </>
    )
}
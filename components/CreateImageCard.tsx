import {useEffect, useState} from "react";
import {useContract} from "@/hooks/useContract";
import {useAccount} from "wagmi";
import {useIsMounted} from "@/hooks/useIsMounted";
import toast from "react-hot-toast";
import uploadAudio from "@/lib/uploadAudio";
import uploadImage from "@/lib/uploadImage";
import uploadMetadata from "@/lib/uploadMetadata";
import SpinnerButton from "@/components/SpinnerButton";

export default function CreateImageCard({spaces, hasSpace}: { spaces: string[], hasSpace: boolean }) {
    const {declareNFT, getCurrentTokenId} = useContract()
    const {address} = useAccount()
    const [generating, setGenerating] = useState<boolean>(false)
    const mounted = useIsMounted()
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

    const [image, setImage] = useState<File | null>(null)

    const handleImageChange = (event: any) => {
        const selectedFile = event.target.files[0];
        if (selectedFile.size > 1024 * 1024) {
            toast.error("File size should be less than 1 MB");
            return;
        }
        setImage(selectedFile);

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageSrc = event?.target?.result;
            const image = document.getElementById('image-preview');
            // @ts-ignore
            image.src = imageSrc;
        }
        reader.readAsDataURL(selectedFile);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setGenerating(true)
        if (!hasSpace) {
            toast.error("Please create a space before minting an NFT")
            setGenerating(false)
            return
        }
        const toastId = toast.loading("Minting NFT...")
        if(!image){
            toast.error("Please select an image", {id: toastId})
            setGenerating(false)
            return
        }
        const imageCid = await uploadImage(image!, form.name, form.description)
        console.log("imageCid", imageCid)
        const metadata = {
            name: form.name,
            image: imageCid,
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
        <div className="card bg-rose-100" style={{maxWidth: "50rem"}}>
            <div className="mx-auto flex w-full max-w-lg flex-col gap-1">
                <div className="card-header mx-auto" style={{marginTop: "2.5rem", flexDirection: "column"}}>
                    <h2 className="text-stone-900">Create Image NFT</h2>
                    <p className="text-sm text-slate-100 text-center">
                        Make sure you mint a space before minting an NFT
                    </p>
                </div>
                <div className="card-body form-group pt-0.5">
                    <form onSubmit={handleSubmit}>
                        <div className="form-field my-2">
                            <label className="block text-sm font-medium text-slate-700">
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
                            <label className="block text-sm font-medium text-slate-700">
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
                            <label className="block text-sm font-medium text-slate-700">
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
                            <label className="block text-sm font-medium text-slate-700">
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
                            <label className="block text-sm font-medium text-slate-700">
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
                        <div className="form-field my-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Choose NFT Image <span className="text-pink-600">*</span>
                            </label>
                            <input type="file" accept="image/*"
                                   className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                   onChange={handleImageChange}
                            />
                            {image &&
                                <img id="image-preview" alt="preview"
                                     style={{maxWidth: '100%', maxHeight: '350px'}}/>
                            }
                        </div>
                        <div className="form-control">
                            {!generating && <button type="submit" className="btn bg-pink-600 w-full">Create</button>}
                            {generating && <SpinnerButton />}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
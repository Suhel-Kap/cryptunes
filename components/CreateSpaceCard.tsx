import {useState} from "react";
import Image from "next/image";
import {useOrbisContext} from "../contexts/OrbisContext";
import SpinnerButton from "@/components/SpinnerButton";
import toast from "react-hot-toast";
import {useContract} from "@/hooks/useContract";
import uploadImage from "@/lib/uploadImage";

export default function CreateSpaceCard() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        supplyTokens: 0
    })
    const [pfp, setImage] = useState<File | null>(null)
    const [generating, setGenerating] = useState<boolean>(false)

    const {orbis, user} = useOrbisContext()
    const {spaceExists, mintSpace} = useContract()

    const handleImageChange = (event: any) => {
        const selectedFile = event.target.files[0];
        // selected file size should be less than 1 MB
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

    const handleSubmit = async(e: any) => {
        e.preventDefault()
        setGenerating(true)
        if(!pfp){
            toast.error("Please select an image")
            setGenerating(false)
            return
        }
        const toastId = toast.loading("Minting Space...")
        // @ts-ignore
        const isConnected = await orbis.isConnected()
        console.log(isConnected)

        const exists = await spaceExists(form.name)
        if (exists) {
            toast.error("Space already exists!", {id: toastId})
            setGenerating(false)
            return
        }
        const imageUrl = await uploadImage(pfp!, form.name, form.description)
        console.log(imageUrl)
        // @ts-ignore
        const res = await orbis.createGroup({
            pfp: imageUrl,
            name: form.name,
            description: form.description
        })
        const groupId = res.doc
        console.log(groupId, form.supplyTokens, form.name)
        try{
            await mintSpace(form.name, groupId, form.supplyTokens)
            toast.success("Space Minted!", {id: toastId})
        } catch (e){
            console.log(e)
            toast.error("Error minting space", {id: toastId})
        }

        setGenerating(false)
    }

    return (
        <div className="card bg-rose-100" style={{maxWidth: "50rem"}}>
            <div className="mx-auto flex w-full max-w-lg flex-col gap-1">
                <div className="card-header mx-auto" style={{marginTop: "2.5rem", flexDirection: "column"}}>
                    <h2 className="text-stone-900">Create Collection (Space)</h2>
                    <p className="text-sm text-slate-100">Make sure you create a Collection before creating an NFT</p>
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
                                required
                                className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm textarea-block"
                                value={form.description}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                            />
                        </div>
                        <div className="form-field my-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Total Tokens for this space <span className="text-pink-600">*</span>
                            </label>
                            <input
                                type="number"
                                min={1}
                                required
                                placeholder="Supply Tokens"
                                className="block w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                value={form.supplyTokens}
                                onChange={(e) => setForm({...form, supplyTokens: parseInt(e.target.value)})}
                            />
                        </div>
                        <div className="form-field my-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Choose Space Profile Picture (less than 1 MB) <span className="text-pink-600">*</span>
                            </label>
                            <input type="file" accept="image/*" required
                                   className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                   onChange={handleImageChange}
                            />
                            {pfp &&
                                <img id="image-preview" alt="preview"
                                     style={{maxWidth: '100%', maxHeight: '350px'}}/>
                            }
                        </div>
                        <div className="form-control">
                            {!generating && <button type="submit" className="btn bg-pink-600 w-full">Create Collection</button>}
                            {generating && <SpinnerButton />}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
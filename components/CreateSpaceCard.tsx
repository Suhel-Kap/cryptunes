import {useState} from "react";
import Image from "next/image";

export default function CreateSpaceCard() {
    const [form, setForm] = useState({
        name: "",
        description: "",
    })
    const [pfp, setImage] = useState<File | null>(null)

    const handleImageChange = (event: any) => {
        const selectedFile = event.target.files[0];
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

    }

    return (
        <div className="card bg-rose-100" style={{maxWidth: "35rem"}}>
            <div className="mx-auto flex w-full max-w-sm flex-col gap-1">
                <div className="card-header mx-auto" style={{marginTop: "2.5rem", flexDirection: "column"}}>
                    <h2 className="text-stone-900">Create Space</h2>
                    <p className="text-sm text-slate-100">Make sure you mint a space before minting an NFT</p>
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
                                Choose Space Profile Picture <span className="text-pink-600">*</span>
                            </label>
                            <input type="file" accept="image/*"
                                   className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                   onChange={handleImageChange}
                            />
                            {pfp &&
                                <img id="image-preview" alt="preview"
                                     style={{maxWidth: '100%', maxHeight: '350px'}}/>
                            }
                        </div>
                        <div className="form-control">
                            <button className="btn bg-pink-600 w-full">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
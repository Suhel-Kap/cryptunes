import {useState} from "react";

export default function CreateImageCard() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        space: "",
        price: "",
        quantity: "",
    })

    const [image, setImage] = useState<File | null>(null)

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
        console.log(form)
    }

    return (
        <div className="card bg-rose-100" style={{maxWidth: "35rem"}}>
            <div className="mx-auto flex w-full max-w-sm flex-col gap-1">
                <div className="card-header mx-auto" style={{marginTop: "2.5rem", flexDirection: "column"}}>
                    <h2 className="text-stone-900">Create Image NFT</h2>
                    <p className="text-sm text-neutral text-center">
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
                            <select required className="select block border-0 w-full px-3 py-2 bg-white text-slate-200 rounded-md text-sm shadow-sm"
                                    onChange={(e) => setForm({...form, space: e.target.value})}
                            >
                                <option value="space-1">Space 1</option>
                                <option value="space-2">Space 2</option>
                                <option value="space-3">Space 3</option>
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
                            <button type="submit" className="btn bg-pink-600 w-full">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
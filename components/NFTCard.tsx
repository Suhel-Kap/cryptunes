import {useContract} from "@/hooks/useContract";
import {useState} from "react";
import toast from "react-hot-toast";

export default function NFTCard({nft}: {
    nft: {
        name: string,
        description: string,
        image: string,
        price: string,
        type: string,
        tokenId: number,
        animation_url: string,
        external_url: string,
        attributes: {
            trait_type: string,
            value: string
        }[]
    }
}) {
    const {mint} = useContract()
    const [isMinting, setIsMinting] = useState(false)

    const handleMint = async () => {
        setIsMinting(true)
        const toastId = toast.loading("Minting...")
        try {
            await mint(nft.tokenId, nft.price)
            toast.success("Minted!", {id: toastId})
        } catch (e) {
            console.log(e)
            toast.error("Error minting", {id: toastId})
        }
        setIsMinting(false)
    }

    return (
        <div className="card card-image-cover relative bg-amber-50">
                                        <span
                                            className="absolute top-3 right-4 badge badge-flat-primary">{nft.type}</span>
            <div onClick={() => window.open(`https://${nft.animation_url}.ipfs.nftstorage.link`)}
                 className="h-44 flex flex-row items-center justify-center cursor-pointer">
                <img className="aspect-auto" src={`https://${nft.image}.ipfs.nftstorage.link`} alt=""/>
            </div>
            <div className="card-body">
                <h2 className="card-header text-slate-600">{nft.name}</h2>
                <p className="text-content2 text-slate-200">{nft.description}</p>
                <div className="card-footer">
                    <button disabled={isMinting} onClick={handleMint}
                            className={`btn-error btn ${isMinting ? "cursor-wait" : ""}`}>
                        Mint for {nft.price} FTM
                    </button>
                    <label className="btn btn-primary" htmlFor={nft.name}>View Attributes</label>

                    <input className="modal-state" id={nft.name} type="checkbox"/>
                    <div className="modal">
                        <label className="modal-overlay"></label>
                        <div className="modal-content flex flex-col gap-5">
                            <label htmlFor={nft.name}
                                   className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                            <h2 className="text-xl">Attributes</h2>
                            <div className="flex w-full overflow-x-auto">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Attribute Name</th>
                                        <th>Attribute Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        nft.attributes.map((attribute, index) => (
                                            <tr key={index}>
                                                <td>{attribute.trait_type}</td>
                                                <td>{attribute.value}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
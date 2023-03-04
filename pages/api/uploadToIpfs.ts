import {NextApiRequest, NextApiResponse} from "next"
import {NFTStorage, File} from "nft.storage"

type Data = {
    cid: any
}

function getAccessToken() {
    return process.env.NFT_STORAGE_API_KEY
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if(req.method === "POST"){
        const {image, name, description} = req.body
        const response = await fetch(image)
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()
        const file = new File([arrayBuffer], "image.png", {type: "image/png"})
        const endpoint = "https://api.nft.storage"
        const token = getAccessToken()
        // @ts-ignore
        const client = new NFTStorage({endpoint, token})
        const cid = await client.store({
            name,
            description,
            image: file
        })
        const data = cid.embed()
        const url = data.image
        const urlData = url.href
        res.status(200).json({"cid": urlData})
    }
}
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
    if (req.method === "POST") {
        const {metadata} = req.body
        console.log(metadata)
        const files = []
        let name = "metadata.json"
        let buffer = JSON.stringify(metadata)
        let newFile = new File([buffer], name)
        files.push(newFile)

        const endpoint = "https://api.nft.storage"
        const token = getAccessToken()
        // @ts-ignore
        const client = new NFTStorage({endpoint, token})
        const cid = await client.storeDirectory(files)
        console.log(cid)
        res.status(200).json({"cid": `https://${cid}.ipfs.nftstorage.link/${name}`})
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb',
        }
    }
}
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
        const {ai} = req.body
        let name, file: File, description
        if(!ai){
            const {name: bName, description: bDesc, filesData, type} = req.body
            name = bName
            description = bDesc
            // console.log("file:", filesData);
            let _file = Buffer.from(filesData[0].buffer.data);
            file = new File([_file], name, {type: `${type}/*`})
        } else {
            const {image, name: bName, description: bDesc} = req.body
            name = bName
            description = bDesc
            const response = await fetch(image)
            const blob = await response.blob()
            const arrayBuffer = await blob.arrayBuffer()
            file = new File([arrayBuffer], "image.png", {type: "image/png"})
        }
        console.log("file:", file)

        const endpoint = "https://api.nft.storage"
        const token = getAccessToken()
        // @ts-ignore
        const client = new NFTStorage({endpoint, token})
        const cid = await client.storeBlob(file!)
        console.log(cid)
        res.status(200).json({"cid": cid})
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb',
        }
    }
}
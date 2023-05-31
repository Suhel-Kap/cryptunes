import {NextApiRequest, NextApiResponse} from "next";
import fs from "fs";
import {NFTStorage, File} from "nft.storage"
import path from 'path';

type Data = {
    cid: any
}

const regex = /https:\/\/.*\.ipfs\.nftstorage\.link"/g

function getAccessToken() {
    return process.env.NFT_STORAGE_API_KEY
}


function updateFinalHtml(html: string, audioUrl: string) {
    return html.replace(regex, audioUrl);
}

const constants = path.join(process.cwd(), 'constants');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const {selectedNft, audioCid} = req.body
    const audioCidUrl = `https://${audioCid}.ipfs.nftstorage.link"`
    console.log(`minting nft${selectedNft}`);
    let location = `${constants}/nfts/nft` + selectedNft + ".html";
    let html = fs.readFileSync(location, "utf8");
    let result = updateFinalHtml(html, audioCidUrl);
    let newFile = new File([result], "nft.html")
    const files = [newFile]
    const endpoint = "https://api.nft.storage"
    const token = getAccessToken()
    // @ts-ignore
    const client = new NFTStorage({endpoint, token})
    const cid = await client.storeDirectory(files)
    console.log(cid)
    res.status(200).json({"cid": cid})
}
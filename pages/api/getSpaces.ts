import {NextApiRequest, NextApiResponse} from "next";
import {ethers} from "ethers";
import {cryptunesAddress, cryptunesAbi} from "../../constants"
//@ts-ignore
import {Orbis} from "@orbisclub/orbis-sdk";

const getPrivateKey = () => {
    return process.env.PRIVATE_KEY
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    if (req.method === "GET") {
        const wallet = new ethers.Wallet(getPrivateKey()!)
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom_testnet');
        const signer = provider.getSigner(wallet.address)
        const contract = new ethers.Contract(cryptunesAddress["cryptunesAddress"], cryptunesAbi, signer)
        const data = await contract.getCollectionsInfo()
        console.log("data:", data)
        let collections = []
        for (let i = 0; i < data[0].length; i++) {
            const collection = {
                name: data[0][i],
                groupId: data[1][i],
            }
            collections.push(collection)
        }
        res.status(200).json(JSON.stringify(collections))
    }
    if (req.method === "POST") {
        const {groupId} = req.body
        // const groupId = "kjzl6cwe1jw14avhy6251vwlhwhkfe2g8ym9rmuur6vx0fqnjb4o8knmolu9q76"
        console.log("groupId:", groupId)
        const wallet = new ethers.Wallet(getPrivateKey()!)
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom_testnet');
        const signer = provider.getSigner(wallet.address)
        const orbis = new Orbis()
        await orbis.connect_v2({
            provider: provider,
            lit: false
        })
        const {data, error} = await orbis.getGroup(groupId)
        if (error) {
            res.status(400).json(JSON.stringify(error))
        }
        res.status(200).json(JSON.stringify(data))
    }
}
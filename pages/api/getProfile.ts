import {NextApiRequest, NextApiResponse} from "next";
//@ts-ignore
import {Orbis} from "@orbisclub/orbis-sdk";
import {ethers} from "ethers";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
){
    const {did} = req.body
    console.log(did)
    const orbis = new Orbis()
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom_testnet');
    await orbis.connect_v2({
        provider: provider,
        lit: false
    })
    const {data, error} = await orbis.getProfile(did)
    if (error) {
        res.status(400).json(JSON.stringify(error))
    }
    res.status(200).json(JSON.stringify(data))
}
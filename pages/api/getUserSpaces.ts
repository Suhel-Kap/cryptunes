import {NextApiRequest, NextApiResponse} from "next";
import {ethers} from "ethers";
import {cryptunesAbi, cryptunesAddress} from "../../constants";

const getPrivateKey = () => {
    return process.env.PRIVATE_KEY
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const {address} = req.body
    console.log("address:", address)
    const wallet = new ethers.Wallet(getPrivateKey()!)
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom_testnet');
    const signer = provider.getSigner(wallet.address)
    const contract = new ethers.Contract(cryptunesAddress["cryptunesAddress"], cryptunesAbi, signer)
    const spaces = await contract.isArtistForCollections(address)
    console.log("spaces:", spaces)
    res.status(200).json(spaces)
}
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
    const {space} = req.body
    console.log(space)
    const wallet = new ethers.Wallet(getPrivateKey()!)
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom_testnet');
    const signer = provider.getSigner(wallet.address)
    const contract = new ethers.Contract(cryptunesAddress["cryptunesAddress"], cryptunesAbi, signer)
    const data = await contract.getcollectionTokens(space)
    console.log("data:", data)
    let nftData = []
    for (let i = 0; i < data.length; i++) {
        let nftMetadata = await contract.uri(data[i])
        nftMetadata = await (await fetch(nftMetadata)).json()
        const priceInBigNum = await contract.getTokenMintPrice(data[i])
        nftMetadata.price = ethers.utils.formatEther(priceInBigNum)
        nftMetadata.tokenId = data[i]
        nftData.push(nftMetadata)
    }
    res.status(200).json(JSON.stringify({
        nftData: nftData
    }))
}
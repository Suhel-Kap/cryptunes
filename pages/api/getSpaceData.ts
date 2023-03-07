import {NextApiRequest, NextApiResponse} from "next";
import {ethers} from "ethers";
import {cryptunesAbi, cryptunesAddress} from "../../constants";
import {intNumberFromHexString} from "@coinbase/wallet-sdk/dist/util";

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
        let data_ = {price: "", tokenId: "", availableTokens: 0, maxCap: 0, metadata: {}}
        let nftMetadata = await contract.getToken(data[i])
        console.log(nftMetadata)
        const ipfsData = await (await fetch(nftMetadata.metadataURL)).json()
        data_.price = ethers.utils.formatEther(nftMetadata[5])
        data_.tokenId = data[i]
        data_.availableTokens = intNumberFromHexString(nftMetadata[4]._hex)
        data_.maxCap = intNumberFromHexString(nftMetadata[3]._hex)
        data_.metadata = {...ipfsData}
        nftData.push(data_)
    }
    res.status(200).json(JSON.stringify({
        nftData: nftData
    }))
}
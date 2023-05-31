import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { cryptunesAbi, cryptunesAddress } from "../../constants";
import { intNumberFromHexString } from "@coinbase/wallet-sdk/dist/util";

const getPrivateKey = () => {
  return process.env.PRIVATE_KEY;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { address } = req.body;
  console.log("address:", address);
  const wallet = new ethers.Wallet(getPrivateKey()!);
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.testnet.mantle.xyz"
  );
  const signer = provider.getSigner(wallet.address);
  const contract = new ethers.Contract(
    cryptunesAddress["cryptunesAddress"],
    cryptunesAbi,
    signer
  );
  const totalNfts = intNumberFromHexString((await contract.totalSupply())._hex);
  console.log("totalNfts:", totalNfts);
  let nftData = [];
  for (let i = 1; i <= totalNfts; i++) {
    const isOwner = intNumberFromHexString(
      (await contract.balanceOf(address, i))._hex
    );
    console.log("isOwner:", isOwner);
    if (isOwner < 1) continue;
    const nft = await contract.getToken(i);
    
      let data_ = {
        price: "",
        tokenId: 0,
        availableTokens: 0,
        maxCap: 0,
        metadata: {},
      };
      const ipfsData = await (await fetch(nft.metadataURL)).json();
      data_.price = ethers.utils.formatEther(nft[5]);
      data_.tokenId = i;
      data_.availableTokens = intNumberFromHexString(nft[4]._hex);
      data_.maxCap = intNumberFromHexString(nft[3]._hex);
      data_.metadata = { ...ipfsData };
      nftData.push(data_);
    
  }
  res.status(200).json(JSON.stringify(nftData));
}

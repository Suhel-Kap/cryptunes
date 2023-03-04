import {BigNumber, ethers} from "ethers";
import {cryptunesAbi, cryptunesAddress} from "../constants"
import {useSigner} from "wagmi";

interface DeclareProps {
    metadataURL: string
    spaceName: String
    mintPrice: number
    maxSupply: number
    currentToken: number
// IPFS SCHEME FOR THE NFT METADATA EXAMPLE
// {
//     name: String
//     image: String
//     animation_url : String
//     description: String
//     type : visualizer || ticket || image || audio
//     "attributes":[
//         {"trait_type":"Hat","value":"Short Mohawk"},
//         {"trait_type":"Background","value":"Blue"},
//         {"trait_type":"Fur","value":"Cream"},
//         {"trait_type":"Eyes","value":"Bored"},
//         {"trait_type":"Clothes","value":"Caveman Pelt"},
//         {"trait_type":"Mouth","value":"Tongue Out"}
//     ]
// }
}


export const useContract = () => {
    const {data: signer} = useSigner()

    const contract = new ethers.Contract(cryptunesAddress["cryptunesAddress"], cryptunesAbi, signer!)

    const getCurrentTokenId = async () => {
        return await contract.totalSupply()
    }


    const setTokenMintPrice = async (tokenId:number , mintPrice:BigNumber) => {
        const tx = await contract.setTokenMintPrice(tokenId, mintPrice, { gasLimit: 1000000})
        return await tx.wait()
    }

    const declareNFT = async ({metadataURL,spaceName,mintPrice,maxSupply,currentToken} :DeclareProps) =>{
        const price = ethers.utils.parseEther(mintPrice.toString())
        const tx = await contract.defineNFT(metadataURL, spaceName,price,maxSupply,currentToken, {gasLimit: 1000000})
        return await tx.wait()
    }


    const balanceOf = async (address :string , tokenId: number) => {
        return await contract.balanceOf(address, tokenId)
    }


    const mint = async (tokenid:number, mintPrice:string) => {
        const tx = await contract.mint(tokenid, {value: mintPrice, gasLimit: 1000000})
        return await tx.wait()
    }

    const getMintPrice = async (tokenid:number) => {
        return await contract.getTokenMintPrice(tokenid)
    }


    const spaceExists = async (spaceName: string) => {
        return await contract.collectionExists(spaceName)
    }

    const mintSpace = async (spaceName: string, groupId: string, collectionSupply: number) => {
        const tx = await contract.createCollection(spaceName, groupId, collectionSupply,{value: ethers.utils.parseEther("0.01"), gasLimit: 1000000})
        return await tx.wait()
    }

    // how to add an address
    const addSpaceArtist = async(spaceName:string, address:any) => {
        const tx = await contract.addCollectionArtist(spaceName, address, { gasLimit: 1000000})
        return await tx.wait()
    }

        // how to add an address
    const deleteSpaceArtist = async(spaceName:string, address:any) => {
        const tx = await contract.deleteCollectionArtist(spaceName, address, { gasLimit: 1000000})
        return await tx.wait()
    }

    const isSpaceArtist = async (spaceName: string, address:any) => {
        return await contract.isCollectionArtist(spaceName, address)
    }

    const getCollections =async () => {
        return await contract.getCollections()
    }

    const getCollectionMaxCap = async(spaceName: string) => {
        return await contract.getCollectionMaxCap(spaceName)
    }

    const getcollectionTokens =async (collectionName:string) => {
        return await contract.getcollectionTokens(collectionName)
    }

    const isArtistForCollections =async (artistAddress:string) => {
        return await contract.isArtistForCollections(artistAddress)
    }


    return {
        getCurrentTokenId,
        setTokenMintPrice,
        spaceExists,
        getCollections,
        getcollectionTokens,
        isArtistForCollections,
        getCollectionMaxCap,
        mintSpace,
        getMintPrice,
        mint,
        isSpaceArtist,
        deleteSpaceArtist,
        addSpaceArtist,
        declareNFT,
        balanceOf,
    }
}
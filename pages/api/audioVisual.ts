import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const regex = /"https:\/\/.*\.ipfs\.nftstorage\.link"/g


}
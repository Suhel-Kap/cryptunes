// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {OpenAIApi, Configuration, CreateImageRequest} from "openai";

type Data = {
    name: string
}

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
})

const openAI = new OpenAIApi(configuration)

const getImage = async (prompt: string) => {
    console.log(prompt)
    const imagePrompt: CreateImageRequest = {
        prompt: prompt,
        n: 1,
        size: "512x512",
        response_format: "url"
    }
    const imageResponse = await openAI.createImage(imagePrompt)
    return imageResponse.data.data[0].url
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if(req.method === "POST"){
        const {prompt} = req.body
        const imageUrl = await getImage(prompt)
        res.status(200).json({name: imageUrl!})
    }
}

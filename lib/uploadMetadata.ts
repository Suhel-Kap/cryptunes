export default async function uploadMetadata(metadata: {
    name: string,
    image: string,
    animation_url?: string,
    description: string,
    type: string,
    attributes?: {
        trait_type: string,
        value: string
    }[]
}){
    const response = await fetch("/api/uploadMetadata", {
        method: "POST",
        body: JSON.stringify({metadata: metadata}),
        headers: {
            "Content-Type": "application/json"
        }
    })
    return (await response.json()).cid
}
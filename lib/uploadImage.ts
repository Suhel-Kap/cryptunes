export default async function uploadImage(image: File, name: string, description: string){
    console.log("image:", image, "name:", name, "description:", description)
    let filesTemp = []

    const content = await image?.arrayBuffer()
    const buf = Buffer.from(content!)
    let temp = {
        name: name + ".png",
        buffer: buf,
    }
    filesTemp.push(temp)
    const data = {
        filesData: filesTemp,
        name: name,
        description: description,
        type: "image",
        ai: false,
    }
    const response = await fetch("/api/uploadToIpfs", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    return (await response.json()).cid
}
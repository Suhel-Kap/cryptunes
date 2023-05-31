export default async function uploadAudio(audio: File, name: string, description: string){
    console.log("image:", audio, "name:", name, "description:", description)
    let filesTemp = []

    const content = await audio?.arrayBuffer()
    const buf = Buffer.from(content!)
    let temp = {
        name: name + ".mp3",
        buffer: buf,
    }
    filesTemp.push(temp)
    const data = {
        filesData: filesTemp,
        name: name,
        description: description,
        type: "audio",
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
import Link from "next/link";
import {useRouter} from "next/router";
import {useIsMounted} from "@/hooks/useIsMounted";
import {useEffect, useState} from "react";

export default function SpaceCard(props: {collection: {name: string, groupId: string}}){
    const router = useRouter()
    const mounted = useIsMounted()
    const [info, setInfo] = useState<any>()
    useEffect(() => {
        console.log(props.collection.groupId)
        if(mounted && props.collection.groupId){
            fetch("/api/getSpaces", {
                method: "POST",
                body: JSON.stringify({groupId: props.collection.groupId}),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                setInfo(JSON.parse(data))
            })
        }
    }, [router.query, mounted])
    console.log(info)

    return (
        <div className="card card-image-cover" style={{maxHeight: 400}}>
            <img src={info?.content?.pfp} alt=""/>
            <div className="card-body">
                <h2 className="card-header">{info?.content?.name}</h2>
                <p className="text-content2">{info?.content?.description}</p>
                <div className="card-footer">
                    <Link href={`/space?name=${props.collection.name}&groupId=${props.collection.groupId}`}>
                        <button className="btn-secondary btn">Learn More</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
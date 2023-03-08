import Link from "next/link";
import {useRouter} from "next/router";
import {useIsMounted} from "@/hooks/useIsMounted";
import {useEffect, useState} from "react";

export default function SpaceCard(props: { collection: { name: string, groupId: string } }) {
    const router = useRouter()
    const mounted = useIsMounted()
    const [info, setInfo] = useState<any>()
    useEffect(() => {
        console.log(props.collection.groupId)
        if (mounted && props.collection.groupId) {
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

    return (
        <div className="card card-image-cover bg-amber-50 relative" style={{maxHeight: 400}}>
            {!info?.content?.pfp && <div style={{maxHeight: 225, maxWidth: 384}} className="skeleton rounded-xl"></div>}
            <div style={{minWidth: 384}} className="max-h-full max-w-full flex flex-row items-center justify-center cursor-pointer">
                <img style={{maxHeight: 177, maxWidth: 384}} src={`https://${info?.content?.pfp}.ipfs.nftstorage.link`} alt=""/>
            </div>
            <div className="card-body">
                <h2 className="card-header text-slate-700">{info?.content?.name}</h2>
                <p className="text-content2 text-slate-400">{info?.content?.description}</p>
                <div className="card-footer">
                    <Link href={`/space?name=${props.collection.name}&groupId=${props.collection.groupId}`}>
                        <button className="btn-secondary btn">go to collection</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
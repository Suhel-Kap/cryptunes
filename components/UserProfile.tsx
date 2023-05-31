import {useEffect, useState} from "react";
import {useIsMounted} from "@/hooks/useIsMounted";

export default function UserProfile({did}: {did: string}){
    const [user, setUser] = useState<any>(null)
    const mounted = useIsMounted()
    useEffect(() => {
        if(mounted && !user){
            fetch("/api/getProfile", {
                method: "POST",
                body: JSON.stringify({did}),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                setUser(JSON.parse(data))
            })
        }
    }, [mounted])

    return (
        <div className="container flex rounded-2xl">
            <div className="avatar">
                <img src={user?.details?.pfp} alt=""/>
            </div>
        </div>
    )
}
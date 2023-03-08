export default function CreatorCard(props: any) {
    return (
        <div className="flex w-60 rounded cursor-pointer" onClick={() => window.open(`/user?address=${props.creator.did}`, "_self")}>
            <div className="mr-2 w-16">
                <img className="rounded-full h-16 w-16" src={props.creator?.details?.profile?.pfp} alt=""/>
            </div>
            <div className="flex-1">
                <div>
                    <span className="tooltip tooltip-bottom" data-tooltip={props.creator?.address}>
                        <h1 className="text-3xl">{props.creator?.details?.profile?.username}</h1>
                        <p className="text-content2">{props.creator?.details?.profile?.description}</p>
                    </span>
                </div>
            </div>
        </div>
    )
}
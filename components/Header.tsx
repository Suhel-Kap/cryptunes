import styles from "@/styles/header.module.css"
import clsx from "clsx";
import makeBlockie from "ethereum-blockies-base64";
import Link from "next/link";
import {useAccount} from "wagmi";
import Connect from "@/components/Conenct";

export default function Header() {
    const {isConnected, isDisconnected, address} = useAccount()

    return (
        <div className="navbar rounded-2xl mb-4 sticky top-0 z-10" style={{background: "transparent"}}>
            <div className={clsx("navbar-start", styles.title)}>
                <Link className="navbar-item" href={"/"}>
                    Cryptunes
                </Link>
            </div>
            <div className="navbar-center">
                <Link className="navbar-item link hover:bg-fuchsia-300" style={{color: "white"}} href="/create">
                    Create
                </Link>
                <Link className="navbar-item link hover:bg-fuchsia-300 underline decoration-orange-500" style={{color: "white"}} href="/ai">
                    AI NFT
                </Link>
                <Link className="navbar-item link hover:bg-fuchsia-300" style={{color: "white"}} href="/discussions">
                    Discussions
                </Link>
                <Link className="navbar-item link hover:bg-fuchsia-300" style={{color: "white"}} href="/explore">
                    Explore
                </Link>
            </div>
            <div className="navbar-end">
                {isConnected && (
                    <div className="avatar avatar-ring avatar-md">
                        <div className="dropdown-container">
                            <div className="dropdown">
                                <label className="btn btn-ghost flex cursor-pointer px-0" tabIndex={0}>
                                    <img src={makeBlockie(address as string)} className="rounded-full" alt="avatar"/>
                                </label>
                                <div className="dropdown-menu dropdown-menu-bottom-left">
                                    <Link href={"/my-profile"} className="dropdown-item text-sm">
                                        My Profile
                                    </Link>
                                    {isConnected && (
                                        <Connect/>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isDisconnected && (
                    <Connect/>
                )}
            </div>
        </div>
    )
}
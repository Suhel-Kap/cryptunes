import styles from "@/styles/header.module.css"
import clsx from "clsx";
import makeBlockie from "ethereum-blockies-base64";
import Link from "next/link";
import {useAccount} from "wagmi";
import Connect from "@/components/Conenct";
import {useOrbisContext} from "../contexts/OrbisContext";

export default function Header() {
    const {isConnected, isDisconnected, address} = useAccount()
    const {user} = useOrbisContext()

    return (
        <div className="navbar rounded-2xl mb-4 sticky top-0 z-10" style={{background: "transparent"}}>
            <div className={clsx("navbar-start", styles.title)}>
                <Link className="navbar-item" href={"/"}>
                    Cryptunes
                </Link>
            </div>
            <div className="navbar-center">
                <Link passHref href="/create">
                    <a className="navbar-item link hover:bg-fuchsia-300" style={{color: "white"}}>
                        Create NFT
                    </a>
                </Link>
                <Link passHref href="/ai">
                    <a className="navbar-item link hover:bg-fuchsia-300 underline decoration-orange-500"
                       style={{color: "white"}}>
                        Create AI NFT
                    </a>
                </Link>
                <Link passHref href="/discussions">
                    <a className="navbar-item link hover:bg-fuchsia-300" style={{color: "white"}}>
                        Cryptunes Chat
                    </a>
                </Link>
                <Link passHref href="/explore">
                    <a className="navbar-item link hover:bg-fuchsia-300" style={{color: "white"}}>
                        Explore Collections
                    </a>
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
                                    {/*// @ts-ignore*/}
                                    <Link href={`/user?address=${user?.did}`} className="dropdown-item my-1 p-1 text-sm">
                                        My Profile
                                    </Link>
                                    {isConnected && (
                                        <div className="dropdown-item">
                                        <Connect/>
                                        </div>
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
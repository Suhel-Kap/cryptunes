"use client"
import {ConnectButton} from "@rainbow-me/rainbowkit";

export default function Connect() {
    return (
        <div>
            <ConnectButton label="Sign In" showBalance={false}/>
        </div>
    )
}
import GlassPane from "@/components/Glasspane";
import Header from "@/components/Header";
import {Toaster} from "react-hot-toast";

export default function Layout({children}: any) {
    return (
        <div className="rainbow-mesh w-auto p-2 flex flex-col h-screen">
            <Header/>
            <GlassPane className="w-full h-screen flex justify-center overflow-auto hide-scrollbar">
                {children}
            </GlassPane>
            <Toaster/>
        </div>
    )
}
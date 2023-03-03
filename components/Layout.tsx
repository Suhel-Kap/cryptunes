import GlassPane from "@/components/Glasspane";
import Header from "@/components/Header";

export default function Layout({children}: any) {
    return (
        <div className="rainbow-mesh h-screen w-auto p-2">
        <GlassPane className="w-full h-screen flex items-center overflow-auto hide-scrollbar justify-center">
            <Header />
            {children}
        </GlassPane>
        </div>
    )
}
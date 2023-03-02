import GlassPane from "@/components/Glasspane";

export default function Layout({children}: any) {
    return (
        <body className="rainbow-mesh h-screen w-auto p-2">
        <GlassPane className="w-full h-full flex items-center justify-center">
            {children}
        </GlassPane>
        </body>
    )
}
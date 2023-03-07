import Layout from "@/components/Layout";
import Head from "next/head";

export default function Page404() {
    return (
        <Layout>
            <Head>
                <title>404 - Page not found</title>
            </Head>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-6xl font-bold">404</h1>
                <h2 className="text-2xl font-bold">Page not found</h2>
            </div>
        </Layout>
    )
}
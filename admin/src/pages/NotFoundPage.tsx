import React from "react";
import Page from "@/ui/components/page/Page.tsx";
import PageHeader from "@/ui/components/page/PageHeader.tsx";
import PageContent from "@/ui/components/page/PageContent.tsx";


const NotFoundPage: React.FC = () => {
    return (
        <Page>
            <PageHeader />
            <PageContent>
                <div className="flex flex-col items-center justify-center h-full py-20">
                    <h1 className="text-6xl font-bold mb-4">404</h1>
                    <p className="text-xl mb-8">Page Not Found</p>
                    <p className="text-center text-muted-foreground">
                        The page you are looking for does not exist or has been moved.
                    </p>
                </div>
            </PageContent>
        </Page>
    )
}

export default NotFoundPage;
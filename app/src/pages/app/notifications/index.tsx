import React from 'react';
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";

const NotificationsPage: React.FC = () => {
    return (
        <Page>
            <PageContent>
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <p className="text-sm text-muted-foreground">Your notifications will appear here.</p>
            </PageContent>
        </Page>
    );
};

export default NotificationsPage;


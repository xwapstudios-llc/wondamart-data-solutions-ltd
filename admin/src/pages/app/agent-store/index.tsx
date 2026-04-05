import React from 'react';
import Page from '@/ui/page/Page.tsx';
import PageHeading from '@/ui/page/PageHeading.tsx';

const AgentStorePage: React.FC = () => {
    return (
        <Page className="pt-2 space-y-4">
            <PageHeading>Agent Store</PageHeading>
            <div className="text-muted-foreground">
                Agent store page content coming soon...
            </div>
        </Page>
    );
};

export default AgentStorePage;


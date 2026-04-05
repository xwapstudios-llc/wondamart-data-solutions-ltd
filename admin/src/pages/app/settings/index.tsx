import React from 'react';
import Page from '@/ui/page/Page.tsx';
import PageHeading from '@/ui/page/PageHeading.tsx';

const SettingsPage: React.FC = () => {
    return (
        <Page className="pt-2 space-y-4">
            <PageHeading>Settings</PageHeading>
            <div className="text-muted-foreground">
                Settings page content coming soon...
            </div>
        </Page>
    );
};

export default SettingsPage;


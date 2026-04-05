import React from 'react';
import Page from '@/ui/page/Page.tsx';
import PageHeading from '@/ui/page/PageHeading.tsx';


// Todo: Add copy emails for admin to copy all emails of filtered result.
const UsersPage: React.FC = () => {
    return (
        <Page className="pt-2 space-y-4">
            <PageHeading>Users</PageHeading>
            <div className="text-muted-foreground">
                Users page content coming soon...
            </div>
        </Page>
    );
};

export default UsersPage;


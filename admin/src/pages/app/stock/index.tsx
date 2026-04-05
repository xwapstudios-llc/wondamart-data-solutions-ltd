import React from 'react';
import Page from '@/ui/page/Page.tsx';
import PageHeading from '@/ui/page/PageHeading.tsx';

const StockPage: React.FC = () => {
    return (
        <Page className="pt-2 space-y-4">
            <PageHeading>Stock</PageHeading>
            <div className="text-muted-foreground">
                Stock page content coming soon...
            </div>
        </Page>
    );
};

export default StockPage;


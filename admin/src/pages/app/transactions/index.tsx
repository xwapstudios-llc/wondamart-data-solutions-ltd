import React from 'react';
import { useParams } from 'react-router-dom';
import Page from '@/ui/page/Page.tsx';
import PageHeading from '@/ui/page/PageHeading.tsx';
import { txTypes, type TxType } from '@common/tx';

const TransactionsPage: React.FC = () => {
    const { type } = useParams<{ type?: TxType }>();

    const isValidType = type && txTypes.includes(type);
    const displayType = isValidType ? type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All';

    return (
        <Page className="pt-2 space-y-4">
            <PageHeading>Transactions - {displayType}</PageHeading>
            <div className="text-muted-foreground">
                Transactions page content coming soon...
                {isValidType && <p>Filtering by type: {type}</p>}
            </div>
        </Page>
    );
};

export default TransactionsPage;

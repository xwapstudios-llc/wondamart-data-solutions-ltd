import React from 'react';
import {useParams} from 'react-router-dom';

const HistoryPurchaseDetail: React.FC = () => {
    const {id} = useParams();
    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Purchase Detail</h1>
            <p className="text-sm text-muted-foreground">Detail for purchase {id}</p>
        </div>
    );
};

export default HistoryPurchaseDetail;


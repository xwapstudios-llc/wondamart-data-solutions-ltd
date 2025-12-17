import React from "react";
import type {Tx} from "@common/types/tx";
import DataBundleData from "./DataBundleData";
import AfaBundleData from "./AfaBundleData";
import ResultCheckerData from "./ResultCheckerData";
import DepositData from "./DepositData";

import type { TxDataBundleData } from "@common/types/data-bundle";
import type { TxAfaBundleData } from "@common/types/afa-bundle";
import type { TxResultCheckerData } from "@common/types/result-checker";
import type { TxDepositData } from "@common/types/account-deposit";

interface Props { tx: Tx }

const TxDataRenderer: React.FC<Props> = ({tx}) => {
    switch(tx.type) {
        case 'data-bundle':
            return <DataBundleData data={tx.data as TxDataBundleData} />;
        case 'afa-bundle':
            return <AfaBundleData data={tx.data as TxAfaBundleData} />;
        case 'result-checker':
            return <ResultCheckerData data={tx.data as TxResultCheckerData} />;
        case 'deposit':
            return <DepositData data={tx.data as TxDepositData} />;
        default:
            return <div>Unknown tx type</div>;
    }
}

export default TxDataRenderer;

"use client"

import React, {useEffect, useState} from "react";

import DataBundleMiniCard from "@/ui/components/DataBundleMiniCard";
import DepositMiniCard from "@/ui/components/DepositMiniCard";
import CommissionDepositMiniCard from "@/ui/components/CommissionDepositMiniCard";
import AfaBundleMiniCard from "@/ui/components/AfaBundleMiniCard";
import ResultCheckerMiniCard from "@/ui/components/ResultCheckerMiniCard";
import LoadingHistoryCard from "@/ui/components/LoadingHistoryCard";
import {Tx} from "@common/types/tx";
import {ClTx} from "@common/client-api/tx";
import {TxDataBundle} from "@common/types/data-bundle";
import {TxAccountDeposit} from "@common/types/account-deposit";
import {TxCommissionDeposit} from "@common/types/commission-deposit";
import {TxAfaBundle} from "@common/types/afa-bundle";
import {TxResultChecker} from "@common/types/result-checker";



interface HistoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
    txID: string;
}

const HistoryCard: React.FC<HistoryCardProps> = ({txID, ...pros}) => {
    const [activity, setActivity] = useState<Tx | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Activity: ", txID);
        ClTx.readOne(txID)
            .then(a => {
            if (a) setActivity(a);
        }).catch(err => {
            console.error(err)
        }).finally(() => {
            setLoading(false);
        });
    }, [txID]);

    if (!loading && !activity) return (
        <div className={`p-2 border rounded-md text-destructive`} {...pros}>
            Loading Error
        </div>
    );

    return (
        activity?.type == "data-bundle" ? <DataBundleMiniCard key={activity.id} tx={activity as TxDataBundle} {...pros} />
            : activity?.type == "deposit" ? <DepositMiniCard key={activity.id} tx={activity as TxAccountDeposit} {...pros} />
                : activity?.type == "commission-deposit" ? <CommissionDepositMiniCard key={activity.id} tx={activity as TxCommissionDeposit} {...pros} />
                    : activity?.type == "afa-bundle" ? <AfaBundleMiniCard key={activity.id} tx={activity as TxAfaBundle} {...pros} />
                        : activity?.type == "result-checker" ? <ResultCheckerMiniCard key={activity.id} tx={activity as TxResultChecker} {...pros} />
                            : <LoadingHistoryCard />
    )
}

export default HistoryCard;
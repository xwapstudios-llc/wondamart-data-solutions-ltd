"use client"

import React, {useCallback, useEffect, useRef, useState} from "react";
import {useAppStore} from "@/lib/useAppStore";
import FilterButton from "@/ui/components/FilterButton";
import {Tx, TxType} from "@common/types/tx";
import DataBundleMiniCard from "@/ui/components/DataBundleMiniCard";
import DepositMiniCard from "@/ui/components/DepositMiniCard";
import CommissionDepositMiniCard from "@/ui/components/CommissionDepositMiniCard";
import LoadingHistoryCard from "@/ui/components/LoadingHistoryCard";
import {TxDataBundle} from "@common/types/data-bundle";
import {TxAccountDeposit} from "@common/types/account-deposit";
import {TxCommissionDeposit} from "@common/types/commission-deposit";
import AfaBundleMiniCard from "@/ui/components/AfaBundleMiniCard";
import {TxAfaBundle} from "@common/types/afa-bundle";
import ResultCheckerMiniCard from "@/ui/components/ResultCheckerMiniCard";
import {TxResultChecker} from "@common/types/result-checker";
import {ClTx} from "@common/client-api/tx";

const UserHistory: React.FC = () => {
    const profile = useAppStore().profile;
    const [selectedPeriod, setSelectedPeriod] = useState("0");
    const [selectedCategory, setSelectedCategory] = useState("0");
    const [allHistory, setAllHistory] = useState<Tx[]>([]);
    const [history, setHistory] = useState<Tx[]>([]);
    const [loading, setLoading] = useState(false);
    const requestCounter = useRef(0);

    const period = [
        { label: "All time", value: "0" },
        { label: "24 hours", value: "1" },
        { label: "3 days", value: "3" },
        { label: "7 days", value: "7" },
        { label: "14 days", value: "14" },
        { label: "31 days", value: "31" },
    ];

    const category = [
        { label: "All", value: "0" },
        { label: "Bundles", value: "1" },
        { label: "Deposits", value: "2" },
        { label: "Checkers", value: "3" },
    ];

    // fetcher uses a request counter to ignore stale responses (same idea as admin TxPage)
    const fetchHistory = useCallback(async () => {
        if (!profile) return;
        setLoading(true);
        const thisRequest = ++requestCounter.current;

        try {
            // determine which tx types to fetch based on selectedCategory
            let typesToFetch: string[] | undefined;
            if (selectedCategory === "1") typesToFetch = ["data-bundle", "afa-bundle"];
            else if (selectedCategory === "2") typesToFetch = ["deposit", "commission-deposit"];
            else if (selectedCategory === "3") typesToFetch = ["result-checker"];

            let fetched: Tx[];

            if (!typesToFetch) {
                // fetch all types in parallel
                const [dataBundles, afaBundles, resultChecker, accountDeposits, commissionDeposits] = await Promise.all([
                    ClTx.read({ type: "data-bundle", userId: profile.id }),
                    ClTx.read({ type: "afa-bundle", userId: profile.id }),
                    ClTx.read({ type: "result-checker", userId: profile.id }),
                    ClTx.read({ type: "deposit", userId: profile.id }),
                    ClTx.read({ type: "commission-deposit", userId: profile.id }),
                ]);
                fetched = [...dataBundles, ...afaBundles, ...resultChecker, ...accountDeposits, ...commissionDeposits];
            } else {
                // fetch the requested types in parallel
                const promises = typesToFetch.map(t => ClTx.read({ type: t as TxType, userId: profile.id }));
                const results = await Promise.all(promises);
                fetched = results.flat();
            }

            if (thisRequest !== requestCounter.current) return; // ignore stale

            setAllHistory(fetched);
        } catch (err) {
            console.error(err);
        } finally {
            if (thisRequest === requestCounter.current) setLoading(false);
        }
    }, [profile, selectedCategory]);

    // apply client-side date filtering (selectedPeriod) and sort
    useEffect(() => {
        const applyFilters = () => {
            const now = new Date();
            const periodNum = Number(selectedPeriod);

            let from: Date | null = null;
            if (periodNum > 0) {
                from = new Date(now);
                from.setDate(now.getDate() - periodNum);
            }

            const filtered = allHistory.filter(tx => {
                if (!from) return true; // no date filtering
                // support both Firestore Timestamp and plain date strings/numbers
                const txDate = tx.date.toDate();
                 return txDate >= from && txDate <= now;
            });

            const sorted = filtered.sort((a, b) => (a.date.valueOf() > b.date.valueOf() ? -1 : 1));
            setHistory(sorted);
        };

        applyFilters();
    }, [allHistory, selectedPeriod]);

    useEffect(() => {
        // fetch when profile or category changes
        fetchHistory().then();
    }, [fetchHistory]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">History</h1>
            <p className="text-muted-foreground">Past transactions appear here.</p>

            <div className="flex gap-4 items-center justify-end">
                <div className="flex gap-4 items-center">
                    <span className="font-semibold">Time:</span>
                    <FilterButton
                        values={period}
                        defaultIndex={3}
                        onValueChange={(val) => setSelectedPeriod(val)}
                    />
                </div>
                <div className="flex gap-4 items-center">
                    <span className="font-semibold">Category:</span>
                    <FilterButton
                        values={category}
                        defaultIndex={0}
                        onValueChange={(val) => setSelectedCategory(val)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
                {loading ? (
                    <div className={"flex items-center justify-center p-6"}>
                        <LoadingHistoryCard />
                    </div>
                ) : history.length === 0 ? (
                    <div className={"text-muted-foreground p-6"}>No transactions found.</div>
                ) : (
                    history.map((tx) => (
                        tx?.type == "data-bundle" ? <DataBundleMiniCard key={tx.id} tx={tx as TxDataBundle} />
                            : tx?.type == "deposit" ? <DepositMiniCard key={tx.id} tx={tx as TxAccountDeposit} />
                                : tx?.type == "commission-deposit" ? <CommissionDepositMiniCard key={tx.id} tx={tx as TxCommissionDeposit} />
                                    : tx?.type == "afa-bundle" ? <AfaBundleMiniCard key={tx.id} tx={tx as TxAfaBundle} />
                                        : tx?.type == "result-checker" ? <ResultCheckerMiniCard key={tx.id} tx={tx as TxResultChecker} />
                                            : <LoadingHistoryCard />
                    ))
                )}
            </div>
        </div>
    );
};

export default UserHistory;

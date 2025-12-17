import React, {useCallback, useEffect, useRef, useState} from "react";
import {Tx, txStatus, TxStatus, TxType, txTypes} from "@common/types/tx.ts";
import {AdminTx} from "@common/admin-api/Tx.ts";
import {Timestamp} from "firebase/firestore";
import Page from "@/ui/components/page/Page.tsx";
import PageHeader from "@/ui/components/page/PageHeader.tsx";
import FilterButton from "@/ui/components/FilterButton.tsx";
import PageContent from "@/ui/components/page/PageContent.tsx";
import {FrownIcon, Loader2Icon} from "lucide-react";
import TxViewCard from "@/ui/components/TxViewCard.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import {Input} from "@/cn/components/ui/input.tsx";

interface FilterProps {
    status: TxStatus | "all";
    type: TxType | "all";
    limit?: number;
    // store dates as YYYY-MM-DD strings for the inputs; parsing to Timestamp happens during filtering
    date?: { from?: string; to?: string };
}
const TxPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Tx[]>([]);
    const [allTransactions, setAllTransactions] = useState<Tx[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterProps>({
        status: "all",
        type: "all",
        limit: 50,
        date: undefined,
    });

    // request counter to ignore stale responses
    const requestCounter = useRef(0);

    const statusValues = [
        {label: "All", value: "all"},
        {label: "Processing", value: txStatus[0]},
        {label: "Pending", value: txStatus[1]},
        {label: "Completed", value: txStatus[2]},
        {label: "Failed", value: txStatus[3]},
    ];
    const typeValues = [
        {label: "All", value: "all"},
        {label: "Data Bundle", value: txTypes[0]},
        {label: "AFA Bundle", value: txTypes[1]},
        {label: "Result Checker", value: txTypes[2]},
        {label: "Account Deposit", value: txTypes[3]},
        {label: "Commission Deposit", value: txTypes[4]},
    ];

    const fetchTx = useCallback(async () => {
        setLoading(true);
        const thisRequest = ++requestCounter.current;
        try {
            const res = await AdminTx.read({
                limit: activeFilter.limit,
                type: activeFilter.type === "all" ? undefined : activeFilter.type,
                status: activeFilter.status === "all" ? undefined : activeFilter.status,
            });
            // ignore stale responses
            if (thisRequest !== requestCounter.current) return;
            console.log(res);
            setAllTransactions(res);
            // apply current client-side filters (date & any additional local filtering)
            setTransactions(res);
        } catch (err) {
            console.error(err);
        } finally {
            // only clear loading for the latest request
            if (thisRequest === requestCounter.current) setLoading(false);
        }
    }, [activeFilter.limit, activeFilter.status, activeFilter.type]);

    useEffect(() => {
        // initial load and when status/type/limit changes
        fetchTx().then();
    }, [fetchTx]);


    useEffect(() => {
        // client-side filtering: date range + type/status (type/status already requested from backend but keep double-check)
        const filterTx = () => {
            setTransactions(
                allTransactions.filter((tx) => {
                    let statusMatch = true;
                    let dateMatch = true;
                    let typeMatch = true;

                    if (activeFilter.type !== "all") {
                        typeMatch = tx.type === activeFilter.type;
                    }

                    if (activeFilter.status !== "all") {
                        statusMatch = tx.status === activeFilter.status;
                    }

                    const dateFilter = activeFilter.date;
                    if (dateFilter) {
                        const {from, to} = dateFilter;
                        if (from && !to) {
                            // single day filter: match any tx within that day
                            const start = Timestamp.fromDate(new Date(`${from}T00:00:00`));
                            const end = Timestamp.fromDate(new Date(`${from}T23:59:59.999`));
                            dateMatch = tx.date >= start && tx.date <= end;
                        } else if (!from && to) {
                            const start = Timestamp.fromDate(new Date(`${to}T00:00:00`));
                            const end = Timestamp.fromDate(new Date(`${to}T23:59:59.999`));
                            dateMatch = tx.date >= start && tx.date <= end;
                        } else if (from && to) {
                            // range - ensure order: if user swapped dates, swap them back
                            let startDate = new Date(`${from}T00:00:00`);
                            let endDate = new Date(`${to}T23:59:59.999`);
                            if (startDate > endDate) {
                                const tmp = startDate;
                                startDate = endDate;
                                endDate = tmp;
                            }
                            const start = Timestamp.fromDate(startDate);
                            const end = Timestamp.fromDate(endDate);
                            dateMatch = tx.date >= start && tx.date <= end;
                        }
                    }

                    return statusMatch && dateMatch && typeMatch;
                })
            );
        }

        filterTx();
    }, [activeFilter.date, activeFilter.status, activeFilter.type, allTransactions]);

    return (
        <Page>
            <PageHeader title="Transactions">
                <div className={"bg-muted flex gap-2 flex-wrap p-2"}>
                    <div className={"flex gap-1 items-center"}>
                        <span>Status</span>
                        <FilterButton
                            values={statusValues}
                            defaultIndex={0}
                            onValueChange={(value) => setActiveFilter(prev => ({
                                ...prev,
                                status: value as TxStatus
                            }))}
                        />
                    </div>
                    <div className={"flex gap-1 items-center"}>
                        <span>Type</span>
                        <FilterButton
                            values={typeValues}
                            defaultIndex={0}
                            onValueChange={(value) => setActiveFilter(prev => ({
                                ...prev,
                                type: value as TxType
                            }))}
                        />
                    </div>
                    <div className={"flex gap-1 items-center"}>
                        <span>Limit</span>
                        <Input
                            className={"w-20"}
                            type={"number"}
                            value={activeFilter.limit}
                            onChange={(e) => setActiveFilter(prev => ({
                                ...prev,
                                limit: Number(e.target.value) > 0 ? Number(e.target.value) : undefined,
                            }))}
                        />
                </div>
                <div className={"flex gap-2 items-center px-2 py-1"}>
                    <div className={"flex gap-1 items-center"}>
                        <span>From</span>
                        <Input
                            type={"date"}
                            value={activeFilter.date?.from ?? ""}
                            onChange={(e) => setActiveFilter(prev => ({
                                ...prev,
                                date: {
                                    ...(prev.date ?? {}),
                                    from: e.target.value || undefined,
                                }
                            }))}
                        />
                    </div>
                    <div className={"flex gap-1 items-center"}>
                        <span>To</span>
                        <Input
                            type={"date"}
                            value={activeFilter.date?.to ?? ""}
                            onChange={(e) => setActiveFilter(prev => ({
                                ...prev,
                                date: {
                                    ...(prev.date ?? {}),
                                    to: e.target.value || undefined,
                                }
                            }))}
                        />
                    </div>
                </div>
                </div>
            </PageHeader>
            <PageContent className={"pb-12"}>
                {
                    loading ? (
                        <div className={"flex items-center justify-center w-full h-24"}>
                            <Loader2Icon className={"animate-spin"} size={44}/>
                        </div>
                    ) : null
                }
                <div>
                    {transactions.length === 0 ? (
                        <div className={"flex items-center justify-center gap-4 flex-col w-full h-[75vh] opacity-50"}>
                            <FrownIcon size={"200"}/>
                            <p>No Transactions found</p>
                        </div>
                    ) : (
                        <div className={"space-4 grid md:grid-cols-2 gap-4"}>
                            {
                                transactions.map((tx) => (
                                    <TxViewCard key={tx.id} tx={tx} />
                                ))
                            }
                        </div>
                    )}
                </div>
                <div className={"fixed right-2 bottom-2 p-2 flex justify-center items-center gap-2"}>
                    <Button size={"lg"} onClick={fetchTx}>
                        <Loader2Icon className={`${loading && "animate-spin"}`} size={44}/> Refresh
                    </Button>
                </div>
            </PageContent>
        </Page>
    )
}

export default TxPage;

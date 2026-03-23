import { useState } from "react";
import Page from "@/ui/page/Page.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Tx } from "@common/tx";
import { Timestamp } from "firebase/firestore";
import TxTable from "@/ui/components/TxTable.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import { SearchIcon, ReceiptIcon } from "lucide-react";

const schema = z.object({
    phone: z
        .string()
        .min(1, "Mobile number is required")
        .regex(/^0[235][0-9]{8}$/, "Enter a valid Ghanaian mobile number (e.g. 0241234567)"),
});

type FormData = z.infer<typeof schema>;

const placeholderTx: Tx[] = [
    { txId: "tx_001", type: "bundle-purchase", amount: 1500, balance: 48500, status: "success",  agentId: "agent_1", time: Timestamp.fromDate(new Date("2025-07-01T08:30:00")), txData: {} },
    { txId: "tx_002", type: "paystack-deposit",  amount: 50000, balance: 98500, status: "success", agentId: "agent_1", time: Timestamp.fromDate(new Date("2025-07-02T10:00:00")), txData: {} },
    { txId: "tx_003", type: "bundle-purchase", amount: 2500, balance: 96000, status: "success",  agentId: "agent_1", time: Timestamp.fromDate(new Date("2025-07-03T14:15:00")), txData: {} },
    { txId: "tx_004", type: "bundle-purchase", amount: 5000, balance: 91000, status: "failed",   agentId: "agent_2", time: Timestamp.fromDate(new Date("2025-07-04T09:45:00")), txData: {} },
    { txId: "tx_005", type: "refund",   amount: 5000, balance: 96000, status: "success",  agentId: "agent_2", time: Timestamp.fromDate(new Date("2025-07-04T11:00:00")), txData: {} },
    { txId: "tx_006", type: "bundle-purchase", amount: 10000, balance: 86000, status: "pending", agentId: "agent_1", time: Timestamp.fromDate(new Date("2025-07-05T16:20:00")), txData: {} },
];

// This page is for clients with an agent id or clients who want to track their transactions without signing in.
const ClientTrackTxPage = () => {
    const [transactions, setTransactions] = useState<Tx[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema as never),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = async (_data: FormData) => {
        setError(null);
        setTransactions(null);
        // TODO: replace with real API call
        setTransactions(placeholderTx);
    };

    return (
        <Page className="pb-8">
            <PageContent className="max-w-4xl mx-auto space-y-4 pt-4">
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-cyan-500 text-white">
                            <SearchIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Track Transactions</p>
                            <p className="text-xs text-muted-foreground">Find your transaction history</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Mobile Number</label>
                            <input
                                type="tel"
                                placeholder="e.g. 0241234567"
                                {...register("phone")}
                                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                                    errors.phone ? "border-red-500 focus:ring-red-400" : "focus:ring-ring"
                                }`}
                            />
                            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold py-2.5 rounded-md transition"
                        >
                            {isSubmitting ? "Searching..." : "Find Transactions"}
                        </button>
                    </form>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                {transactions !== null && (
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex size-9 items-center justify-center rounded-md bg-teal-500 text-white">
                                <ReceiptIcon className="size-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Transaction History</p>
                                <p className="text-xs text-muted-foreground">
                                    {transactions.length === 0 ? "No transactions found" : `${transactions.length} transaction(s) found`}
                                </p>
                            </div>
                        </div>
                        <TxTable transactions={transactions} />
                    </div>
                )}
            </PageContent>
        </Page>
    );
};

export default ClientTrackTxPage;

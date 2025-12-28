import React, {useEffect, useState} from 'react';
import type {CommissionDoc} from "@common/types/commissions.ts";
import {ClCommission} from "@common/client-api/db-commission.ts";
import {useAppStore} from "@/lib/useAppStore.ts";
import LoadingView from "@/ui/components/views/LoadingView.tsx";
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import CommissionCard from "@/ui/components/cards/commission/CommissionCard.tsx";
import NoItems from "@/ui/components/cards/NoItems.tsx";
import {CoinsIcon} from "lucide-react";

const CommissionsIndex: React.FC = () => {
    const {user, setError} = useAppStore();
    const [commissions, setCommissions] = useState<CommissionDoc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (commissions.length === 0) {
                setLoading(true);
                const c = await ClCommission.readAll(user?.uid ?? "");
                setCommissions(c);
            }
        }
        fetch()
            .then()
            .catch(() => setError("An Error occurred when fetching commissions. Please try again."))
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <Page>
            <PageHeading>Commissions</PageHeading>
            <PageSubHeading>View commission summaries.</PageSubHeading>
            <PageContent className={"bundles-grid mt-4"}>
                {
                    loading ? (
                        <>
                            <LoadingView className={"h-44"}/>
                            <LoadingView className={"h-44"}/>
                        </>
                    ) : commissions.length > 0 ? (
                        commissions.map((commission: CommissionDoc) => <CommissionCard com={commission}/>)
                    ) : (
                        <NoItems Icon={CoinsIcon}>
                            No Commissions earned yet. {commissions.length}
                        </NoItems>
                    )
                }
            </PageContent>
        </Page>
    );
};

export default CommissionsIndex;


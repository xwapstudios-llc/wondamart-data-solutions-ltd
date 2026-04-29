import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import type {CommissionDoc} from "@common/types/commissions.ts";
import {ClCommission} from "@common/client-api/db-commission.ts";
import LoadingView from "@/ui/components/views/LoadingView.tsx";
import CommissionDetailsView from "@/ui/components/views/CommissionDetailsView.tsx";
import OopsView from "@/ui/components/views/OopsView.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";

const CommissionsDetail: React.FC = () => {
    const {id} = useParams();
    const {setError} = useAppStore();
    const [commission, setCommission] = useState<CommissionDoc | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function run() {
            if (commission == null && id != undefined) {
                setLoading(true);
                const c = await ClCommission.readOne(id);
                if (c) setCommission(c);
                else setError("No commission found.");
            }
        }
        run()
            .then()
            .catch(() => setError("An Error occurred when fetching commissions details. Please try again."))
            .finally(() => setLoading(false));
    }, [commission, id]);

    return (
        <Page>
            <PageContent>
                <h1 className="text-2xl font-semibold">Commission Detail</h1>
                {
                    loading ? <LoadingView />
                        : commission != null ? (
                            <CommissionDetailsView com={commission} />
                        ) : (
                            <OopsView>
                                Failed to load commission details.
                            </OopsView>
                        )
                }
            </PageContent>
        </Page>
    );
};

export default CommissionsDetail;


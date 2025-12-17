import React, {useEffect, useState} from "react";
import Page from "@/ui/components/page/Page.tsx";
import PageHeader from "@/ui/components/page/PageHeader.tsx";
import PageContent from "@/ui/components/page/PageContent.tsx";
import {cn} from "@/cn/lib/utils.ts";
import {useNavigate, useParams} from "react-router-dom";
import type {DataBundle} from "@common/types/data-bundle.ts";
import {AdminDataBundles} from "@common/admin-api/db-data-bundle.ts";
import UpdateDataBundleForm from "@/ui/forms/UpdateDataBundleForm.tsx";
import R from "@/routes.ts";
import {Skeleton} from "@/cn/components/ui/skeleton.tsx";
import {Loader2Icon} from "lucide-react";

type BundleEditPageProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const BundleEditPage: React.FC<BundleEditPageProps> = ({className, ...props}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [bundle, setBundle] = useState<DataBundle | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBundle = () => {
            if (!id) return;

            setLoading(true);
            AdminDataBundles.readOne(id)
                .then(b => {
                    setBundle(b);
                })
                .catch(err => {
                    console.error(err);
                    setError(String(err));
                }).finally(() => setLoading(false));
        }

        fetchBundle();
    }, [id]);


    return (
        <Page className={cn("", className)} {...props}>
            <PageHeader>
                {
                    id && <p className={"text-center font-medium p-2 bg-muted text-muted-foreground"}>
                        {id}
                    </p>
                }
            </PageHeader>
            <PageContent className={"h-full"}>
                {
                    error && (
                        <p className={"text-destructive p-8"}>
                            {error}
                        </p>
                    )
                }
                {
                    (bundle && !loading) ? (
                        <UpdateDataBundleForm bundle={bundle} onDoneCallback={() => navigate(R.bundles)}/>
                    ) : (
                        <Skeleton className={"w-full h-64 rounded-lg mt-2 flex items-center justify-center"}>
                            <Loader2Icon className={"animate-spin"} size={44}/>
                        </Skeleton>
                    )
                }
            </PageContent>
        </Page>
    )
}

export default BundleEditPage;
import React, {useEffect, useState} from "react";
import Page from "@/ui/components/page/Page.tsx";
import {cn} from "@/cn/lib/utils.ts";
import PageHeader from "@/ui/components/page/PageHeader.tsx";
import PageContent from "@/ui/components/page/PageContent.tsx";
import {useNavigate, useParams} from "react-router-dom";
import type {DataBundle} from "@common/types/data-bundle.ts";
import {AdminDataBundles} from "@common/admin-api/db-data-bundle.ts";
import BundleViewCard from "@/ui/components/BundleViewCard.tsx";
import {Skeleton} from "@/cn/components/ui/skeleton.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import R from "@/routes.ts";
import {Loader2Icon, PenIcon} from "lucide-react";

type BundlePageProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const BundleViewPage: React.FC<BundlePageProps> = ({className, ...props}) => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bundle, setBundle] = useState<DataBundle | undefined>();


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
            <PageContent className={"space-y-4"}>
                {
                    bundle && !loading ? (
                            <div className={"flex flex-col gap-2 mt-2"}>
                                <BundleViewCard bundle={bundle} className={"border-none border-0 shadow-lg"}/>
                                <Button className={"cursor-pointer w-full"} onClick={(e) => {
                                    navigate(R.bundleEdit(bundle.id));
                                    e.stopPropagation();
                                }}>
                                    <PenIcon/> Edit Bundle
                                </Button>
                            </div>
                        ) : (
                        <Skeleton className={"w-full h-64 rounded-lg mt-2 flex items-center justify-center"}>
                            <Loader2Icon className={"animate-spin"} size={44}/>
                        </Skeleton>
                    )
                }
                {
                    error && <p className={"text-destructive p-8"}>
                        {error}
                    </p>
                }
                <div className={"space-y-4"}>
                    <div>
                        <h3 className={"font-semibold"}>Amount Sold</h3>
                        <Skeleton className={"w-full h-40 rounded-lg"}/>
                    </div>
                    <div>
                        <h3 className={"font-semibold"}>Amount Earned</h3>
                        <Skeleton className={"w-full h-40 rounded-lg"}/>
                    </div>
                    <div>
                        <h3 className={"font-semibold"}>Commission paid</h3>
                        <Skeleton className={"w-full h-40 rounded-lg"}/>
                    </div>
                </div>
            </PageContent>
        </Page>
    )
}

export default BundleViewPage;
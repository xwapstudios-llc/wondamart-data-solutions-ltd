import React, {useCallback, useEffect, useState} from "react";
import {type DataBundle, networkIds} from "@common/types/data-bundle.ts";
import DrawerDialog from "@/ui/layouts/DrawerDialog.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import {FrownIcon, Loader2Icon, PlusIcon} from "lucide-react";
import {AdminDataBundles} from "@common/admin-api/db-data-bundle.ts";
import Page from "@/ui/components/page/Page.tsx";
import NewDataBundleForm from "@/ui/forms/NewDataBundleForm.tsx";
import BundleViewCard from "@/ui/components/BundleViewCard.tsx";
import PageHeader from "@/ui/components/page/PageHeader.tsx";
import PageContent from "@/ui/components/page/PageContent.tsx";
import FilterButton from "@/ui/components/FilterButton.tsx";


const BundlesPage: React.FC = () => {
    const [bundles, setBundles] = useState<DataBundle[]>([]);
    const [allBundles, setAllBundles] = useState<DataBundle[]>([]);
    const [loading, setLoading] = useState(false);
    const [openNew, setOpenNew] = useState(false);
    const [activeFilter, setActiveFilter] = useState({
        network: "all",
        enabled: "all",
        commission: "all",
    });

    const networkValues = [
        {label: "All", value: "all"},
        {label: "MTN", value: networkIds[0]},
        {label: "Telecel", value: networkIds[1]},
        {label: "AirtelTigo", value: networkIds[2]},
    ];
    const enabledValues = [
        {label: "All", value: "all"},
        {label: "Enabled", value: "enabled"},
        {label: "Disabled", value: "disabled"},
    ];
    const commissionValues = [
        {label: "All", value: "all"},
        {label: "With Commission", value: "commission"},
        {label: "No Commission", value: "no-commission"},
    ];

    const fetchBundles = useCallback(() => {
        setLoading(true);
        AdminDataBundles.readAll()
            .then(res => {
                console.log(res);
                setBundles(res);
                setAllBundles(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Fetch all data bundles from the backend
        fetchBundles();
    }, [fetchBundles]);


    useEffect(() => {
        const filterBundles = () => {
            setBundles(
                allBundles.filter((bundle) => {
                    let enabledMatch = true;
                    let commissionMatch = true;
                    let networkMatch = true;

                    if (activeFilter.network !== "all") {
                        networkMatch = bundle.network === activeFilter.network;
                    }

                    if (activeFilter.enabled === "enabled") {
                        enabledMatch = bundle.enabled;
                    } else if (activeFilter.enabled === "disabled") {
                        enabledMatch = !bundle.enabled;
                    }

                    if (activeFilter.commission === "commission") {
                        commissionMatch = bundle.commission > 0;
                    } else if (activeFilter.commission === "no-commission") {
                        commissionMatch = bundle.commission === 0;
                    }

                    return enabledMatch && commissionMatch && networkMatch;
                })
            );
        }

        filterBundles();
    }, [activeFilter, allBundles]);

    return (
        <Page className={"space-y-4"}>
            <PageHeader title={"Data Bundles"} className={"border-b p-2"}>
                <div className={"bg-muted flex gap-2 flex-wrap p-2"}>
                    <div className={"flex gap-1 items-center"}>
                        <span>Network</span>
                        <FilterButton
                            values={networkValues}
                            defaultIndex={0}
                            onValueChange={(value) => setActiveFilter(prev => {
                                return {...prev, network: value}
                            })}
                        />
                    </div>
                    <div className={"flex gap-1 items-center"}>
                        <span>Active</span>
                        <FilterButton
                            values={enabledValues}
                            defaultIndex={0}
                            onValueChange={(value) => setActiveFilter(prev => {
                                return {...prev, enabled: value}
                            })}
                        />
                    </div>
                    <div className={"flex gap-1 items-center"}>
                        <span>Commission</span>
                        <FilterButton
                            values={commissionValues}
                            defaultIndex={0}
                            onValueChange={(value) => setActiveFilter(prev => {
                                return {...prev, commission: value}
                            })}
                        />
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
                    {bundles.length === 0 ? (
                        <div className={"flex items-center justify-center gap-4 flex-col w-full h-[75vh] opacity-50"}>
                            <FrownIcon size={"200"}/>
                            <p>No bundles found</p>
                        </div>
                    ) : (
                        <div className={"space-4 grid md:grid-cols-2 gap-4"}>
                            {
                                bundles.map((bundle) => (
                                    <BundleViewCard key={bundle.id} bundle={bundle}/>
                                ))
                            }
                        </div>
                    )}
                </div>
                <div className={"fixed right-2 bottom-2 p-2 flex justify-center items-center gap-2"}>
                    <Button size={"lg"} onClick={fetchBundles}>
                        <Loader2Icon className={`${loading && "animate-spin"}`} size={44}/>
                    </Button>
                    <DrawerDialog
                        open={openNew}
                        onOpenChange={() => setOpenNew(!openNew)}
                        title={"New Data Bundle"}
                        description={"This is to create a new data bundle for customers"}
                        trigger={
                            <Button size={"lg"}>
                                <PlusIcon/> Add New
                            </Button>
                        }
                    >
                        <NewDataBundleForm onDoneCallback={() => {
                            setOpenNew(false);
                            fetchBundles();
                        }}/>
                    </DrawerDialog>
                </div>
            </PageContent>
        </Page>
    )
}

export default BundlesPage;
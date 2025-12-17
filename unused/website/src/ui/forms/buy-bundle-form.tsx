"use client";

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormMessage} from "@/cn/components/ui/form";
import {Input} from "@/cn/components/ui/input";
import {Button} from "@/cn/components/ui/button";
import {numToMoney} from "@/lib/formatters";
import {getProviderById} from "@/lib/providers";
import {useAppStore} from "@/lib/useAppStore";
import {ClTxDataBundle} from "@common/client-api/tx-data-bundle";
import {DataBundle, NetworkId, TxDataBundleRequest} from "@common/types/data-bundle";
import {DataBundles} from "@common/client-api/db-data-bundle";
import {Label} from "@/cn/components/ui/label";

// ------------------ Schema ------------------
const formSchema = z
    .object({
        bundleId: z.string().min(1, "Select a bundle"),
        phone: z.string().regex(/^(0|\+233|233)[25][0-9]{8}$/, "Invalid phone number format"),
    })

type FormValues = z.infer<typeof formSchema>;

interface BuyBundleFormProps {
    networkId: NetworkId;
    onSubmitComplete?: () => void;
    onStateChanged?: (state: 1 | 2) => void;
}

const BuyBundleForm: React.FC<BuyBundleFormProps> = ({networkId, onSubmitComplete, onStateChanged}) => {
    const [step, setStepx] = useState<1 | 2>(1);
    const [bundles, setBundles] = useState<DataBundle[]>([])
    const [selectedBundle, setSelectedBundle] = useState<DataBundle | null>(null);
    const [purchaseRecord, setPurchaseRecord] = useState<TxDataBundleRequest | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bundleId: "",
            phone: "",
        },
    });

    const setStep = (step: 1 | 2) => {
        setStepx(step)
        if (onStateChanged) onStateChanged(step)
    }

    async function handleBundleSelect(b: DataBundle) {
        if (b.id == form.watch("bundleId")) {
            form.setValue("bundleId", "");
            setSelectedBundle(null)
        } else {
            form.setValue("bundleId", b.id);
            setSelectedBundle(b);
        }
    }

    const currentUser = useAppStore().profile;
    useEffect(() => {
        if (currentUser) {
            console.log("Fetching data bundles by network:", networkId);
            DataBundles.readByNetwork(networkId).then((value) => {
                console.log("done reading data bundles:", value);
                setBundles(value);
            });
        }
    }, [currentUser, networkId]);

    const completeForm = async () => {
        const valid = await form.trigger(["phone"]);
        if (valid) setStep(2);
        else return;

        if (selectedBundle && currentUser) {
            setPurchaseRecord({
                uid: currentUser.id,
                networkId: selectedBundle.network,
                bundleId: selectedBundle.id,
                phoneNumber: form.watch("phone")
            })
        }
    }

    async function onSubmit() {
        if (step != 2) return setStep(1);
        if (selectedBundle && purchaseRecord) {
            await ClTxDataBundle.create(purchaseRecord);
            if (onSubmitComplete) onSubmitComplete();

            // Reset
            form.reset();
            setStep(1);
        }
    }


    if (!currentUser) return <div>Please log in to purchase data bundles.</div>

    return (
        <Form {...form}>
            <form className={"h-full w-full min-h-0"} onSubmit={form.handleSubmit(onSubmit)}>
                {/* Step 1: Bundle Selection */}
                {
                    step === 1 && (
                        <div className={"h-full flex flex-col min-h-0 gap-4 justify-between"}>
                            <div className={"space-y-2 flex min-h-0 h-full flex-col"}>
                                <FormMessage>{form.formState.errors.bundleId?.message}</FormMessage>
                                <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
                                <div className={"overflow-y-auto grow min-h-0 pb-4"}>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {
                                            bundles.map((b) => <BundleCard
                                                    bundle={b}
                                                    key={b.id}
                                                    onClick={() => handleBundleSelect(b)}
                                                    active={form.watch("bundleId") == b.id}
                                                    onValueChange={(value) => form.setValue("phone", value)}
                                                    onComplete={completeForm}
                                                />
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Step 2: Review */}
                {
                    step === 2 && selectedBundle && (
                        <div className={"h-full flex flex-col gap-y-4 justify-between"}>
                            {
                                purchaseRecord && <PurchaseOverView record={purchaseRecord} bundle={selectedBundle} />
                            }
                            <div className="flex flex-col gap-y-4">
                                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                                    Back
                                </Button>
                                <Button type="submit">Confirm & Pay</Button>
                            </div>
                        </div>
                    )
                }
            </form>
        </Form>
    );
}


interface BundleCardProps extends React.HTMLAttributes<HTMLDivElement> {
    bundle: DataBundle,
    className?: string,
    active: boolean,
    onValueChange: (phoneNumber: string) => void,
    onComplete?: () => void,
}

const BundleCard: React.FC<BundleCardProps> = ({bundle, className, active, onClick, onValueChange, onComplete, ...props}) => {
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const handleOnClick = () => {
        console.log("On Completed with phone number:", phoneNumber);
        if(onComplete) onComplete();
        // setPhoneNumber("");
    }

    return (
        <div
            key={bundle.id}
            className={`h-fit border-2 rounded-xl p-2 cursor-pointer transition-colors overflow-hidden ${active ? "border-primary" : ""} ${className}`}
            {...props}
        >
            <div
                className="grid grid-cols-2 gap-2 items-center text-2xl px-2"
                onClick={onClick}
            >
                <div>
                    <p className="text-sm text-muted-foreground">
                        {bundle.validityPeriod}
                    </p>
                    <p className={"font-bold"}>{bundle.dataPackage.data}GB</p>
                </div>
                <div className="font-medium justify-self-end">
                    GHC {numToMoney(bundle.price)}
                </div>
            </div>

            <div
                className={`space-y-4 translate-y-4 transition-all duration-500 overflow-hidden ${active ? "h-32" : "h-0"}`}>
                <Label>Phone Number</Label>
                <Input placeholder={`e.g. 02XXXXXXXX`} value={phoneNumber} onChange={(e) => {
                    onValueChange(e.target.value);
                    setPhoneNumber(e.target.value);
                }}/>
                <Button
                    onClick={handleOnClick}
                    className="w-full"
                >
                    Purchase
                </Button>
            </div>
        </div>
    );
};

interface PurchaseOverViewProps extends React.HTMLAttributes<HTMLDivElement> {
    record: TxDataBundleRequest;
    bundle: DataBundle;
}

const PurchaseOverView: React.FC<PurchaseOverViewProps> = ({record, bundle}) => {
    return (
        <div className={"space-y-4"}>
            <h2 className="text-lg font-semibold">Review Your Order</h2>
            <div className="space-y-2">
                {/*<div className="flex justify-between">*/}
                {/*    <span>Transaction ID</span>*/}
                {/*    <span>{record.id}</span>*/}
                {/*</div>*/}
                {/*<div className="flex justify-between">*/}
                {/*    <span>Date</span>*/}
                {/*    <span>{record.date.toDate().toLocaleDateString()}</span>*/}
                {/*</div>*/}
                <div className="flex justify-between">
                    <span>Provider</span>
                    <span>{getProviderById(record.networkId)?.name}</span>
                </div>
                <div className="flex justify-between">
                    <span>Data</span>
                    <span>{bundle?.dataPackage.data}GB</span>
                </div>
                <div className="flex justify-between">
                    <span>Validity</span>
                    <span>{bundle?.validityPeriod}</span>
                </div>
                <div className="flex justify-between font-medium">
                    <span>Phone</span>
                    <span>{record.phoneNumber}</span>
                </div>
            </div>
            <div className="text-lg flex justify-between bg-secondary p-2">
                <span>Price</span>
                <span className={"font-semibold"}>GHS {numToMoney(bundle ? bundle?.price : 0)}</span>
            </div>
        </div>
    )
}


export default BuyBundleForm;
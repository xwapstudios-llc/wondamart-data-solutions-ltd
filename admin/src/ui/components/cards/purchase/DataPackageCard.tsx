import React, {useEffect, useState} from "react";
import type {DataBundle} from "@common/types/data-bundle.ts";
import {cn} from "@/cn/lib/utils.ts";
import WondaButton from "@/ui/components/buttons/WondaButton.tsx";
import IconText from "@/ui/components/typography/IconText.tsx";
import {ArrowUpDownIcon, Loader2Icon, MailsIcon, PhoneCallIcon} from "lucide-react";
import {Input} from "@/cn/components/ui/input.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import {ClTxDataBundle} from "@common/client-api/tx-data-bundle.ts";
import {useAppStore} from "@/lib/useAppStore.ts";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/cn/components/ui/form.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import { R } from "@/app/routes";
import {useNavigate} from "react-router-dom";

const formSchema = z
    .object({
        phone: z.string().regex(/^(0|\+233|233)[25][0-9]{8}$/, "Invalid phone number format"),
    })
type FormValues = z.infer<typeof formSchema>;

interface DataPackageCardProps extends React.HTMLAttributes<HTMLDivElement> {
    dataPackage: DataBundle,
    activeID: string;
    onActivate: () => void;
}

const DataPackageCard: React.FC<DataPackageCardProps> = ({dataPackage, className, activeID, onActivate, ...props}) => {
    const {profile, wallet} = useAppStore();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: "",
        },
    });

    useEffect(() => {
        const run = () => {
            if (activeID === dataPackage.id) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
                form.reset();
            }
        }
        run();
    }, [activeID, dataPackage, dataPackage.id, form]);

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // Prevent form clicks from collapsing the card
        if ((e.target as HTMLElement).closest("form")) return;
        if (dataPackage.enabled) onActivate();
    };

    const networkClassName = {
        mtn: "border-mtn bg-mtn/75 dark:bg-mtn/80",
        telecel: "border-telecel bg-telecel/75 dark:bg-telecel/80",
        airteltigo: "border-airteltigo bg-airteltigo/75 dark:bg-airteltigo/80",
        disabled: "bg-muted text-muted-foreground"
    };

    const submitPurchaseRequest = async (values: FormValues) => {
        setLoading(true);
        if (!wallet || !profile) {
            toast.error("Profile or wallet not found");
            setLoading(false);
            return;
        }
        if (wallet?.balance < dataPackage.price) {
            form.setError("root", {message: "Insufficient Funds"});
            toast.error("Insufficient Funds", {
                description: "Please top up your wallet to proceed with the purchase.",
                action: {
                    label: "Top Up",
                    onClick: () => {
                        navigate(R.app.deposit)
                    }
                }
            });
            setLoading(false);
            return;
        }
        if (profile && dataPackage.enabled) {
            await ClTxDataBundle.create({
                uid: profile.id,
                networkId: dataPackage.network,
                bundleId: dataPackage.id,
                phoneNumber: values.phone,
            })
                .then(() => {
                    form.reset();
                })
                .catch((err) => {
                    toast.error("Purchase Failed", {
                        description: err.message,
                    })
                    form.setError("root", {message: "Failed"})
                })
        }
        if (!dataPackage.enabled) form.setError("root", {message: "Bundle Disabled"})
        setLoading(false);
    }

    return (
        <div className={cn(className, "min-w-64 h-fit drop-shadow-md")} {...props}>
            <div className={"mx-auto w-fit h-fit z-10"}>
                <WondaButton
                    imgSrc={"/network/" + dataPackage.network + ".png"}
                    size={80}
                    className={cn("drop-shadow-lg", dataPackage.enabled ? "" : "grayscale-100 brightness-200")}
                    onClick={handleCardClick}
                />
            </div>
            <div
                className={cn(
                    `w-full rounded-lg p-2 border transition-[margin-top] duration-300`,
                    dataPackage.enabled ? networkClassName[dataPackage.network] : networkClassName["disabled"],
                    isOpen ? "-mt-20" : "-mt-14"
                )}
                onClick={handleCardClick}
            >
                <div className={"grid grid-cols-2 gap-x-12 gap-y-0.5 px-2"}>
                    <div className={"font-semibold"}>
                        {dataPackage.name}
                    </div>
                    <span className={"text-2xl place-self-end"}>₵ {dataPackage.price.toFixed(2)}</span>
                    <div className={"text-sm"}>
                        {
                            dataPackage.validityPeriod == 0 ? "Non Expiry"
                                : dataPackage.validityPeriod == 1 ? "1 day"
                                    : `${dataPackage.validityPeriod} days`
                        }
                    </div>
                    <span className={"text-sm opacity-75 place-self-end"}>
                        ₵ {dataPackage.commission.toFixed(2)}
                    </span>
                </div>
                <div className={"packages-grid mt-4"}>
                    <IconText
                        className={"bg-background"}
                        variant={dataPackage.network}
                        Icon={ArrowUpDownIcon}
                    >
                        {(dataPackage.dataPackage.data)} GB
                    </IconText>
                    {
                        dataPackage.dataPackage.minutes && <IconText
                            className={"bg-background"}
                            variant={dataPackage.network}
                            Icon={PhoneCallIcon}
                        >
                            {(dataPackage.dataPackage.minutes)} min
                        </IconText>
                    }
                    {
                        dataPackage.dataPackage.sms && <IconText
                            className={"bg-background"}
                            variant={dataPackage.network}
                            Icon={MailsIcon}
                        >
                            {(dataPackage.dataPackage.sms)} units
                        </IconText>
                    }
                </div>
                <div
                    className={cn(
                        "transition-[opacity,max-height,margin-top] duration-300 overflow-hidden",
                        isOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
                    )}
                >
                    <Form {...form}>
                        <form
                            className="space-y-2"
                            onSubmit={form.handleSubmit(submitPurchaseRequest)}
                        >
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({field}) => (
                                    <FormItem className="p-2 rounded-sm bg-background shadow-md">
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder={"02XXXXXXXX"} {...field} disabled={loading}/>
                                        </FormControl>
                                        <FormDescription>
                                            Phone number to receive the bundle
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {
                                form.formState.errors.root &&
                                <p className="p-1 px-2 bg-red-100 rounded-sm text-destructive shadow">
                                    {form.formState.errors.root.message}
                                </p>
                            }
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2Icon className="animate-spin"/> Loading
                                    </>
                                ) : (
                                    "Buy"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default DataPackageCard;
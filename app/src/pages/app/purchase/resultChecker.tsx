import React, {useState} from "react";
import Page from "@/ui/page/Page";
import {BookImageIcon, CheckCircleIcon, CheckIcon, FileIcon, type LucideIcon, Loader2Icon, ShieldIcon} from "lucide-react";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";
import {useAppStore} from "@/lib/useAppStore";
import {cn} from "@/cn/lib/utils.ts";
import {toCurrency} from "@/lib/icons.ts";
import {Button} from "@/cn/components/ui/button.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/cn/components/ui/dialog.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/cn/components/ui/form.tsx";
import {Input} from "@/cn/components/ui/input.tsx";
import {ClTxResultChecker} from "@common/client-api/tx-result-checker";
import type {ResultCheckerType} from "@common/types/result-checker";
import type {HTTPResponse} from "@common/types/request.ts";
import PageHeader from "@/ui/page/PageHeader.tsx";

// Note: Ernest sait they will upload the result checkers himself.
const ResultCheckerPurchase: React.FC = () => {
    const {commonSettings} = useAppStore();
    const settings = commonSettings.resultChecker;
    const [activeForm, setActiveForm] = useState<ResultCheckerType | null>(null);

    return (
        <Page>
            <PageHeader title={"Result Checker"} subtitle={"The official WAEC & BECE result checking cards."} />

            <PageContent>
                {settings && settings.enabled ? (
                    <>
                        <Dialog open={!!activeForm} onOpenChange={(open) => !open && setActiveForm(null)}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{activeForm} Result Checker</DialogTitle>
                                </DialogHeader>
                                {activeForm && (
                                    <CheckerForm
                                        type={activeForm}
                                        price={settings.unitPrice}
                                        onBack={() => setActiveForm(null)}
                                    />
                                )}
                            </DialogContent>
                        </Dialog>
                        <div className={"mt-4 grid md:grid-cols-[repeat(auto-fill,minmax(32rem,1fr))] gap-4"}>
                            <CheckerCard
                                Icon={BookImageIcon}
                                title={"WASSCE"}
                                subTitle={"Results Checker"}
                                price={settings.unitPrice}
                                gradient={"from-blue-600 to-blue-500"}
                                onBuy={() => setActiveForm("WASSCE")}
                            >
                                <p className={"opacity-75"}>
                                    West African Examinations Council (WAEC) Result Checker - Check your WASSCE results online
                                </p>
                            </CheckerCard>
                            <CheckerCard
                                Icon={BookImageIcon}
                                title={"BECE"}
                                subTitle={"Results Checker"}
                                price={settings.unitPrice}
                                gradient={"from-yellow-600 to-yellow-500"}
                                onBuy={() => setActiveForm("BECE")}
                            >
                                <p className={"opacity-75"}>
                                    Basic Education Certificate Examination (BECE) Result Checker - Access your BECE results
                                    online instantly
                                </p>
                            </CheckerCard>
                        </div>
                    </>
                ) : (
                    <DisabledNotice className="mt-4" title="Result Checker Purchase Unavailable">
                        Result Checker purchases are currently unavailable. Please come
                        back later or contact administrator.
                    </DisabledNotice>
                )}
            </PageContent>
        </Page>
    );
};

interface CheckerCardItemProps extends React.HTMLAttributes<HTMLDivElement> {
    Icon: LucideIcon,
    iconClassName?: string,
}

const CheckerCardItem: React.FC<CheckerCardItemProps> = ({Icon, iconClassName, className, children, ...props}) => {
    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg bg-secondary/45 font-medium transition-colors hover:bg-secondary/30",
            className
        )}
             {...props}
        >
            <div className={cn(
                "flex items-center justify-center size-5 shrink-0",
                "text-primary",
                iconClassName
            )}>
                <Icon/>
            </div>
            <span className="text-xs md:text-sm text-foreground/90">{children}</span>
        </div>
    )
}

interface CheckerCardProps extends React.HTMLAttributes<HTMLDivElement> {
    Icon: LucideIcon,
    title: string,
    subTitle?: string,
    gradient?: string,
    onBuy?: () => void,
    price: number,
}

const CheckerCard: React.FC<CheckerCardProps> = ({
                                                     Icon,
                                                     title,
                                                     subTitle,
                                                     className,
                                                     children,
                                                     gradient = "from-teal-500 to-primary",
                                                     onBuy,
                                                     price,
                                                     ...props
                                                 }) => {
    return (
        <div className={cn("max-w-2xl overflow-hidden rounded-xl shadow-lg", className)} {...props}>
            {/*Top*/}
            <div className={cn("p-4 bg-linear-60", gradient)}>
                <div className={"flex items-center gap-4"}>
                    <div
                        className={"flex items-center justify-center p-3 rounded-lg size-14 bg-white/20 backdrop-blur-sm"}>
                        <Icon className="size-7"/>
                    </div>
                    <div>
                        <p className={"text-3xl font-bold text-white"}>{title}</p>
                        {subTitle && <p className="text-sm text-white/80 font-medium mt-1">{subTitle}</p>}
                    </div>
                </div>
            </div>
            {/*Bottom*/}
            <div className={"p-4 bg-card border border-border"}>
                {children && <p className="text-foreground/80 text-sm leading-relaxed">{children}</p>}
                <div className={"grid grid-cols-2 gap-3"}>
                    <CheckerCardItem Icon={CheckCircleIcon}>Instant delivery</CheckerCardItem>
                    <CheckerCardItem Icon={ShieldIcon}>Secure & verified</CheckerCardItem>
                    <CheckerCardItem Icon={CheckIcon}>Valid five attempts</CheckerCardItem>
                    <CheckerCardItem Icon={FileIcon}>One-time use</CheckerCardItem>
                </div>
                <div className={"border-t border-border pt-4 flex items-center gap-4 justify-between"}>
                    <div>
                        <p className={"text-xs font-medium text-foreground/60 uppercase tracking-wider"}>Price</p>
                        <p className={"text-3xl font-bold text-primary mt-2"}>{toCurrency(price)}</p>
                    </div>
                    <Button size={"lg"} onClick={onBuy} className="font-semibold px-12">Buy</Button>
                </div>
            </div>
        </div>
    )
}

const checkerSchema = z.object({
    units: z.coerce.number().min(1, "Must be at least 1"),
    sendToOwn: z.boolean(),
    phoneNumber: z.string().optional(),
}).refine((val) => val.sendToOwn || (val.phoneNumber && /^(0|\+233|233)[25][0-9]{8}$/.test(val.phoneNumber)), {
    message: "Enter a valid phone number",
    path: ["phoneNumber"],
});

type CheckerFormValues = z.infer<typeof checkerSchema>;

interface CheckerFormProps {
    type: ResultCheckerType;
    price: number;
    onBack: () => void;
}

const CheckerForm: React.FC<CheckerFormProps> = ({type, price, onBack}) => {
    const {profile, setError, setHTTPResponse} = useAppStore();
    const [loading, setLoading] = useState(false);

    const form = useForm<CheckerFormValues>({
        resolver: zodResolver(checkerSchema) as never,
        defaultValues: {
            units: 1,
            sendToOwn: true,
            phoneNumber: profile?.phoneNumber ?? "",
        },
    });

    const sendToOwn = form.watch("sendToOwn");
    const units = form.watch("units");

    const onSubmit = async (values: CheckerFormValues) => {
        if (!profile) return;
        setLoading(true);
        try {
            const response = await ClTxResultChecker.create({
                uid: profile.id,
                checkerType: type,
                units: values.units,
            });
            form.reset();
            setHTTPResponse(response);
            onBack();
        } catch (err) {
            if (typeof err === "string") {
                setError(err);
            } else if (typeof err === "object") {
                setHTTPResponse(err as HTTPResponse);
            } else {
                setError({title: "Error", description: JSON.stringify(err)});
            }
        }
        setLoading(false);
    };

    return (
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>

                    {/*Units*/}
                    <FormField
                        control={form.control}
                        name={"units"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Number of Units</FormLabel>
                                <FormControl>
                                    <Input type={"number"} min={1} placeholder={"1"} {...field} />
                                </FormControl>
                                <FormDescription>How many result checkers to purchase</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/*SMS Destination*/}
                    <FormField
                        control={form.control}
                        name={"sendToOwn"}
                        render={() => (
                            <FormItem>
                                <FormLabel>Send SMS to</FormLabel>
                                <FormControl>
                                    <div className={"grid grid-cols-2 items-center"}>
                                        <span
                                            className={cn(
                                                "p-2 font-semibold text-sm text-center rounded-l-md cursor-pointer border-r",
                                                sendToOwn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                                            )}
                                            onClick={() => {
                                                form.setValue("sendToOwn", true);
                                                form.setValue("phoneNumber", profile?.phoneNumber ?? "");
                                            }}
                                        >
                                            My Number
                                        </span>
                                        <span
                                            className={cn(
                                                "p-2 font-semibold text-sm text-center rounded-r-md cursor-pointer border-l",
                                                !sendToOwn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                                            )}
                                            onClick={() => {
                                                form.setValue("sendToOwn", false);
                                                form.setValue("phoneNumber", "");
                                            }}
                                        >
                                            Other Number
                                        </span>
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/*Phone Number — only shown when sendToOwn is false*/}
                    {!sendToOwn && (
                        <FormField
                            control={form.control}
                            name={"phoneNumber"}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"02XXXXXXXX"} {...field} />
                                    </FormControl>
                                    <FormDescription>The number to receive the SMS checker</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    )}

                    {/*Total*/}
                    <div className={"rounded-lg bg-secondary/40 p-4 flex items-center justify-between"}>
                        <p className={"text-sm text-muted-foreground"}>Total</p>
                        <p className={"text-xl font-bold text-primary"}>{toCurrency((units || 0) * price)}</p>
                    </div>

                    <Button type={"submit"} className={"w-full"} disabled={loading}>
                        {loading ? <><Loader2Icon className={"animate-spin"}/> Processing...</> : "Purchase"}
                    </Button>
                </form>
            </Form>
    );
}

export default ResultCheckerPurchase;

import React from "react";
import Page from "@/ui/page/Page";
import PageHeading from "@/ui/page/PageHeading";
import {BookImageIcon, CheckCircleIcon, CheckIcon, FileIcon, type LucideIcon, ShieldIcon} from "lucide-react";
import DisabledNotice from "@/ui/components/cards/DisabledNotice";
import {useAppStore} from "@/lib/useAppStore";
import {cn} from "@/cn/lib/utils.ts";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import {toCurrency} from "@/lib/icons.ts";
import {Button} from "@/cn/components/ui/button.tsx";

// Note: Ernest sait they will upload the result checkers himself.
const ResultCheckerPurchase: React.FC = () => {
    const {commonSettings} = useAppStore();
    const settings = commonSettings.resultChecker;

    return (
        <Page>
            <PageHeading className={"mt-4"}>Result Checker</PageHeading>
            <PageSubHeading>The official WAEC & BECE result checking cards</PageSubHeading>

            {settings && settings.enabled ? (
                <div className={"mt-4 grid md:grid-cols-[repeat(auto-fill,minmax(32rem,1fr))] gap-4"}>
                    {/*<BuyResultsCheckerForm/>*/}

                    <CheckerCard
                        Icon={BookImageIcon}
                        title={"WASSCE"}
                        subTitle={"Results Checker"}
                        price={commonSettings.resultChecker.unitPrice}
                    >
                        <p className={"opacity-75"}>
                            West African Examinations Council (WAEC) Result Checker - Check your WASSCE results online
                        </p>
                    </CheckerCard>
                    <CheckerCard
                        Icon={BookImageIcon}
                        title={"BECE"}
                        subTitle={"Results Checker"}
                        price={commonSettings.resultChecker.unitPrice}
                        gradient={"from-orange-600 to-violet-500"}
                    >
                        <p className={"opacity-75"}>
                            Basic Education Certificate Examination (BECE) Result Checker - Access your BECE results
                            online instantly
                        </p>
                    </CheckerCard>
                </div>
            ) : (
                <DisabledNotice className="mt-4" title="Result Checker Purchase Unavailable">
                    Result Checker purchases are currently unavailable. Please come
                    back later or contact administrator.
                </DisabledNotice>
            )}
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
            <div className={cn("p-6 bg-linear-60", gradient)}>
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
            <div className={"space-y-4 p-6 bg-card border border-border"}>
                {children && <p className="text-foreground/80 text-sm leading-relaxed">{children}</p>}
                <div className={"grid grid-cols-2 gap-3"}>
                    <CheckerCardItem Icon={CheckCircleIcon}>Instant delivery</CheckerCardItem>
                    <CheckerCardItem Icon={ShieldIcon}>Secure & verified</CheckerCardItem>
                    <CheckerCardItem Icon={CheckIcon}>Valid for exams</CheckerCardItem>
                    <CheckerCardItem Icon={FileIcon}>One-time use</CheckerCardItem>
                </div>
                <div className={"border-t border-border pt-4 flex items-center gap-4 justify-between"}>
                    <div>
                        <p className={"text-xs font-medium text-foreground/60 uppercase tracking-wider"}>Price</p>
                        <p className={"text-3xl font-bold text-primary mt-2"}>{toCurrency(price)}</p>
                    </div>
                    <Button size={"lg"} onClick={onBuy} className="font-semibold">Buy</Button>
                </div>
            </div>
        </div>
    )
}

export default ResultCheckerPurchase;

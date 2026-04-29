import React from 'react';
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {useNavigate} from "react-router-dom";
import {R} from "@/app/routes.ts";
import {
    ArrowRightIcon,
    BookOpenTextIcon,
    CompassIcon,
    PackageIcon,
} from "lucide-react";
import {useAppStore} from "@/lib/useAppStore.ts";
import {cn} from "@/cn/lib/utils.ts";
import {toCurrency} from "@/lib/icons.ts";

// ─── Stock badge ──────────────────────────────────────────────────────────────

const StockBadge: React.FC<{inStock: boolean; label: string}> = ({inStock, label}) => (
    <span className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        inStock
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            : "bg-red-500/15 text-red-600 dark:text-red-400"
    )}>
        <span className={cn("size-1.5 rounded-full", inStock ? "bg-emerald-500" : "bg-red-500")} />
        {label}
    </span>
);

// ─── Product card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    gradient: string;
    iconBg: string;
    badges: React.ReactNode;
    meta?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    title, description, icon, gradient, iconBg, badges, meta, onClick, disabled,
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "w-full text-left rounded-2xl overflow-hidden border transition-all",
            "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
            "disabled:opacity-50 disabled:pointer-events-none"
        )}
    >
        {/* Colored header strip */}
        <div className={cn("relative p-5 flex items-center gap-4", gradient)}>
            <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl text-white", iconBg)}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-white leading-tight">{title}</p>
                <p className="text-xs text-white/75 mt-0.5 line-clamp-2">{description}</p>
            </div>
            <ArrowRightIcon className="size-5 text-white/60 shrink-0" />
        </div>

        {/* Footer strip */}
        <div className="bg-card px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-wrap gap-1.5">{badges}</div>
            {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
        </div>
    </button>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const PurchaseIndexV2: React.FC = () => {
    const {commonSettings, claims} = useAppStore();
    const navigate = useNavigate();

    if (!claims || !commonSettings) return null;

    const db  = commonSettings.dataBundles;
    const rc  = commonSettings.resultChecker;
    const afa = commonSettings.afa;

    return (
        <Page className="pb-8">
            <PageContent className="max-w-xl mx-auto space-y-4 pt-4">

                {/* Page header */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex size-9 items-center justify-center rounded-md bg-wondamart text-white">
                        <PackageIcon className="size-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Purchases</h1>
                        <p className="text-xs text-muted-foreground">Choose a product to get started</p>
                    </div>
                </div>


                <div className="space-y-8 mt-8">

                    {/* Data Bundles */}
                    <ProductCard
                        title="Data Bundles"
                        description="Top-tier data bundles for all networks at the best prices."
                        icon={<PackageIcon className="size-6" />}
                        gradient="bg-gradient-to-r from-sky-500 to-blue-600"
                        iconBg="bg-white/20"
                        onClick={() => navigate(R.app.purchase.dataBundle.index)}
                        disabled={!db.enabled}
                        badges={<>
                            <StockBadge inStock={db.enabled && db.mtn.enabled}       label="MTN" />
                            <StockBadge inStock={db.enabled && db.telecel.enabled}   label="Telecel" />
                            <StockBadge inStock={db.enabled && db.airteltigo.enabled} label="AirtelTigo" />
                        </>}
                        // meta={<span className="capitalize text-xs px-2 py-0.5 rounded-full bg-muted font-medium">via {db.provider}</span>}
                    />

                    {/* Result Checkers */}
                    <ProductCard
                        title="Result Checkers"
                        description="Instant WASSCE & BECE result checkers at your fingertips."
                        icon={<BookOpenTextIcon className="size-6" />}
                        gradient="bg-gradient-to-r from-violet-500 to-purple-600"
                        iconBg="bg-white/20"
                        onClick={() => navigate(R.app.purchase.resultChecker)}
                        disabled={!rc.enabled}
                        badges={<>
                            <StockBadge inStock={rc.enabled} label="BECE" />
                            <StockBadge inStock={rc.enabled} label="WASSCE" />
                        </>}
                        meta={<>Unit price: <span className="font-semibold text-foreground">{toCurrency(rc.unitPrice)}</span></>}
                    />

                    {/* AFA Bundle */}
                    <ProductCard
                        title="AFA Bundle"
                        description="Get subscribed to AFA at the most competitive price."
                        icon={<CompassIcon className="size-6" />}
                        gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
                        iconBg="bg-white/20"
                        onClick={() => navigate(R.app.purchase.afaBundle)}
                        disabled={!afa.enabled}
                        badges={<>
                            <StockBadge inStock={afa.enabled} label="AFA" />
                        </>}
                        meta={<>Unit price: <span className="font-semibold text-foreground">{toCurrency(afa.unitPrice)}</span></>}
                    />

                </div>
            </PageContent>
        </Page>
    );
};

export default PurchaseIndexV2;

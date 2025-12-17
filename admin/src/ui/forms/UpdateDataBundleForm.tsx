// TypeScript
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/cn/components/ui/label.tsx";
import { Input } from "@/cn/components/ui/input.tsx";
import { Checkbox } from "@/cn/components/ui/checkbox.tsx";
import { Button } from "@/cn/components/ui/button.tsx";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/cn/components/ui/form.tsx";
import { AdminDataBundles } from "@common/admin-api/db-data-bundle.ts";
import {
    ArrowUpDownIcon,
    DeleteIcon,
    Loader2Icon,
    MailIcon,
    PhoneCallIcon,
} from "lucide-react";
import type { DataBundle } from "@common/types/data-bundle.ts";

const adminUpdateDataBundleSchema = z.object({
    name: z.string().optional(),
    price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    enabled: z.boolean(),
    commission: z.coerce.number().min(0, "Commission cannot be negative"),
});

interface UpdateDataBundleFormProps {
    onDoneCallback?: () => void;
    bundle: DataBundle;
}

const UpdateDataBundleForm: React.FC<UpdateDataBundleFormProps> = ({
    onDoneCallback,
    bundle,
}) => {
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const form = useForm<z.infer<typeof adminUpdateDataBundleSchema>>({
        resolver: zodResolver(adminUpdateDataBundleSchema) as never,
        defaultValues: {
            name: bundle.name,
            price: bundle.price,
            enabled: bundle.enabled,
            commission: bundle.commission,
        },
    });

    const onSubmitUpdate = async (
        values: z.infer<typeof adminUpdateDataBundleSchema>
    ) => {
        setLoading(true);
        console.log("Bundle update submitted:", values);
        try {
            // Check if any field has changed before updating to avoid unnecessary api calls
            if (
                bundle.name !== values.name &&
                (values.name || values.name === "")
            )
                await AdminDataBundles.updateName(bundle.id, values.name);
            if (bundle.enabled != values.enabled)
                await AdminDataBundles.updateEnabled(bundle.id, values.enabled);
            if (bundle.price != values.price)
                await AdminDataBundles.updatePrice(bundle.id, values.price);
            if (bundle.commission != values.commission)
                await AdminDataBundles.updateCommission(
                    bundle.id,
                    values.commission
                );
            setLoading(false);
            if (onDoneCallback) onDoneCallback();
        } catch (error) {
            setLoading(false);
            form.setError("enabled", {
                message: "Failed to update data bundle. Please try again.",
            });
            console.error("Error updating data bundle:", error);
        }
    };

    const onDeleteBundle = async () => {
        setDeleting(true);
        console.log("Bundle delete requested:");
        try {
            await AdminDataBundles.delete(bundle.id);
            setDeleting(false);
            if (onDoneCallback) onDoneCallback();
        } catch (error) {
            setDeleting(false);
            form.setError("enabled", {
                message: "Failed to delete data bundle. Please try again.",
            });
            console.error("Error deleting data bundle:", error);
        }
    };

    // helper to map empty string -> undefined and otherwise Number(...)
    const handleNumberChange =
        (fieldOnChange: (v: unknown) => void) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            let raw = e.target.value;
            if (
                raw.length > 1 &&
                raw.startsWith("0") &&
                !raw.startsWith("0.")
            ) {
                raw = raw.replace(/^0+/, "");
            }
            const num = raw === "" ? 0 : Math.max(0, Number(raw));
            fieldOnChange(num);
        };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitUpdate)}
                className="space-y-4"
            >
                {/* Network */}
                <div className={"flex gap-2"}>
                    <Label>Network</Label>
                    <Button variant={"outline"} disabled>
                        {bundle.network}
                    </Button>
                </div>

                {/* Name */}
                <FormField
                    control={form.control}
                    name={"name"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name (optional)</FormLabel>
                            <FormDescription>
                                This is the bundle display name.
                            </FormDescription>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Bossu Daily"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Price */}
                <FormField
                    control={form.control}
                    name={"price"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price (GHC)</FormLabel>
                            <FormDescription>
                                How much is the bundle.
                            </FormDescription>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={field.value ?? ""}
                                    onChange={handleNumberChange(
                                        field.onChange
                                    )}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Commission */}
                <FormField
                    control={form.control}
                    name={"commission"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Commission (GHC)</FormLabel>
                            <FormDescription>
                                How much will you pay your vendors.
                            </FormDescription>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={field.value ?? ""}
                                    onChange={handleNumberChange(
                                        field.onChange
                                    )}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Data Package */}
                <div className={"space-y-2"}>
                    <Label>Package</Label>

                    <div className={"text-sm grid grid-cols-3 gap-2"}>
                        <div
                            className={
                                "flex gap-1 items-center p-1 rounded-md border shadow-sm"
                            }
                        >
                            <ArrowUpDownIcon
                                className={
                                    "p-1 rounded-sm bg-primary/10 text-primary/50"
                                }
                            />
                            <span>{bundle.dataPackage.data} GB</span>
                        </div>
                        {bundle.dataPackage.minutes && (
                            <div
                                className={
                                    "flex gap-1 items-center p-1 rounded-md border shadow-sm"
                                }
                            >
                                <PhoneCallIcon
                                    className={
                                        "p-1 rounded-sm bg-primary/10 text-primary/50"
                                    }
                                />
                                <span>{bundle.dataPackage.minutes} min</span>
                            </div>
                        )}
                        {bundle.dataPackage.sms && (
                            <div
                                className={
                                    "flex gap-1 items-center p-1 rounded-md border shadow-sm"
                                }
                            >
                                <MailIcon
                                    className={
                                        "p-1 rounded-sm bg-primary/10 text-primary/50"
                                    }
                                />
                                <span>{bundle.dataPackage.sms}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Validity Period */}
                <div className={"flex gap-2"}>
                    <Label>Validity Period</Label>
                    <Button variant={"outline"} disabled>
                        {bundle.validityPeriod == 0
                            ? "Non - Expiry"
                            : bundle.validityPeriod == 1
                            ? `${bundle.validityPeriod} Day`
                            : `${bundle.validityPeriod} Days`}
                    </Button>
                </div>

                {/* Disabled */}
                <FormField
                    control={form.control}
                    name={"enabled"}
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Checkbox
                                        checked={!!field.value}
                                        onCheckedChange={(v) =>
                                            field.onChange(Boolean(v))
                                        }
                                    />
                                </FormControl>
                                <FormLabel>Enabled</FormLabel>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <Button
                        variant={"outline"}
                        type={"button"}
                        onClick={onDeleteBundle}
                        className={"text-destructive"}
                    >
                        {deleting ? (
                            <>
                                {" "}
                                <Loader2Icon className={"animate-spin"} />{" "}
                                Deleting Bundle...
                            </>
                        ) : (
                            <>
                                {" "}
                                <DeleteIcon />
                                Delete
                            </>
                        )}
                    </Button>
                </div>
                <Button className={"w-full"} type={"submit"} disabled={loading}>
                    {loading ? (
                        <span className={"flex gap-1"}>
                            {" "}
                            <Loader2Icon className={"animate-spin"} /> Updating
                            Bundle...
                        </span>
                    ) : (
                        "Update"
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default UpdateDataBundleForm;

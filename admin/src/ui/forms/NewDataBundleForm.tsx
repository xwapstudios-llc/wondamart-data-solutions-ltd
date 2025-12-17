// TypeScript
import React, {useState} from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/cn/components/ui/label.tsx";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/cn/components/ui/select.tsx";
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
import {AdminDataBundles} from "@common/admin-api/db-data-bundle.ts";
import {ArrowUpDownIcon, Loader2Icon, MailIcon, PhoneCallIcon} from "lucide-react";

const dataPackageSchema = z.object({
    // use z.coerce.number to coerce string inputs into numbers (keeps typings consistent)
    data: z.coerce.number().min(0.01, "Data amount must be greater than 0"),
    minutes: z.coerce.number().optional(),
    sms: z.coerce.number().optional(),
});

const adminNewDataBundleSchema = z.object({
    network: z.enum(["mtn", "telecel", "airteltigo"], "Network is required"),
    name: z.string().min(1, "Name is required").optional(),
    price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    dataPackage: dataPackageSchema,
    validityPeriod: z.coerce.number().min(0, "Validity period cannot be negative"),
    enabled: z.boolean(),
    commission: z.coerce.number().min(0, "Commission cannot be negative"),
});

interface NewDataBundleFormProps {
    onDoneCallback?: () => void;
}

const NewDataBundleForm: React.FC<NewDataBundleFormProps> = ({onDoneCallback}) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof adminNewDataBundleSchema>>({
        resolver: zodResolver(adminNewDataBundleSchema) as never,
        defaultValues: {
            network: "mtn",
            price: 0,
            dataPackage: { data: 1 },
            validityPeriod: 0,
            enabled: true,
            commission: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof adminNewDataBundleSchema>) => {
        setLoading(true);
        console.log("Bundle submitted:", values);
        try {
            await AdminDataBundles.create(values);
            setLoading(false);
            if (onDoneCallback) onDoneCallback();
        } catch (error) {
            setLoading(false);
            form.setError("enabled", { message: "Failed to create data bundle. Please try again." });
            console.error("Error creating data bundle:", error);
        }
    };

    // helper to map empty string -> undefined and otherwise Number(...)
    const handleNumberChange = (fieldOnChange: (v: unknown) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value;
        /// Remove leading zeors
        if (raw.length > 1 && raw.startsWith("0") && !raw.startsWith("0.")) {
            raw = raw.replace(/^0+/, '');
        }
        // replace 0 with the input value
        const num = raw === "" ? 0 : Math.max(0, Number(raw));
        fieldOnChange(num);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Network */}
                <FormField
                    control={form.control}
                    name="network"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Network</FormLabel>
                            <FormDescription>This is the network of the data bundle.</FormDescription>
                            <FormControl>
                                {/* Use value + onValueChange instead of spreading the field */}
                                <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={"Network"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mtn">MTN</SelectItem>
                                        <SelectItem value="telecel">Telecel</SelectItem>
                                        <SelectItem value="airteltigo">AirtelTigo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name (optional)</FormLabel>
                            <FormDescription>This is the bundle display name.</FormDescription>
                            <FormControl>
                                <Input type="text" placeholder="Bossu Daily" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Price */}
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price (GHC)</FormLabel>
                            <FormDescription>How much is the bundle.</FormDescription>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={field.value ?? ""}
                                    onChange={handleNumberChange(field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Commission */}
                <FormField
                    control={form.control}
                    name="commission"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Commission (GHC)</FormLabel>
                            <FormDescription>How much will you pay your vendors.</FormDescription>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={field.value ?? ""}
                                    onChange={handleNumberChange(field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Data Package */}
                <div className={"space-y-2"}>
                    <Label>Package</Label>

                    <div className={"grid grid-cols-3 gap-2"}>
                        <FormField
                            control={form.control}
                            name="dataPackage.data"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data (GB)</FormLabel>
                                    <div className={"relative"}>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={field.value ?? ""}
                                                onChange={handleNumberChange(field.onChange)}
                                                className={"pl-9"}
                                            />
                                        </FormControl>
                                        <ArrowUpDownIcon className={"absolute top-1.5 left-1.5 p-1 rounded-sm bg-primary/25 text-primary"}/>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dataPackage.minutes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Minutes</FormLabel>
                                    <div className={"relative"}>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={field.value ?? ""}
                                                onChange={handleNumberChange(field.onChange)}
                                                className={"pl-9"}
                                            />
                                        </FormControl>
                                        <PhoneCallIcon className={"absolute top-1.5 left-1.5 p-1 rounded-sm bg-primary/25 text-primary"}/>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dataPackage.sms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SMS</FormLabel>
                                    <div className={"relative"}>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={field.value ?? ""}
                                                onChange={handleNumberChange(field.onChange)}
                                                className={"pl-9"}
                                            />
                                        </FormControl>
                                        <MailIcon className={"absolute top-1.5 left-1.5 p-1 rounded-sm bg-primary/25 text-primary"}/>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Validity Period */}
                <FormField
                    control={form.control}
                    name="validityPeriod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Validity Period</FormLabel>
                            <FormDescription>When will the bundle expire.</FormDescription>
                            <FormControl>
                                <Input type={"number"} placeholder="0" {...field} />
                            </FormControl>
                            <FormDescription>Input 0 for non-expiry bundles.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Disabled */}
                <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                                </FormControl>
                                <FormLabel>Enabled</FormLabel>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className={"w-full"} type={"submit"} disabled={loading}>
                    {
                        loading ? <span className={"flex gap-1"}> <Loader2Icon className={"animate-spin"} /> Creating Bundle...</span> : "Create Data Bundle"
                    }
                </Button>
            </form>
        </Form>
    );
};

export default NewDataBundleForm;

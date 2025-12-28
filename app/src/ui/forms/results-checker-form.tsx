import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/cn/components/ui/button";
import {Input} from "@/cn/components/ui/input";
import {Label} from "@/cn/components/ui/label";
import {ClTxResultChecker} from "@common/client-api/tx-result-checker";
import {useAppStore} from "@/lib/useAppStore";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/cn/components/ui/form.tsx";
import {Loader2Icon} from "lucide-react";
import type {HTTPResponse} from "@common/types/request.ts";

const resultsSchema = z.object({
    type: z.enum(["BECE", "WASSCE"], "Please select result type"),
    units: z.coerce.number().min(1, "Enter number of units")
        .refine((val) => Number(val) > 0, {message: "Must be greater than 0"}),
});

type ResultsValues = z.infer<typeof resultsSchema>;

const ResultsCheckerForm: React.FC = () => {
    const {profile, setError, setHTTPResponse, commonSettings} = useAppStore();
    const resultCheckerDoc = commonSettings.resultChecker;
    const [loading, setLoading] = useState(false);

    const form = useForm<ResultsValues>({
        resolver: zodResolver(resultsSchema) as never,
        defaultValues: {
            type: undefined,
            units: 1,
        },
    });

    const onSubmit = async (values: ResultsValues) => {
        if (profile) {
            setLoading(true);
            try {
                const response = await ClTxResultChecker.create({
                    checkerType: values.type,
                    uid: profile.id,
                    units: values.units,
                })
                form.reset();
                setHTTPResponse(response);
            } catch (err) {
                if (typeof err === "string") {
                    setError(err);
                } else if (typeof err === "object") {
                    setHTTPResponse(err as HTTPResponse);
                } else {
                    setError({
                        title: "Error",
                        description: JSON.stringify(err)
                    });
                }
            }
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Type Selection */}
                <FormField
                    control={form.control}
                    name="type"
                    render={() => (
                        <FormItem>
                            <FormLabel>Checker Type</FormLabel>
                            <FormControl>
                                <div className={"grid grid-cols-2 items-center"}>
                                    <span
                                        className={`p-2 font-semibold text-sm text-center rounded-l-md cursor-pointer border-r ${form.watch("type") === "BECE" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                                        onClick={() => form.setValue("type", "BECE")}
                                    >
                                    BECE
                                </span>
                                    <span
                                        className={`p-2 font-semibold text-sm text-center rounded-r-md cursor-pointer border-l ${form.watch("type") === "WASSCE" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                                        onClick={() => form.setValue("type", "WASSCE")}
                                    >
                                    WASSCE
                                </span>
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Units */}
                <FormField
                    control={form.control}
                    name="units"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Number of Units</FormLabel>
                            <FormControl>
                                <Input placeholder={"1"} type={"number"} min={1} {...field} />
                            </FormControl>
                            <FormDescription>
                                How many result checkers to buy
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Total */}
                <div className="grid gap-2">
                    <Label>Total</Label>
                    <Input value={form.watch("units") * resultCheckerDoc.unitPrice} readOnly disabled/>
                    <p className="text-xs text-muted-foreground">Price per Unit: GHC {resultCheckerDoc.unitPrice}</p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {
                        loading ? <>
                            <Loader2Icon className={"animate-spin"}/> Loading
                        </> : "Purchase"
                    }
                </Button>
            </form>
        </Form>
    );
}

export default ResultsCheckerForm;
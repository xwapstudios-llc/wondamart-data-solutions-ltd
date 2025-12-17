"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/cn/components/ui/button";
import { Input } from "@/cn/components/ui/input";
import { Label } from "@/cn/components/ui/label";
import {ClTxResultChecker} from "@common/client-api/tx-result-checker";
import {useAppStore} from "@/lib/useAppStore";

const FIXED_PRICE = 9999;

// ✅ Schema
const resultsSchema = z.object({
    type: z.enum(["BECE", "WASSCE"], "Please select result type"),
    units: z.coerce.number().min(1, "Enter number of units")
        .refine((val) => Number(val) > 0, { message: "Must be greater than 0" }),
    amount: z.literal(String(FIXED_PRICE)), // Fixed price
});

type ResultsValues = z.infer<typeof resultsSchema>;

const ResultsCheckerForm = () => {
    const {profile} = useAppStore();
    const form = useForm<ResultsValues>({
        resolver: zodResolver(resultsSchema) as never,
        defaultValues: {
            type: undefined,
            units: 1,
            amount: String(FIXED_PRICE),
        },
    });

    const onSubmit = (values: ResultsValues) => {
        const total = Number(values.units) * FIXED_PRICE;
        console.log("Results Checker Request:", values, "Total:", total);
        // Todo: remove alerts
        alert(
            `✅ ${values.type} Results Checker\nUnits: ${values.units}\nPrice per unit: GHC ${values.amount}\nTotal: GHC ${total}`
        );
        if (profile) {
            ClTxResultChecker
                .create({
                    checkerType: values.type,
                    uid: profile.id,
                    units: values.units,
                })
                .then(() => form.reset())
                .catch((err) => {
                    // TODO: Handle Error
                    console.log("Error:", err);
                });
        }
    };

    const selectedType = form.watch("type");
    const units = Number(form.watch("units") || 0);
    const total = units * FIXED_PRICE;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Type Selection */}
            <div className="grid gap-2">
                <Label>Checker Type</Label>
                <div className="grid grid-cols-2 items-center">
                    <span
                        className={`p-2 font-semibold text-sm text-center rounded-l-md cursor-pointer border-r ${selectedType === "BECE" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                        onClick={() => form.setValue("type", "BECE")}
                    >
                        BECE
                    </span>
                    <span
                        className={`p-2 font-semibold text-sm text-center rounded-r-md cursor-pointer border-l ${selectedType === "WASSCE" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                        onClick={() => form.setValue("type", "WASSCE")}
                    >
                        WASSCE
                    </span>
                </div>
                {form.formState.errors.type && (
                    <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
                )}
            </div>

            {/* Units */}
            <div className="grid gap-2">
                <Label htmlFor="units">Number of Units</Label>
                <Input id="units" type="number" min={1} {...form.register("units")} />
                {form.formState.errors.units && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.units.message}
                    </p>
                )}
            </div>

            {/* Total */}
            <div className="grid gap-2">
                <Label>Total</Label>
                <Input value={total || 0} readOnly disabled />
                <p className="text-xs text-muted-foreground">Price per Unit: GHC {FIXED_PRICE}</p>
            </div>

            <Button type="submit" className="w-full">
                Continue
            </Button>
        </form>
    );
}

export default ResultsCheckerForm;
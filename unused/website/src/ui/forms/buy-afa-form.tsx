"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/cn/components/ui/input";
import { Label } from "@/cn/components/ui/label";
import { Button } from "@/cn/components/ui/button";
import {ClTxAFABundle} from "@common/client-api/tx-afa-bundle";
import {useAppStore} from "@/lib/useAppStore";

const FIXED_PRICE = 10;

// ✅ Schema
const afaSchema = z.object({
    fullName: z.string().min(3, "Full name is required"),
    phone: z.string().regex(/^(0|\+233|233)[25][0-9]{8}$/, "Invalid phone number format"),
    idNumber: z.string().regex(/^GHA-\d{9}-\d{1}$/, "Format: GHA-XXXXXXXXX-X"),
    date_of_birth: z.coerce.date().min(1, "Date of birth is required"),
    location: z.string().min(2, "Location is required"),
    occupation: z.string().min(2, "Occupation is required"),
    units: z.coerce.number()
        .min(1, "Enter number of units")
        .refine((val) => Number(val) > 0, { message: "Must be greater than 0" }),
    amount: z.literal(String(FIXED_PRICE)), // ✅ fixed price
});

type AfaValues = z.infer<typeof afaSchema>;

const BuyAfaForm = () => {
    const {profile} = useAppStore();
    const form = useForm<AfaValues>({
        resolver: zodResolver(afaSchema) as never,
        defaultValues: {
            fullName: "",
            phone: "",
            idNumber: "",
            date_of_birth: new Date(),
            location: "",
            occupation: "",
            units: 1,
            amount: String(FIXED_PRICE),
        },
    });

    const onSubmit = (values: AfaValues) => {
        if (profile) {
            ClTxAFABundle.create({
                date_of_birth: values.date_of_birth,
                fullName: values.fullName,
                idNumber: values.idNumber,
                location: values.location,
                occupation: values.occupation,
                phoneNumber: values.phone,
                uid: profile?.id,
                units: values.units,
            })
                .then(() => form.reset())
                .catch((err: Error) => {
                    // Todo: Handle Error
                    console.log("Error", err);
                })
            ;
        }
    };

    const units = Number(form.watch("units") || 0);
    const total = units * FIXED_PRICE;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...form.register("fullName")} />
                {form.formState.errors.fullName && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.fullName.message}
                    </p>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder={"02XXXXXXXX"} {...form.register("phone")} />
                {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.phone.message}
                    </p>
                )}
            </div>

            {/* ID Number*/}
            <div className="grid gap-2">
                <Label htmlFor="idNumber">National ID Number</Label>
                <Input id="idNumber" placeholder="GHA-123456789-0" {...form.register("idNumber")} />
                {form.formState.errors.idNumber && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.idNumber.message}
                    </p>
                )}
            </div>

            {/* Date Of Birth*/}
            <div className="grid gap-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input id="date_of_birth" type="date" {...form.register("date_of_birth")} />
                {form.formState.errors.date_of_birth && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.date_of_birth.message}
                    </p>
                )}
            </div>

            {/* Location */}
            <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register("location")} />
                {form.formState.errors.location && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.location.message}
                    </p>
                )}
            </div>

            {/* Occupation */}
            <div className="grid gap-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" {...form.register("occupation")} />
                {form.formState.errors.occupation && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.occupation.message}
                    </p>
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
                Submit Registration
            </Button>
        </form>
    );
}

export default BuyAfaForm;
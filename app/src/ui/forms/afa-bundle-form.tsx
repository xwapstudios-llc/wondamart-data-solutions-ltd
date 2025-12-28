"use client";

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/cn/components/ui/input";
import {Button} from "@/cn/components/ui/button";
import {ClTxAFABundle} from "@common/client-api/tx-afa-bundle";
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


const afaSchema = z.object({
    fullName: z.string().min(3, "Full name is required"),
    phone: z.string().regex(/^(0|\+233|233)[25][0-9]{8}$/, "Invalid phone number format"),
    idNumber: z.string().regex(/^GHA-\d{9}-\d{1}$/, "Format: GHA-XXXXXXXXX-X"),
    date_of_birth: z.coerce.date().min(1, "Date of birth is required"),
    location: z.string().min(2, "Location is required"),
    occupation: z.string().min(2, "Occupation is required"),
});

type AfaValues = z.infer<typeof afaSchema>;

const AfaBundleForm: React.FC = () => {
    const {profile, setError, setHTTPResponse} = useAppStore();
    const [loading, setLoading] = useState(false);
    const form = useForm<AfaValues>({
        resolver: zodResolver(afaSchema) as never,
        defaultValues: {
            fullName: "",
            phone: "",
            idNumber: "",
            date_of_birth: new Date(),
            location: "",
            occupation: "",
        },
    });

    const onSubmit = async (values: AfaValues) => {
        setLoading(true);
        if (profile) {
            try {
                const response = await ClTxAFABundle.create({
                    date_of_birth: values.date_of_birth,
                    fullName: values.fullName,
                    idNumber: values.idNumber,
                    location: values.location,
                    occupation: values.occupation,
                    phoneNumber: values.phone,
                    uid: profile?.id,
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
        }
        setLoading(false);
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/*Full Name*/}
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder={"John Doe"} {...field} />
                            </FormControl>
                            <FormDescription>
                                Full Name On your National ID Card
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/*Phone*/}
                <FormField
                    control={form.control}
                    name="phone"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder={"02XXXXXXXX"} {...field} />
                            </FormControl>
                            <FormDescription>
                                Phone number of the one to buy for
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* ID Number*/}
                <FormField
                    control={form.control}
                    name="idNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>National ID Number</FormLabel>
                            <FormControl>
                                <Input placeholder={"GHA-123456789-0"} {...field} />
                            </FormControl>
                            <FormDescription>
                                National ID (Ghana Card) Number
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Date Of Birth*/}
                <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                                <Input
                                    type={"date"}
                                    value={field.value ? field.value.toISOString().split("T")[0] : ""}
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Location */}
                <FormField
                    control={form.control}
                    name="location"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input type={"text"} placeholder={"Accra"} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Occupation */}
                <FormField
                    control={form.control}
                    name="occupation"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                                <Input type={"text"} placeholder={"Teacher"} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {
                        loading ? <>
                            <Loader2Icon className={"animate-spin"}/> Loading
                        </> : "Submit Registration"
                    }
                </Button>
            </form>
        </Form>
    );
}

export default AfaBundleForm;
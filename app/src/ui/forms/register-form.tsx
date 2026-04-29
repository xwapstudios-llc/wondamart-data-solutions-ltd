"use client";

import * as React from "react";
import {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {cn} from "@/cn/lib/utils";
import {Button} from "@/cn/components/ui/button";
import {Input} from "@/cn/components/ui/input";
import {signInUser} from "@common/lib/auth";
import {Loader2Icon} from "lucide-react";
import {ClUser as ClientUserAPI} from "@common/client-api/user";
import {useNavigate} from "react-router-dom";
import {R} from "@/app/routes";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/cn/components/ui/form";

const registerSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    phoneNumber: z.string().regex(/^(0|\+233|233)[25][0-9]{8}$/, "Invalid phone number format"),
    email: z.email("Invalid email address"),
    referredBy: z.email().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterValues = z.infer<typeof registerSchema>;

interface RegisterFormProps extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
    onSubmit?: (data: RegisterValues) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({className, onSubmit, ...props}) => {
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(false);

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmitForm = async (values: RegisterValues) => {
        setFetching(true);
        try {
            if (onSubmit) {
                await onSubmit(values);
                form.reset();
            } else {
                await ClientUserAPI.create({
                    email: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phoneNumber: values.phoneNumber,
                    referredBy: values.referredBy,
                });
                await signInUser(values.email, values.password);
                form.reset();
                navigate(R.login);
            }
        } catch (err) {
            form.setError("confirmPassword", {message: err as string});
        }
        setFetching(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)} className={cn("space-y-4", className)} {...props}>

                {/* Name row */}
                <div className={"grid grid-cols-2 gap-3"}>
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input className={"bg-primary-foreground dark:bg-transparent"} placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input className={"bg-primary-foreground dark:bg-transparent"} placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input className={"bg-primary-foreground dark:bg-transparent"} type="tel" placeholder="02XXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input className={"bg-primary-foreground dark:bg-transparent"} type="email" placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="referredBy"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Referral <span className={"text-muted-foreground font-normal"}>(optional)</span></FormLabel>
                            <FormControl>
                                <Input className={"bg-primary-foreground dark:bg-transparent"} type="email" placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Password row */}
                <div className={"grid grid-cols-2 gap-3"}>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input className={"bg-primary-foreground dark:bg-transparent"} type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Confirm</FormLabel>
                                <FormControl>
                                    <Input className={"bg-primary-foreground dark:bg-transparent"} type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={fetching} className="w-full">
                    {fetching ? <><Loader2Icon className={"animate-spin"}/> Loading</> : "Continue"}
                </Button>
            </form>
        </Form>
    );
};

export default RegisterForm;

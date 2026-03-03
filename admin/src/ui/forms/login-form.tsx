"use client";

import * as React from "react";
import {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {cn} from "@/cn/lib/utils";
import {Input} from "@/cn/components/ui/input";
import {Button} from "@/cn/components/ui/button";
import {Label} from "@/cn/components/ui/label";
import {LoaderIcon} from "lucide-react";
import {useAppStore} from "@/lib/useAppStore";
import {useNavigate} from "react-router-dom";
import {R} from "@/app/routes.ts";

// ✅ Validation schema
const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginForm = ({className, ...props}: React.ComponentProps<"form">) => {
    const {login} = useAppStore();
    const [fetching, setFetching] = useState(false);
    const navigate = useNavigate();

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginValues) => {
        setFetching(true);
        login(values.email, values.password).then(() => {
            navigate(R.dashboard);
        }).catch((err) => {
            form.setError("password", {message: err as string});
            setFetching(false);
        })
    };

    return (
        <form
            className={cn("grid gap-6 w-full", className)} {...props}
            onSubmit={form.handleSubmit(onSubmit)}
        >
            {/* Email */}
            <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...form.register("email")}
                />
                {form.formState.errors.email && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                />
                {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.password.message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <Button type="submit" disabled={fetching} className="w-full">
                {
                    fetching ? <>
                        <LoaderIcon className={"animate-spin"}/> Loading
                    </> : "Login"
                }
            </Button>
        </form>
    );
};

export {LoginForm};

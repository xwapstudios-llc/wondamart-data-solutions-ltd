"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/cn/lib/utils";
import { Input } from "@/cn/components/ui/input";
import { Button } from "@/cn/components/ui/button";
import { Label } from "@/cn/components/ui/label";
import {LoaderIcon} from "lucide-react";
import {useState} from "react";
import {useAppStore} from "@/lib/useAppStore";
import {Link, useNavigate} from "react-router-dom";
import R from "@/routes.ts";

// ✅ Validation schema
const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
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
            form.setError("password", { message: err as string });
            setFetching(false);
        })
    };

    return (
        <div className={cn("w-full", className)} {...props} >
            <div className="text-center">
                <h2 className="text-xl font-medium">Welcome Admin</h2>
                <p className={"text-sm text-muted-foreground mt-2 mb-6"}>
                    {/*Login with your Apple or Google account*/}
                    Login with your Google account
                </p>
            </div>
            <div>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-6"
                >
                    {/* Social buttons */}
                    <div className="flex flex-col gap-4">
                        <Button variant="outline" className="w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path
                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                    fill="currentColor"/>
                            </svg>
                            Google
                        </Button>
                    </div>

                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t">
                            <span className="text-muted-foreground relative z-10 px-2 bg-background">
                                Or continue with
                            </span>
                    </div>

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
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                to="/forgot-password"
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
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
                                <LoaderIcon className={"animate-spin"} /> Loading
                            </> : "Login"
                        }
                    </Button>
                </form>
            </div>
        </div>
    );
};

export { LoginForm };

"use client";

import * as React from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {cn} from "@/cn/lib/utils";
import {Button} from "@/cn/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/cn/components/ui/card";
import {Input} from "@/cn/components/ui/input";
import {Label} from "@/cn/components/ui/label";
import {signInUser} from "@common/lib/auth";
import {useState} from "react";
import {LoaderIcon} from "lucide-react";
import {ClUser as ClientUserAPI} from "@common/client-api/user"

// ✅ Validation Schema
const registerSchema = z
    .object({
        firstName: z.string().min(2, "First name is required"),
        lastName: z.string().min(2, "Last name is required"),
        phoneNumber: z.string().regex(/^(0|\+233|233)[25][0-9]{8}$/, "Invalid phone number format"),
        email: z.email("Invalid email address"),
        referredBy: z.string().optional(),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type RegisterValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
                                                                          className,
                                                                          ...props
                                                                      }) => {
    const router = useRouter();
    const [fetching, setFetching] = useState(false);
    // const [step, setStep] = useState<1 | 2>(1);

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            referredBy: "",
            password: "",
            confirmPassword: "",
        },
    });

    // const switchToStep2 = () => {
    //     form.trigger(["email", "referredBy", "password", "confirmPassword"]).then((isValid) => {
    //         // Todo: Check if email already exists
    //         // Create User here and then collect more info in step 2 to initialize user document
    //         // But if step 2 is not completed, delete the user
    //         if (isValid) {
    //             setStep(2);
    //         }
    //     });
    // };

    const onSubmit = async (values: RegisterValues) => {
        setFetching(true);
        try {
            console.log("Creating user with values:", values);
            await ClientUserAPI.create({
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                referredBy: values.referredBy
            })

            // TODO: Add phoneNumber OTP addition
            // TODO: Add email verification

            await signInUser(values.email, values.password);
            // Todo: message

            setFetching(false);
            form.reset();
            router.push("/user");
        } catch (err) {
            form.setError("confirmPassword", {message: err as string});
            setFetching(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-transparent border-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome</CardTitle>
                    <CardDescription>
                        {/*Register with your Apple or Google account*/}
                        Register with your Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
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

                        {/* Divider */}
                        <div
                            className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                            <span className="text-muted-foreground relative z-10 px-2 bg-background">
                                Or continue with
                            </span>
                        </div>

                        {/* First Name */}
                        <div className="grid gap-3">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" {...form.register("firstName")} />
                            {form.formState.errors.firstName && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.firstName.message}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="grid gap-3">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...form.register("lastName")} />
                            {form.formState.errors.lastName && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.lastName.message}
                                </p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="grid gap-3">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" type="tel" {...form.register("phoneNumber")} />
                            {form.formState.errors.phoneNumber && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.phoneNumber.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...form.register("email")} />
                            {form.formState.errors.email && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Referral Code */}
                        <div className="grid gap-3">
                            <Label htmlFor="referredBy">Referral Code</Label>
                            <Input id="referredBy" placeholder={"Optional"} {...form.register("referredBy")} />
                        </div>

                        {/* Password */}
                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...form.register("password")} />
                            {form.formState.errors.password && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="grid gap-3">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
                            {form.formState.errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <Button type="submit" disabled={fetching} className="w-full">
                            {
                                fetching ? <>
                                    <LoaderIcon className={"animate-spin"}/> Loading
                                </> : "Continue"
                            }
                        </Button>

                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="underline underline-offset-4">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div
                className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our
                <Link href="/terms">{" "}Terms of Service</Link>
                {" "} and
                <Link href="/policy">{" "}Privacy Policy</Link>.
            </div>
        </div>
    );
};

export default RegisterForm;

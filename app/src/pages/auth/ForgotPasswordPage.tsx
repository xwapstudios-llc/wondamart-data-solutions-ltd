import React, {useState} from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Page from "@/ui/page/Page.tsx";
import { Button } from '@/cn/components/ui/button';
import { Input } from '@/cn/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/cn/components/ui/form';
import PageHeading from "@/ui/page/PageHeading.tsx";
import {sendPasswordResetEmail} from "firebase/auth";
import {toast} from "sonner";
import {auth} from "@common/lib/auth.ts";
import {LoaderIcon} from "lucide-react";

const forgotPasswordSchema = z.object({
    email: z.email('Please enter a valid email address')
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const form = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = async (data: ForgotPasswordData) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, data.email);
            toast.success("Password Reset Sent", {
                description: "Please check your email for the password reset link"
            });
        } catch (e) {
            toast.error("Password Reset Failed", {
                description: "Please try again later."
            });
        }
        setLoading(false);
    };

    return (
        <Page className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md">
                <img src={"/logo/logo.png"} alt={""} className={"size-32 mx-auto mb-5"}/>
                <div className="text-center">
                    <PageHeading className="text-2xl">Forgot Password?</PageHeading>
                    <p className="text-sm text-muted-foreground">Enter your email to reset your password</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" placeholder="Enter your email" />
                                    </FormControl>
                                    <FormDescription>We'll send you a password reset link</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {
                                loading ? (
                                    <>
                                        <LoaderIcon className={"animate-spin size-4 mr-2"} /> Loading...
                                    </>
                                ) : (
                                    <span>Request Password Reset</span>
                                )
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </Page>
    )
}

export default ForgotPasswordPage;
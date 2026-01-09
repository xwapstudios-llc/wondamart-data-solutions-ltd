import React, {useEffect, useState} from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Page from "@/ui/page/Page.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {wondamart_api_client} from "@common/lib/api-wondamart.ts";
import {applyActionCode, checkActionCode, verifyPasswordResetCode, confirmPasswordReset} from "firebase/auth";
import {auth} from "@common/lib/auth.ts";
import {LoaderIcon, MailCheckIcon, ShieldCheckIcon, TriangleAlertIcon} from "lucide-react";
import ActivationCard from "@/ui/components/cards/ActivationCard.tsx";
import {R} from "@/app/routes.ts";
import {toast} from "sonner";
import { Button } from '@/cn/components/ui/button';
import { Input } from '@/cn/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/cn/components/ui/form';
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import PageContent from "@/ui/page/PageContent.tsx";

const passwordResetSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

type PasswordResetData = z.infer<typeof passwordResetSchema>;

const AuthAction: React.FC = () => {
    const [sParams] = useSearchParams();
    const code = sParams.get("oobCode");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [action, setAction] = useState<string | undefined>();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string | undefined>();
    const [passwordResetStep, setPasswordResetStep] = useState<0 | 1>(0);


    useEffect(() => {
        async function run() {
            if (!code) {
                // Link broken
                setError("LINK_BROKEN");
                setLoading(false);
                return;
            }
            try {
                const info = await checkActionCode(auth, code);
                if (info.operation === "VERIFY_EMAIL") {
                    await applyActionCode(auth, code);
                    await wondamart_api_client("/user/auth/complete-email-verification");
                    setAction("VERIFY_EMAIL");
                }
                else if (info.operation === "PASSWORD_RESET") {
                    const email = await verifyPasswordResetCode(auth, code);
                    setEmail(email);
                    setAction("RESET_PASSWORD");
                }
                else {
                    setError("UNKNOWN_OPERATION");
                }
            } catch (e) {
                setError("UNKNOWN_ERROR_OCCURRED");
            }
            setLoading(false);
        }

        run().then();
    }, []);

    const passwordForm = useForm<PasswordResetData>({
        resolver: zodResolver(passwordResetSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const handlePasswordReset = async (data: PasswordResetData) => {
        if (!code) {
            toast.error("Link broken");
            return;
        }
        try {
            setLoading(true);
            await confirmPasswordReset(auth, code, data.password);
            toast.success("Password reset successfully");
            setPasswordResetStep(1);
        } catch (e) {
            toast.error("Error resetting password");
            setError("UNKNOWN_ERROR_OCCURRED");
        }
        setLoading(false);
    }

    if (loading) return (
        <Page className={"flex flex-col gap-8 p-8 items-center justify-center h-svh"}>
            <ActivationCard
                className={"w-full md:w-md h-md"}
                Icon={LoaderIcon}
                title={"Loading..."}
                iconClassName={"animate-spin"}
                cta={{label: "Please wait..."}}
            />
        </Page>
    )

    if (error) return (
        <Page className={"flex flex-col gap-8 p-8 items-center justify-center h-svh"}>
            <ActivationCard
                className={"w-full md:w-md h-md"}
                Icon={TriangleAlertIcon}
                title={"Oops..."}
                cta={{label: "Please try again later"}}
            >
                <p>{error}</p>
            </ActivationCard>
        </Page>
    )

    if (action && action === "VERIFY_EMAIL") return (
        <Page className={"flex flex-col gap-8 p-8 items-center justify-center h-svh"}>
            <ActivationCard
                className={"w-full md:w-md h-md"}
                Icon={MailCheckIcon}
                title={"Email verified"}
                cta={{
                    label: "Go to dashboard", action: () => {
                        navigate(R.app.dashboard)
                    }
                }}
            >
                {
                    auth.currentUser && <p className={"text-xl font-semibold"}>{auth.currentUser.email}</p>
                }
                <p>Your email address is verified.</p>
            </ActivationCard>
        </Page>
    )

    if (action && action === "RESET_PASSWORD") return (
        <Page className={"flex flex-col gap-8 p-8 items-center justify-center h-svh"}>
            {
                passwordResetStep === 0 && (
                    <div className="w-full max-w-md">
                        <div className="text-center">
                            <PageHeading>Reset Password</PageHeading>
                            <PageSubHeading>Enter your new password for {email}</PageSubHeading>
                        </div>
                        <PageContent className={"mt-8"}>
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                                    <FormField
                                        control={passwordForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="password" placeholder="Enter new password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="password" placeholder="Confirm new password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">
                                        Reset Password
                                    </Button>
                                </form>
                            </Form>
                        </PageContent>
                    </div>
                )
            }
            {
                passwordResetStep === 1 && (
                    <ActivationCard
                        className={"w-full md:w-md h-md"}
                        Icon={ShieldCheckIcon}
                        title={"Password reset"}
                        cta={{
                            label: "Login", action: () => {
                                navigate(R.login)
                            }
                        }}
                    >
                        <p>Login with your new password.</p>
                    </ActivationCard>
                )
            }
        </Page>
    )

    return (
        <Page className={"flex flex-col gap-8 p-8 items-center justify-center h-svh"}>
            <ActivationCard
                className={"w-full md:w-md h-md"}
                Icon={TriangleAlertIcon}
                title={"Oops..."}
                cta={{label: "Contact Admin", action: () => {
                    navigate(R.utils.admin)
                }
            }}
            >
                <p>You are not supposed to see this. If you do, please contact administrators.</p>
            </ActivationCard>
        </Page>
    )
}

export default AuthAction;
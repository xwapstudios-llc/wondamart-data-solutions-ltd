import React from "react";
import Page from "@/ui/page/Page.tsx";
import {LoginForm} from "@/ui/forms/login-form";
import {Link} from "react-router-dom";
import {R} from "@/app/routes";
import PageHeading from "@/ui/page/PageHeading";
import {buttonVariants} from "@/cn/components/ui/button.tsx";
import {cn} from "@/cn/lib/utils.ts";
import {SearchIcon} from "lucide-react";
import { ThemeProvider } from "@/cn/components/theme/theme-provider";

const LoginPage: React.FC = () => {
    return (
        <ThemeProvider defaultTheme="system" storageKey="wondamart-app-ui-theme">
            <Page className={"w-full h-svh border flex items-center justify-center bg-blue-900 mb-0!"}>
                <div className={"max-w-xl space-y-6 bg-white dark:bg-background text-black dark:text-foreground p-4 mx-4 rounded-2xl"}>
                    <div>
                        <img src={"/logo/logo.png"} alt={""} className={"size-32 mx-auto mb-5"}/>
                        <PageHeading className="text-center">Wondamart Data Solutions</PageHeading>
                        <div className={"h-12"}></div>
                        <div className={"border-y-yellow-400 border-y-2"} />
                        <p className="text-center mt-2">
                            Login to your account
                        </p>
                    </div>
                    <LoginForm />
                    <div className="space-y-2">
                        <p className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                to={R.signup}
                                className="underline underline-offset-4"
                            >
                                Register
                            </Link>
                        </p>
                        <p className="text-muted-foreground *:[a]:hover:text-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                            By clicking continue, you agree to our
                            <Link to={R.termsAndConditions}>{" "}Terms of Service and Conditions</Link>.
                        </p>
                    </div>

                    <div className={"space-y-1"}>
                        <p className={"text-center"}>Just want to buy data quickly?</p>
                        <Link to={R.client.store("")} className={cn(
                            buttonVariants({size: "lg"}),
                            "w-full bg-green-600 hover:bg-green-700"
                        )}>
                        Buy without signing up
                        </Link>

                        <Link to={R.client.track} className={cn(
                            buttonVariants({size: "lg", variant: "outline"}),
                            "border border-green-600",
                            "flex items-center justify-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        )}>
                            <SearchIcon className="mr-2 size-4" />
                            Track order
                        </Link>
                    </div>
                </div>
            </Page>
        </ThemeProvider>
    );
};

export default LoginPage;

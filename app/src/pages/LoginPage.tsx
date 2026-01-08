import React from "react";
import Page from "@/ui/page/Page.tsx";
import {LoginForm} from "@/ui/forms/login-form";
import {Link} from "react-router-dom";
import {R} from "@/app/routes";
import PageHeading from "@/ui/page/PageHeading";
import PageSubHeading from "@/ui/page/PageSubHeading";

const LoginPage: React.FC = () => {
    return (
        <Page
            className={"w-full h-svh border flex items-center justify-center"}
        >
            <div className={"max-w-xl space-y-6"}>
                <div>
                    <img src={"/logo/logo.png"} alt={""} className={"size-32 mx-auto"}/>
                    <PageHeading className="text-center">Wondamart Data Solutions</PageHeading>
                    <PageSubHeading className="text-center">
                        Login to your account
                    </PageSubHeading>
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
                        <Link to={R.terms}> Terms of Service</Link> and
                        <Link to={R.policy}> Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </Page>
    );
};

export default LoginPage;

import React from "react";
import Page from "@/ui/page/Page.tsx";
import RegisterForm from "@/ui/forms/register-form";
import PageHeading from "@/ui/page/PageHeading.tsx";
import {Link} from "react-router-dom";
import {R} from "@/app/routes.ts";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";

const SignupPage: React.FC = () => {
    return (
        <Page>
            <div className={"max-w-xl mx-auto space-y-4"}>
                <div>
                    <div className={"flex items-center justify-center gap-x-4"}>
                        <img className={"size-12"} src={"/logo/logo.png"} alt={"logo"}/>
                        <span>Wondamart Data Solutions</span>
                    </div>
                    <PageHeading className={"text-center"}>Sign up</PageHeading>
                    <PageSubHeading className={"text-center"}>Fill the form below to register an a Wondamart
                        Agent</PageSubHeading>
                </div>
                <RegisterForm/>
                <div
                    className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                    By continuing, you agree to our
                    <Link to={R.terms}>{" "}Terms of Service</Link>
                    {" "} and
                    <Link to={R.policy}>{" "}Privacy Policy</Link>.
                </div>
            </div>
        </Page>
    )
}

export default SignupPage;
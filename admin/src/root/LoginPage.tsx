import React from "react";
import Page from "@/ui/page/Page.tsx";
import {LoginForm} from "@/ui/forms/login-form";
import PageHeading from "@/ui/page/PageHeading";
import PageSubHeading from "@/ui/page/PageSubHeading";

const LoginPage: React.FC = () => {
    return (
        <Page
            className={"w-full h-svh border flex items-center justify-center"}
        >
            <div className={"max-w-xl space-y-6"}>
                <div>
                    <img src={"/logo/logo.png"} alt={""} className={"size-32 mx-auto mb-5"}/>
                    <PageHeading className="text-center">Wondamart Data Solutions</PageHeading>
                    <PageSubHeading className="text-center">
                        Login to your Admin account
                    </PageSubHeading>
                </div>
                <LoginForm />
            </div>
        </Page>
    );
};

export default LoginPage;

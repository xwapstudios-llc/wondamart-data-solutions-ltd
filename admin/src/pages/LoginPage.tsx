import React from "react";
import Page from "@/ui/page/Page.tsx";
import {LoginForm} from "@/ui/forms/login-form";
import PageHeading from "@/ui/page/PageHeading";

const LoginPage: React.FC = () => {
    return (
        <Page
            className={"w-full h-svh border flex items-center justify-center dark:bg-primary/25"}
        >
            <div className={"max-w-xl space-y-6 dark:bg-foreground dark:text-background p-4 mx-4 rounded-2xl"}>
                <div>
                    <img src={"/logo/logo.png"} alt={""} className={"size-32 mx-auto mb-5"}/>
                    <PageHeading className="text-center">Wondamart Data Solutions</PageHeading>
                    <div className={"border-y-yellow-400 border-y-2 mt-12"} />
                    <p className="text-center mt-2">
                        Login
                    </p>
                </div>
                <LoginForm />
            </div>
        </Page>
    );
};

export default LoginPage;

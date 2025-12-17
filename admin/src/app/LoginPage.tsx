import React from "react";
import {LoginForm} from "@/ui/forms/login-form";
import PageContent from "@/ui/components/page/PageContent.tsx";


const LoginPage: React.FC = () => {
    return (
        <PageContent className="flex h-[calc(100vh-6rem)] w-96 mx-auto flex-col items-center justify-center gap-6 p-6 md:p-4">
            <LoginForm />
        </PageContent>
    )
}

export default LoginPage;
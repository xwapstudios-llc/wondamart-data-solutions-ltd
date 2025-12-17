import React from "react";
import {LoginForm} from "@/ui/forms/login-form";


const LoginPage: React.FC = () => {
    return (
        <div className="flex h-[calc(100vh-6rem)] flex-col items-center justify-center gap-6 p-6 md:p-4">
            <LoginForm />
        </div>
    )
}

export default LoginPage;
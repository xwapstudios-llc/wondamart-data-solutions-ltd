import React from "react";
import RegisterForm from "@/ui/forms/register-form";
import Image from "next/image";


const RegisterPage: React.FC = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium text-accent">
                    <Image src={"/logo/logo_icon.png"} alt={"logo"} width={30} height={30} />
                    Wondamart Data Solutions
                </a>
                <RegisterForm />
            </div>
        </div>
    )
}

export default RegisterPage;
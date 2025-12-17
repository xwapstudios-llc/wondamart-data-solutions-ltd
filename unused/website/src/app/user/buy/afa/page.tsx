import React from "react";
import BuyAfaForm from "@/ui/forms/buy-afa-form";

const AFAPage: React.FC = () => {
    return (
        <div className={"h-full flex flex-col gap-4"}>
            <h2 className={"text-xl"}>Register for AFA</h2>
            <BuyAfaForm />
        </div>
    )
}

export default AFAPage;
import React from "react";
import BuyResultsCheckerForm from "@/ui/forms/buy-results-checker-form";


const ResultCheckerPage: React.FC = () => {
    return (
        <div className={"h-full flex flex-col gap-4"}>
            <h2 className={"text-xl"}>Buy Result Checker</h2>
            <BuyResultsCheckerForm />
        </div>
    )
}

export default ResultCheckerPage;
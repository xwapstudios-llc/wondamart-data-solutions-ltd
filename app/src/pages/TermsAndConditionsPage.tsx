import React from "react";
import Page from "@/ui/page/Page.tsx";
import {TERMS_AND_CONDITIONS} from "@/terms-data.ts";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {FileTextIcon} from "lucide-react";

const TermsAndConditionsPage: React.FC = () => {
    return (
        <Page className="pb-8">
            <PageHeading className="mt-4">
                WONDAMART GH — TERMS & CONDITIONS
            </PageHeading>
            <PageSubHeading>
                Trading Name of Sterling Wondamart Enterprise
            </PageSubHeading>
            <PageSubHeading>
                Last Updated: 21st November, 2025
            </PageSubHeading>

            <PageContent className="max-w-xl mx-auto space-y-4 pt-4">
                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-indigo-500 text-white">
                            <FileTextIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Terms & Conditions</p>
                            <p className="text-xs text-muted-foreground">Please read carefully</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {
                            TERMS_AND_CONDITIONS.map((clause, clauseIndex) => (
                                <div key={clauseIndex} className="border-b border-border pb-4 last:border-b-0">
                                    <h3 className="text-sm font-semibold mb-2 flex gap-2">
                                        <span>{clauseIndex + 1}.</span>
                                        <span>{clause.title}</span>
                                    </h3>
                                    <div className="space-y-2 ml-4">
                                        {
                                            clause.items.map((item, itemIndex) => (
                                                <p key={itemIndex} className="text-muted-foreground text-sm">
                                                    <span className="text-foreground font-medium">
                                                      {clauseIndex + 1}.{itemIndex + 1}.
                                                    </span>{" "}
                                                    {item}
                                                </p>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </PageContent>
        </Page>
    );
}

export default TermsAndConditionsPage;

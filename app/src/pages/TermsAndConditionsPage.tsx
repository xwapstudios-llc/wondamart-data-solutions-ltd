import React from "react";
import Page from "@/ui/page/Page.tsx";
import {TERMS_AND_CONDITIONS} from "@/terms-data.ts";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/cn/components/ui/card.tsx";

const TermsAndConditionsPage: React.FC = () => {
    return (
        <Page>
            <PageHeading className={"mt-8 mb-2"}>
                WONDERMAT GH — TERMS & CONDITIONS
            </PageHeading>
            <PageSubHeading>
                Trading Name of Sterling Wondermat Enterprise
            </PageSubHeading>
            <PageSubHeading>
                Last Updated: 21st November, 2025
            </PageSubHeading>

            <PageContent className={"mt-8 max-w-4xl mx-auto space-y-8"}>
                {
                    TERMS_AND_CONDITIONS.map((clause, clauseIndex) => (
                        <Card key={clauseIndex}>
                            <CardHeader>
                                <CardTitle className={"flex gap-2"}>
                                    <span>{clauseIndex + 1}.</span>
                                    <span>{clause.title}</span>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2 ml-4">
                                {
                                    clause.items.map((item, itemIndex) => (
                                        <p key={itemIndex} className="text-muted-foreground">
                                            <span className={"text-foreground font-medium"}>
                                              {clauseIndex + 1}.{itemIndex + 1}.
                                            </span>{" "}
                                            {item}
                                        </p>
                                    ))
                                }
                            </CardContent>
                        </Card>
                    ))
                }
            </PageContent>
        </Page>
    );
}

export default TermsAndConditionsPage;


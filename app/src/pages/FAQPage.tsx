import React from "react";
import Page from "@/ui/page/Page.tsx";

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/cn/components/ui/accordion";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import {FAQS} from "@/faq-data.ts";
import PageContent from "@/ui/page/PageContent.tsx";

const FAQPage: React.FC = () => {
    return (
        <Page>
            <PageHeading className={"mt-4"}>
                Frequently Asked Questions
            </PageHeading>
            <PageSubHeading>
                Clear answers to common questions about Wondamart Data Solutions.
            </PageSubHeading>

            <PageContent className={"mt-8 w-full max-w-4xl mx-auto"}>
                <Accordion type="single" collapsible className="w-full">
                    {
                        FAQS.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`faq-${index}`}
                                className="border-b"
                            >
                                <AccordionTrigger className="text-left font-medium">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className={"text-muted-foreground pb-12"}>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    }
                </Accordion>
            </PageContent>
        </Page>
    )
}

export default FAQPage;
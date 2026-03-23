import React from "react";
import Page from "@/ui/page/Page.tsx";

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/cn/components/ui/accordion";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import {FAQS} from "@/faq-data.ts";
import PageContent from "@/ui/page/PageContent.tsx";
import {HelpCircleIcon} from "lucide-react";

const FAQPage: React.FC = () => {
    return (
        <Page className="pb-8">
            <PageHeading className="mt-4">
                Frequently Asked Questions
            </PageHeading>
            <PageSubHeading>
                Clear answers to common questions about Wondamart Data Solutions.
            </PageSubHeading>

            <PageContent className="max-w-xl mx-auto space-y-4 pt-4">
                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-purple-500 text-white">
                            <HelpCircleIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">FAQ</p>
                            <p className="text-xs text-muted-foreground">Find answers to your questions</p>
                        </div>
                    </div>
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
                </div>
            </PageContent>
        </Page>
    )
}

export default FAQPage;
import React from "react";
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {Card, CardContent, CardHeader, CardTitle} from '@/cn/components/ui/card';
import {Button} from '@/cn/components/ui/button';
import {R} from "@/app/routes.ts";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import {useNavigate} from "react-router-dom";

const HelpPage: React.FC = () => {
    const navigate = useNavigate();

    const helpCards = [
        {
            title: "Join Our Group",
            description: "Connect with other users and get community support",
            action: "Join WhatsApp Group",
            link: R.utils.whatsAppGroup
        },
        {
            title: "Online Data Dealers",
            description: "Find authorized dealers in your area for data services",
            action: "Find Dealers",
            link: R.utils.whatsAppGroup
        },
        {
            title: "Customer Support",
            description: "Get help from our support team via live chat",
            action: "Start Chat",
            link: R.utils.support
        },
        {
            title: "Contact Administrators",
            description: "Reach out to our admin team for account issues",
            action: "Contact Admin",
            link: R.utils.admin
        },
        {
            title: "Send Us a Mail",
            description: "Email us for detailed inquiries and feedback",
            action: "Send Email",
            link: "mailto:support@wondamart.com"
        }
    ];

    return (
        <Page className={"max-w-4xl mx-auto"}>
            <PageHeading className={"mt-4"}>Help & Support</PageHeading>
            <PageSubHeading>Get assistance and connect with our community</PageSubHeading>

            <PageContent className={"mt-8"}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {
                        helpCards.map((card, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-lg">{card.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                                    <Button
                                        className="w-full"
                                        onClick={() => navigate(card.link)}
                                    >
                                        {card.action}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </PageContent>
        </Page>
    )
}

export default HelpPage;
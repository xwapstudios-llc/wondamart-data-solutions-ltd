import React from "react";
import Page from "@/ui/page/Page.tsx";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {Button} from '@/cn/components/ui/button';
import {R} from "@/app/routes.ts";
import PageSubHeading from "@/ui/page/PageSubHeading.tsx";
import {useNavigate} from "react-router-dom";
import {MessageCircleIcon, UsersIcon, HeadphonesIcon, UserCheckIcon, MailIcon} from "lucide-react";

const HelpPage: React.FC = () => {
    const navigate = useNavigate();

    const helpCards = [
        {
            title: "Join Our Group",
            description: "Connect with other users and get community support",
            action: "Join WhatsApp Group",
            link: R.utils.whatsAppGroup,
            icon: MessageCircleIcon,
            color: "bg-green-500"
        },
        {
            title: "Online Data Dealers",
            description: "Find authorized dealers in your area for data services",
            action: "Find Dealers",
            link: R.utils.whatsAppGroup,
            icon: UsersIcon,
            color: "bg-blue-500"
        },
        {
            title: "Customer Support",
            description: "Get help from our support team via live chat",
            action: "Start Chat",
            link: R.utils.support,
            icon: HeadphonesIcon,
            color: "bg-purple-500"
        },
        {
            title: "Contact Administrator",
            description: "Reach out to our admin team for account issues",
            action: "Contact Admin",
            link: R.utils.admin,
            icon: UserCheckIcon,
            color: "bg-orange-500"
        },
        {
            title: "Send Us a Mail",
            description: "Email us for detailed inquiries and feedback",
            action: "Send Email",
            link: "mailto:wondamartgh@gmail.com",
            icon: MailIcon,
            color: "bg-red-500"
        }
    ];

    return (
        <Page className="pb-8">
            <PageHeading className="mt-4">Help & Support</PageHeading>
            <PageSubHeading>Get assistance and connect with our community</PageSubHeading>

            <PageContent className="max-w-xl mx-auto space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-1">
                    {
                        helpCards.map((card, index) => (
                            <div key={index} className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`flex size-9 items-center justify-center rounded-md ${card.color} text-white`}>
                                        <card.icon className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{card.title}</p>
                                        <p className="text-xs text-muted-foreground">{card.description}</p>
                                    </div>
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={() => navigate(card.link)}
                                >
                                    {card.action}
                                </Button>
                            </div>
                        ))
                    }
                </div>
            </PageContent>
        </Page>
    )
}

export default HelpPage;
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface FooterLink {
    name: string;
    url: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

const footerSections: FooterSection[] = [
    // {
    //     title: "Resources",
    //     links: [
    //         { name: "Pricing", url: "/pricing" },
    //         { name: "FAQ", url: "/faq" },
    //         { name: "Tutorials", url: "/tutorials" },
    //     ],
    // },
    // {
    //     title: "Legal",
    //     links: [
    //         { name: "Terms", url: "/terms" },
    //         { name: "Privacy Policy", url: "/policy" },
    //     ],
    // },
    {
        title: "Community",
        links: [
            { name: "WhatsApp", url: "https://whtsapp.me/00000000000" },
            { name: "Telegram", url: "https://telegram.com/username" },
        ],
    },
    {
        title: "Contact",
        links: [
            { name: "WhatsApp", url: "/contact" },
            { name: "Telephone", url: "/contact" },
            { name: "Email", url: "/contact" },
        ],
    },
];

const Footer: React.FC = () => {
    return (
        <footer className={"mt-16 border-t-2"}>
            <div className={"container mx-auto p-4 pb-8"}>
                <Link href={"/"} className={"flex gap-2 items-center flex-wrap"}>
                    <Image src={"/logo/logo_icon.png"} alt={"logo"} width={40} height={40} />
                    <span className={"text-xl md:text-2xl text-primary"}>Wondamart Data Solutions</span>
                </Link>
                <div className={"flex gap-12 items-start justify-start flex-col mt-16"}>
                    {
                        footerSections.map(({title, links}, i) => (
                            <div key={title + i} className={"flex flex-col gap-2"}>
                                <h4 className={"font-semibold"}>{title}</h4>
                                <div className={"flex flex-col gap-1"}>
                                    {
                                        links.map((link, i) => (
                                            <Link key={link.name + i} href={link.url} className={"text-muted-foreground hover:text-foreground"}>
                                                {link.name}
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className={"mt-12 text-sm text-muted-foreground text-center"}>
                    &copy; {new Date().getFullYear()} Wondamart Data Solutions. All rights
                    reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer;
'use client';

import {
    Clock4Icon,
    DollarSignIcon,
    HeadsetIcon,
    RocketIcon,
} from "lucide-react";
import Section from "@/ui/layout/Section";
import { buttonVariants } from "@/cn/components/ui/button";
import { Skeleton } from "@/cn/components/ui/skeleton";
import React, {useEffect} from "react";
import Link from "next/link";
import {redirect} from "next/navigation"

const WhyCard = ({
                     icon: Icon,
                     text,
                 }: {
    icon: React.ElementType;
    text: string;
}) => {
    return (
        <div
            className={
                "w-full sm:w-72 md:w-80 xl:w-96 h-44 border bg-secondary p-4 rounded-md flex flex-col justify-between mx-auto"
            }
        >
            <Icon size={64} className={"text-accent"} />
            <p>{text}</p>
        </div>
    );
};

const Home = () => {
    /// Trigger a redirect to login
    const redirectToLogin = () => {
        redirect("/login");
    };

    useEffect(() => {
        redirectToLogin();
    })

    return (
        <>
            <header
                className={
                    "flex flex-col items-center justify-center w-full h-[75vh] border-b relative"
                }
            >
                <h1
                    className={
                        "text-5xl leading-14 md:text-6xl md:leading-18 font-bold text-center bg-clip-text bg-gradient-to-br text-transparent from-foreground via-blue-600 to-accent p-0 m-0"
                    }
                >
                    Elevate your browsing and connectivity
                </h1>
                <div className={"flex flex-wrap gap-4 items-center justify-center mt-4"}>
                    <Link
                        href={"/register"}
                        className={`${buttonVariants({ variant: "default", size: "xl" })} rounded-md`}
                    >
                        Get Started
                    </Link>
                    <Link
                        href={"#pricing"}
                        className={`${buttonVariants({ variant: "outline", size: "xl" })}`}
                    >
                        View Pricing
                    </Link>
                </div>
                <p className={"text-center px-4 absolute bottom-4"}>
                    Experience the future of data bundles with Wondamart&apos;s
                    leading solutions.
                </p>
            </header>
            <Section>
                <div
                    className={
                        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-16 w-fit mx-auto"
                    }
                >
                    <WhyCard
                        icon={DollarSignIcon}
                        text={"Cheap data packages for all networks."}
                    />
                    <WhyCard
                        icon={HeadsetIcon}
                        text={"Tailor-made data plans that fit your lifestyle."}
                    />
                    <WhyCard
                        icon={RocketIcon}
                        text={"Fast delivery at lightning speed."}
                    />
                    <WhyCard
                        icon={Clock4Icon}
                        text={"Reliable service. Always ready to serve you."}
                    />
                </div>
            </Section>
            <Section>
                <div
                    className={
                        "flex flex-col items-center justify-center mt-16 p-8 bg-accent text-black rounded-md"
                    }
                >
                    <h2 className={"text-3xl font-bold"}>
                        Why Choose Wondamart?
                    </h2>
                    <p className={"mt-4 max-w-2xl"}>
                        At Wondamart, we understand the importance of staying
                        connected in today&apos;s fast-paced world. That&apos;s
                        why we offer a wide range of data bundles to suit your
                        needs, whether you&apos;re a casual browser or a heavy
                        streamer. Our user-friendly platform makes it easy to
                        find and purchase the perfect data plan for you.
                    </p>
                </div>
            </Section>
            <Section className={"flex gap-12 flex-wrap"}>
                <div>
                    <h2
                        className={
                            "text-5xl leading-14 md:text-6xl md:leading-18 font-bold"
                        }
                    >
                        Ready to touch lives?
                    </h2>
                    <p className={"text-xl"}>Start with yours today!</p>
                    <div className={"flex flex-wrap gap-4 items-center mt-4"}>
                        <Link
                            href={"/register"}
                            className={` ${buttonVariants({ variant: "default", size: "xl" })} rounded-md `}
                        >
                            Get Started
                        </Link>
                        <Link
                            href={"#pricing"}
                            className={` ${buttonVariants({ variant: "outline", size: "xl" })}`}
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>
                <Skeleton
                    className={
                        "grow h-48 rounded-xl bg-secondary min-w-full md:min-w-96"
                    }
                />
            </Section>
        </>
    );
};

export default Home;

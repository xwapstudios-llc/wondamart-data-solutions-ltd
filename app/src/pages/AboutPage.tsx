import React from "react";
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {TargetIcon, EyeIcon, MapPinIcon} from "lucide-react";

const AboutPage: React.FC = () => {
    return (
        <Page className="pb-8">
            <PageContent className="max-w-xl mx-auto space-y-4 pt-4">
                <div className="text-center mb-8">
                    <div className="mb-6">
                        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <img src={"/logo/logo.png"} alt={"logo"}/>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Wondamart Data Solutions LTD.</h1>
                        <p className="text-lg text-muted-foreground">By Sterling Wondamart Enterprise</p>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-red-500 text-white">
                            <TargetIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Our Mission</p>
                            <p className="text-xs text-muted-foreground">What drives us</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        To provide reliable, affordable, and accessible digital services that empower individuals 
                        and businesses across Ghana. We strive to bridge the digital divide by offering seamless 
                        data solutions and financial services.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-blue-500 text-white">
                            <EyeIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Our Vision</p>
                            <p className="text-xs text-muted-foreground">Our future goal</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        To become the leading digital service provider in West Africa, known for innovation, 
                        reliability, and exceptional customer service. We aim to create a connected future 
                        where everyone has access to essential digital services.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-green-500 text-white">
                            <MapPinIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Location</p>
                            <p className="text-xs text-muted-foreground">Where we operate</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        Accra, Ghana<br/>
                        West Africa
                    </p>
                </div>

                <div className="text-center mt-12 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Sterling Wondamart Enterprise. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Built by <a href={"https://xwapstudios.com"} target={"_blank"} className="font-medium">XWap Studios LLC</a>
                    </p>
                </div>
            </PageContent>
        </Page>
    )
}

export default AboutPage;
import React from "react";
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import { Card, CardContent } from '@/cn/components/ui/card';

const AboutPage: React.FC = () => {
    return (
        <Page className="md:p-6">
            <PageContent className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="mb-6">
                        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <img src={"/logo/logo.png"} alt={"logo"}/>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Wondamart Data Solutions LTD.</h1>
                        <p className="text-lg text-muted-foreground">By Sterling Wondamart Enterprise</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To provide reliable, affordable, and accessible digital services that empower individuals 
                                and businesses across Ghana. We strive to bridge the digital divide by offering seamless 
                                data solutions and financial services.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-3">Our Vision</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To become the leading digital service provider in West Africa, known for innovation, 
                                reliability, and exceptional customer service. We aim to create a connected future 
                                where everyone has access to essential digital services.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-3">Location</h2>
                            <p className="text-muted-foreground">
                                Accra, Ghana<br/>
                                West Africa
                            </p>
                        </CardContent>
                    </Card>
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
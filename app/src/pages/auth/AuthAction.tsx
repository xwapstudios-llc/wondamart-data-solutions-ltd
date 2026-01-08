import React, {useEffect, useState} from "react";
import Page from "@/ui/page/Page.tsx";
import {useSearchParams} from "react-router-dom";
import {wondamart_api_client} from "@common/lib/api-wondamart.ts";
import {checkActionCode, applyActionCode} from "firebase/auth";
import {auth} from "@common/lib/auth.ts";
import PageHeading from "@/ui/page/PageHeading.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {LoaderIcon} from "lucide-react";

const AuthAction: React.FC = () => {
    const [sParams] = useSearchParams();
    const action = sParams.get("action");
    const code = sParams.get("oobCode");
    const mode = sParams.get("mode");
    const [loading, setLoading] = useState(true);
    const [infos, setInfos] = useState<string>("");

    useEffect(() => {
        async function run() {
            if (!code) {
                // Link broken
                setInfos("Link broken");
                return;
            }
            try {
                const info = await checkActionCode(auth, code);
                if (info.operation === "VERIFY_EMAIL") {
                    await applyActionCode(auth, code);
                    setInfos("Action Applied")
                    const res = await wondamart_api_client("/user/auth/complete-email-verification");
                    setInfos("Email verified. " + JSON.stringify(res));
                } else {
                    setInfos("Unknown operation");
                }
            } catch (e) {
                setInfos("Error. " + JSON.stringify(e));
            }
            setLoading(false);
        }
        run().then();
    }, []);

    return (
        <Page>
            <PageHeading>Complete</PageHeading>
            <PageContent>
                <div>
                    <p>action: {action}</p>
                    <p>code: {code}</p>
                    <p>mode: {mode}</p>
                </div>
                <div className={"absolute bottom-2 left-2 right-2 rounded-md border-2 border-card bg-card/75 p-2 min-h-32"}>
                    {
                        loading && (
                            <div className={"text-center"}>
                                <LoaderIcon className={"animate-spin"}/>
                                <span>Loading...</span>
                            </div>
                        )
                    }
                    <p className={"mt-2 text-sm"}>{infos}</p>
                </div>

            </PageContent>
        </Page>
    )
}

export default AuthAction;
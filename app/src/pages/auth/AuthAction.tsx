import React, {useEffect, useState} from "react";
import Page from "@/ui/page/Page.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {wondamart_api_client} from "@common/lib/api-wondamart.ts";
import {applyActionCode, checkActionCode} from "firebase/auth";
import {auth} from "@common/lib/auth.ts";
import {LoaderIcon, MailCheckIcon, TriangleAlertIcon} from "lucide-react";
import ActivationCard from "@/ui/components/cards/ActivationCard.tsx";
import {R} from "@/app/routes.ts";

const AuthAction: React.FC = () => {
    const [sParams] = useSearchParams();
    const code = sParams.get("oobCode");
    // const mode = sParams.get("mode");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [action, setAction] = useState<string | undefined>();
    const navigate = useNavigate();

    useEffect(() => {
        async function run() {
            if (!code) {
                // Link broken
                setError("LINK_BROKEN");
                setLoading(false);
                return;
            }
            try {
                const info = await checkActionCode(auth, code);
                if (info.operation === "VERIFY_EMAIL") {
                    await applyActionCode(auth, code);
                    await wondamart_api_client("/user/auth/complete-email-verification");
                    setAction("VERIFY_EMAIL");
                } else {
                    setError("UNKNOWN_OPERATION");
                }
            } catch (e) {
                setError("UNKNOWN_ERROR_OCCURRED");
            }
            setLoading(false);
        }

        run().then();
    }, []);

    if (loading) return (
        <Page className={"flex flex-col gap-8 p-8 items-center justify-center h-svh"}>
            <ActivationCard
                className={"w-full md:w-md h-md"}
                Icon={LoaderIcon}
                title={"Loading..."}
                iconClassName={"animate-spin"}
                cta={{label: "Please wait..."}}
            />
        </Page>
    )

    if (error) return (
        <Page className={"flex flex-col gap-8 p-8 items-center justify-center h-svh"}>
            <ActivationCard
                className={"w-full md:w-md h-md"}
                Icon={TriangleAlertIcon}
                title={"Oops..."}
                cta={{label: "Please try again later"}}
            >
                <p>{error}</p>
            </ActivationCard>
        </Page>
    )

    if (action && action === "VERIFY_EMAIL") return (
        <Page className={"flex flex-col gap-8 p-8 items-center justify-center h-svh"}>
            <ActivationCard
                className={"w-full md:w-md h-md"}
                Icon={MailCheckIcon}
                title={"Email verified"}
                cta={{
                    label: "Go to dashboard", action: () => {
                        navigate(R.app.dashboard)
                    }
                }}
            >
                {
                    auth.currentUser && <p className={"text-xl font-semibold"}>{auth.currentUser.email}</p>
                }
                <p>Your email address is verified.</p>
            </ActivationCard>
        </Page>
    )

    return (
        <Page className={"flex flex-col gap-8 p-8 items-center justify-center h-svh"}>
            <ActivationCard
                className={"w-full md:w-md h-md"}
                Icon={TriangleAlertIcon}
                title={"Oops..."}
                cta={{label: "Contact Admin", action: () => {
                    navigate(R.utils.admin)
                }
            }}
            >
                <p>You are not supposed to see this. If you do, please contact administrators.</p>
            </ActivationCard>
        </Page>
    )
}

export default AuthAction;
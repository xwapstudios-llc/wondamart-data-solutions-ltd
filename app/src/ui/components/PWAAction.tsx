import React, {useState} from "react";
import {cn} from "@/cn/lib/utils.ts";
import {Button} from "@/cn/components/ui/button.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {registerSW} from "virtual:pwa-register";
import {ArrowDown} from "lucide-react";
import Code from "@/ui/components/typography/Code.tsx";

type PWAActionProps = React.HTMLAttributes<HTMLDivElement>;
const PWAAction: React.FC<PWAActionProps> = ({className, ...props}) => {
    const {deferAppInstallReady, setDeferAppInstallReady, setAppNeedUpdate, appNeedUpdate} = useAppStore();
    const [clicked, setClicked] = useState(false);

    const updateApp = registerSW({
        onNeedRefresh: () => {
            setAppNeedUpdate(true)
        }
    });

    const installApp = () => {
        deferAppInstallReady.prompt();
        deferAppInstallReady.userChoice.then((choiceResult: { outcome: string; }) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            }
            setDeferAppInstallReady(null);
        });
        setClicked(false);
    }

    if (deferAppInstallReady || appNeedUpdate)
    return (
        <div className={cn("flex items-center justify-center gap-4", className)} {...props}>
            {
                deferAppInstallReady && (
                    <Button onClick={() => {
                        setClicked(true);
                        installApp()
                    }}>
                        {
                            !clicked ? (
                                <span>Install Wondamart</span>
                            ) : (
                                <span className={"flex gap-2"}>
                                    Click <Code>ok</Code> or <Code>install</Code>
                                    <ArrowDown className={"animate-bounce"} />
                                </span>
                            )
                        }
                    </Button>
                )
            }
            {
                appNeedUpdate && (
                    <Button onClick={async () => {
                        await updateApp(true);
                        setAppNeedUpdate(false)
                    }}>Restart App to update Wondamart</Button>
                )
            }
        </div>
    )
}

export default PWAAction;
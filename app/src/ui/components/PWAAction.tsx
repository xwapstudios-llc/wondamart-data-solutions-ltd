import React from "react";
import {cn} from "@/cn/lib/utils.ts";
import {Button} from "@/cn/components/ui/button.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {registerSW} from "virtual:pwa-register";

type PWAActionProps = React.HTMLAttributes<HTMLDivElement>;
const PWAAction: React.FC<PWAActionProps> = ({className, ...props}) => {
    const {deferAppInstallReady, setDeferAppInstallReady, setAppNeedUpdate, appNeedUpdate} = useAppStore();
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
    }

    if (deferAppInstallReady || appNeedUpdate)
    return (
        <div className={cn("flex items-center justify-center gap-4", className)} {...props}>
            {
                deferAppInstallReady && (
                    <Button onClick={installApp}>Install Wondamart Data Solutions</Button>
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
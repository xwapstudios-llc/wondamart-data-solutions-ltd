import React, {useEffect} from "react";
import {auth} from "@common/lib/auth.ts";
import {useLocation, useNavigate} from "react-router-dom";
import R from "@/routes.ts";
import {useAppStore} from "@/lib/useAppStore.ts";

type BasePageProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const Page: React.FC<BasePageProps> = ({children, className, ...props}) => {
    const navigate = useNavigate();
    const path = useLocation();
    const {claims} = useAppStore();

    useEffect(() => {
        // If path = / returns early
        if (path.pathname === "/") return;

        // Try to refresh token and check admin status
        auth.authStateReady().then(async () => {
            if (claims) {
                // Check if user is admin
                if (!claims.isAdmin) {
                    await auth.signOut();
                    console.warn("Authenticated user is not an admin. Redirecting to login.");
                    navigate(R.login);
                }
            } else {
                console.warn("No authenticated user found for token refresh.");
                navigate(R.login);
            }
        });

    }, [navigate, path, claims]);

    return (
        <main className={`${className}`} {...props}>
            {children}
        </main>
    )
}

export default Page;
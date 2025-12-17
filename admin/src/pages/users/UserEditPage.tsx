import React, {useEffect, useState} from "react";
import {cn} from "@/cn/lib/utils.ts";
import Page from "@/ui/components/page/Page.tsx";
import PageHeader from "@/ui/components/page/PageHeader.tsx";
import PageContent from "@/ui/components/page/PageContent.tsx";
import {useNavigate, useParams} from "react-router-dom";
import type {UserInfoDocument, UserWalletDocument} from "@common/types/user.ts";
import {AdminUser} from "@common/admin-api/user.ts";
import {ClUser} from "@common/client-api/user.ts";
import UpdateUserForm from "@/ui/forms/UpdateUserForm.tsx";
import R from "@/routes.ts";

type UserEditPageProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const UserEditPage: React.FC<UserEditPageProps> = ({className, ...props}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfoDocument | undefined>();
    const [wallet, setWallet] = useState<UserWalletDocument | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const info = await AdminUser.readInfo(id);
                if (info) setUserInfo(info);
                const w = await AdminUser.readWallet?.(id as string) ?? await ClUser.readWallet(id);
                if (w) setWallet(w as UserWalletDocument);
            } catch (err) {
                console.error(err);
                setError(String(err));
            } finally {
                setLoading(false);
            }
        }

        fetchUser().then(() => {
            setLoading(false);
        });
    }, [id]);

    return (
        <Page className={cn("", className)} {...props}>
            <PageHeader>
                {
                    id && <p className={"text-center font-medium p-2 bg-muted text-muted-foreground"}>
                        {id}
                    </p>
                }
            </PageHeader>
            <PageContent className={"h-full"}>
                {
                    error && <p className={"text-destructive p-8"}>
                        {error}
                    </p>
                }

                {
                    (userInfo && !loading) ? (
                        <UpdateUserForm user={userInfo} wallet={wallet} onDoneCallback={() => navigate(R.users)} />
                    ) : (
                        <div className={"w-full h-40 rounded-lg bg-muted/40 flex items-center justify-center"}>
                            {loading ? "Loading user..." : "No user found"}
                        </div>
                    )
                }
            </PageContent>
        </Page>
    )
}

export default UserEditPage;
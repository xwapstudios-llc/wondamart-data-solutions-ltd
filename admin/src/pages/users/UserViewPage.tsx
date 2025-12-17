import React, {useEffect, useState} from "react";
import Page from "@/ui/components/page/Page.tsx";
import PageHeader from "@/ui/components/page/PageHeader.tsx";
import PageContent from "@/ui/components/page/PageContent.tsx";
import {cn} from "@/cn/lib/utils.ts";
import {useNavigate, useParams} from "react-router-dom";
import {AdminUser} from "@common/admin-api/user.ts";
import type {UserInfoDocument} from "@common/types/user.ts";
import {Skeleton} from "@/cn/components/ui/skeleton.tsx";
import UserViewCard from "@/ui/components/UserViewCard.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import R from "@/routes.ts";
import {Loader2Icon, PenIcon} from "lucide-react";

type UserViewPageProps = React.HtmlHTMLAttributes<HTMLDivElement>;
const UserViewPage: React.FC<UserViewPageProps> = ({className, children, ...props}) => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [userInfo, setUserInfo] = useState<UserInfoDocument | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBundle = () => {
            if (!id) return;

            setLoading(true);
            AdminUser.readInfo(id)
                .then(info => {
                    if (info) setUserInfo(info);
                })
                .catch(err => {
                    console.error(err);
                    setError(String(err));
                })
                .finally(() => setLoading(false));
        }

        fetchBundle();
    }, [id]);


    return (
        <Page>
            <PageHeader className={cn("space-y-4", className)} {...props} />
            <PageContent className={"space-y-4"}>
                {
                    userInfo && !loading ? (
                        <div className={"flex flex-col gap-2"}>
                            <UserViewCard user={userInfo} detailed={true} className={"border-none border-0 shadow-lg"}/>
                            <Button onClick={() => navigate(R.userEdit(userInfo.id))}>
                                <PenIcon/>
                                Edit User
                            </Button>
                        </div>
                    ) : (
                        <Skeleton className={"w-full h-64 rounded-lg flex items-center justify-center"}>
                            <Loader2Icon className={"animate-spin"} size={44}/>
                        </Skeleton>
                    )
                }
                {
                    error && <p className={"text-destructive p-8"}>
                        {error}
                    </p>
                }
                <div className={"space-y-4"}>
                    <div>
                        <h3 className={"font-semibold"}>Amount Sold</h3>
                        <Skeleton className={"w-full h-40 rounded-lg"}/>
                    </div>
                    <div>
                        <h3 className={"font-semibold"}>Commission Earned</h3>
                        <Skeleton className={"w-full h-40 rounded-lg"}/>
                    </div>
                    <div>
                        <h3 className={"font-semibold"}>Users Registered</h3>
                        <Skeleton className={"w-full h-40 rounded-lg"}/>
                    </div>
                </div>
                {children}
            </PageContent>
        </Page>
    )
}

export default UserViewPage;
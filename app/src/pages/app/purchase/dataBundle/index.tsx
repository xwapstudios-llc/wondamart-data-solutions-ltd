import React from 'react';
import PageHeading from "@/ui/page/PageHeading";
import PageSubHeading from "@/ui/page/PageSubHeading";
import Page from "@/ui/page/Page";
import {Outlet, useLocation, useNavigate, useOutlet} from "react-router-dom";
import WondaButton from "@/ui/components/buttons/WondaButton";
import {R} from "@/app/routes";
import {useSidebar} from "@/cn/components/ui/sidebar";

const DataBundleIndex: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const outlet = useOutlet();
    const {isMobile} = useSidebar();

    return (
        <Page className={"space-y-4"}>
            <div>
                <PageHeading>Data Bundles</PageHeading>
                <PageSubHeading>Choose a network and bundle.</PageSubHeading>
            </div>
            <div className={`flex gap-4 justify-between ${!isMobile && "max-w-2xl"}`}>
                <WondaButton
                    className={location.pathname === R.app.purchase.dataBundle.mtn ? "outline-2 outline-mtn outline-offset-4 rounded-md" : ""}
                    imgSrc={"/network/mtn.png"} size={80}
                    onClick={() => navigate(R.app.purchase.dataBundle.mtn, {replace: true})}
                />
                <WondaButton
                    className={location.pathname === R.app.purchase.dataBundle.telecel ? "outline-2 outline-telecel outline-offset-4 rounded-md" : ""}
                    imgSrc={"/network/telecel.png"} size={80}
                    onClick={() => navigate(R.app.purchase.dataBundle.telecel, {replace: true})}
                />
                <WondaButton
                    className={location.pathname === R.app.purchase.dataBundle.airtelTigo ? "outline-2 outline-airteltigo outline-offset-4 rounded-md" : ""}
                    imgSrc={"/network/airteltigo.png"} size={80}
                    onClick={() => navigate(R.app.purchase.dataBundle.airtelTigo, {replace: true})}
                />
            </div>
            {
                outlet ? <Outlet/> : <div>
                    <p className={"mt-8 text-muted-foreground"}>Please select a network to view available data
                        bundles.</p>
                </div>
            }
        </Page>
    );
};

export default DataBundleIndex;


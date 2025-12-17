import "./app.css";

// Routes
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {R} from "@/app/routes.ts";

// Pages
// Auth
import LoginPage from "@/pages/LoginPage.tsx";
import NotFoundPage from "@/pages/NotFoundPage.tsx";
import SignupPage from "@/pages/SignupPage.tsx";

import VerifyEmailPage from "@/pages/auth/VerifyEmailPage.tsx";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage.tsx";


import UserLayout from "@/ui/layouts/UserLayout";

import Dashboard from "@/pages/app/dashboard";

// Purchases
import PurchaseIndex from "@/pages/app/purchase/index";
import DataBundleIndex from "@/pages/app/purchase/dataBundle/index";
import DataBundleMTN from "@/pages/app/purchase/dataBundle/mtn";
import DataBundleTelecel from "@/pages/app/purchase/dataBundle/telecel";
import DataBundleAirtelTigo from "@/pages/app/purchase/dataBundle/airtelTigo";
import AfaBundlePurchase from "@/pages/app/purchase/afaBundle";
import ResultCheckerPurchase from "@/pages/app/purchase/resultChecker";

// History
import HistoryIndex from "@/pages/app/history/index";
import HistoryPurchases from "@/pages/app/history/purchases/index";
import HistoryDataBundles from "@/pages/app/history/purchases/dataBundles";
import HistoryAfaBundles from "@/pages/app/history/purchases/afaBundles";
import HistoryResultCheckers from "@/pages/app/history/purchases/resultCheckers";
import HistoryPurchaseDetail from "@/pages/app/history/purchases/DetailPage";
import HistoryDeposits from "@/pages/app/history/deposits/index";
import HistoryDepositDetail from "@/pages/app/history/deposits/DetailPage";

// Deposit
import Deposit from "@/pages/app/deposit/index";

// Commissions
import CommissionsIndex from "@/pages/app/commissions/index";
import CommissionsDetail from "@/pages/app/commissions/DetailPage";

// Notifications
import NotificationsPage from "@/pages/app/notifications/index";

// User
import UserIndex from "@/pages/app/user/index";
import UserProfile from "@/pages/app/user/profile";
import UserActivate from "@/pages/app/user/activate";
import UserSettings from "@/pages/app/user/settings/index";
import UserSettingsGeneral from "@/pages/app/user/settings/general";
import UserSettingsAccount from "@/pages/app/user/settings/account";
import UserSettingsSecurity from "@/pages/app/user/settings/security";
import {ThemeProvider} from "@/cn/components/theme/theme-provider.tsx";
import RegisterAgent from "@/pages/app/RegisterAgent.tsx";


const App = () => {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="wondamart-app-ui-theme">
            <BrowserRouter>
                <Routes>
                    {/*Login Page as default index page*/}
                    <Route index path={R.index} element={<LoginPage/>}/>
                    <Route path={R.login} element={<LoginPage/>}/>
                    {/*Signup or register page*/}
                    <Route path={R.signup} element={<SignupPage/>}/>

                    {/*Routes group for authentications*/}
                    <>
                        <Route path={R.auth.verifyEmail} element={<VerifyEmailPage/>}/>
                        <Route path={R.auth.forgotPassword} element={<ForgotPasswordPage/>}/>
                        <Route path={R.auth.resetPassword} element={<ResetPasswordPage/>}/>
                    </>

                    {/*Routes group for user*/}
                    <Route path={R.app.index} element={<UserLayout/>}>
                        {/* Dashboard */}
                        <Route index path={R.app.index} element={<Dashboard/>}/>
                        <Route path={R.app.dashboard} element={<Dashboard/>}/>

                        {/* Purchases */}
                        <Route path={R.app.purchase.index} element={<PurchaseIndex/>}/>

                        <Route path={R.app.purchase.dataBundle.index} element={<DataBundleIndex/>}>
                            <Route path={R.app.purchase.dataBundle.mtn} element={<DataBundleMTN/>}/>
                            <Route path={R.app.purchase.dataBundle.telecel} element={<DataBundleTelecel/>}/>
                            <Route path={R.app.purchase.dataBundle.airtelTigo} element={<DataBundleAirtelTigo/>}/>
                        </Route>

                        <Route path={R.app.purchase.afaBundle} element={<AfaBundlePurchase/>}/>
                        <Route path={R.app.purchase.resultChecker} element={<ResultCheckerPurchase/>}/>

                        {/*Register Agent*/}
                        <Route path={R.app.registerAgent} element={<RegisterAgent/>}/>

                        {/* History */}
                        <Route path={R.app.history.index} element={<HistoryIndex/>}/>
                        <Route path={R.app.history.purchases.index} element={<HistoryPurchases/>}/>
                        <Route path={R.app.history.purchases.dataBundles} element={<HistoryDataBundles/>}/>
                        <Route path={R.app.history.purchases.afaBundles} element={<HistoryAfaBundles/>}/>
                        <Route path={R.app.history.purchases.resultCheckers} element={<HistoryResultCheckers/>}/>
                        <Route path={R.app.history.purchases.id(":id")} element={<HistoryPurchaseDetail/>}/>
                        <Route path={R.app.history.deposits.index} element={<HistoryDeposits/>}/>
                        <Route path={R.app.history.deposits.id(":id")} element={<HistoryDepositDetail/>}/>

                        {/* Deposit */}
                        <Route path={R.app.deposit} element={<Deposit/>}/>

                        {/* Commissions */}
                        <Route path={R.app.commissions.index} element={<CommissionsIndex/>}/>
                        <Route path={R.app.commissions.id(":id")} element={<CommissionsDetail/>}/>

                        {/* Notifications */}
                        <Route path={R.app.notifications} element={<NotificationsPage/>}/>

                        {/* User */}
                        <Route path={R.app.user.index} element={<UserIndex/>}/>
                        <Route path={R.app.user.profile} element={<UserProfile/>}/>
                        <Route path={R.app.user.activate} element={<UserActivate/>}/>
                        <Route path={R.app.user.settings.index} element={<UserSettings/>}/>
                        <Route path={R.app.user.settings.general} element={<UserSettingsGeneral/>}/>
                        <Route path={R.app.user.settings.account} element={<UserSettingsAccount/>}/>
                        <Route path={R.app.user.settings.security} element={<UserSettingsSecurity/>}/>

                        {/*Not found page*/}
                        <Route path={"*"} element={<NotFoundPage/>}/>
                    </Route>

                    {/*Not Found Page*/}
                    <Route path={"*"} element={<NotFoundPage/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
import { lazy, Suspense } from "react";
import "./app.css";

// Routes
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {R} from "@/app/routes.ts";

// Lazy load pages
const LoginPage = lazy(() => import("@/pages/LoginPage.tsx"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.tsx"));
const SignupPage = lazy(() => import("@/pages/SignupPage.tsx"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage.tsx"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage.tsx"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage.tsx"));
const OTPPage = lazy(() => import("@/pages/auth/OTPPage.tsx"));
const UserLayout = lazy(() => import("@/ui/layouts/UserLayout"));
const Dashboard = lazy(() => import("@/pages/app/dashboard"));
const PurchaseIndex = lazy(() => import("@/pages/app/purchase/index"));
const DataBundleIndex = lazy(() => import("@/pages/app/purchase/dataBundle/index"));
const DataBundleMTN = lazy(() => import("@/pages/app/purchase/dataBundle/mtn"));
const DataBundleTelecel = lazy(() => import("@/pages/app/purchase/dataBundle/telecel"));
const DataBundleAirtelTigo = lazy(() => import("@/pages/app/purchase/dataBundle/airtelTigo"));
const AfaBundlePurchase = lazy(() => import("@/pages/app/purchase/afaBundle"));
const ResultCheckerPurchase = lazy(() => import("@/pages/app/purchase/resultChecker"));
const HistoryIndex = lazy(() => import("@/pages/app/history/index"));
const HistoryDetail = lazy(() => import("@/pages/app/history/DetailPage.tsx"));
const Deposit = lazy(() => import("@/pages/app/deposit/index"));
const CommissionsIndex = lazy(() => import("@/pages/app/commissions/index"));
const CommissionsDetail = lazy(() => import("@/pages/app/commissions/DetailPage"));
const NotificationsPage = lazy(() => import("@/pages/app/notifications/index"));
const UserIndex = lazy(() => import("@/pages/app/user/index"));
const UserProfile = lazy(() => import("@/pages/app/user/profile"));
const UserActivate = lazy(() => import("@/pages/app/user/activate"));
const UserSettings = lazy(() => import("@/pages/app/user/settings/index"));
const UserSettingsGeneral = lazy(() => import("@/pages/app/user/settings/general"));
const UserSettingsAccount = lazy(() => import("@/pages/app/user/settings/account"));
const UserSettingsSecurity = lazy(() => import("@/pages/app/user/settings/security"));
const RegisterAgent = lazy(() => import("@/pages/app/RegisterAgent.tsx"));

import {ThemeProvider} from "@/cn/components/theme/theme-provider.tsx";
import {Toaster} from "@/cn/components/ui/sonner.tsx";
import OnErrorCard from "@/ui/components/cards/OnErrorCard.tsx";

// Loading component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);


const App = () => {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="wondamart-app-ui-theme">
            <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                    {/*Login Page as default index page*/}
                    <Route index path={R.index} element={<LoginPage/>}/>
                    <Route path={R.login} element={<LoginPage/>}/>
                    {/*Signup or register page*/}
                    <Route path={R.signup} element={<SignupPage/>}/>

                    {/*Routes group for authentications*/}
                    <>
                        <Route path={R.auth.verifyEmail(":email")} element={<VerifyEmailPage/>}/>
                        <Route path={R.auth.forgotPassword} element={<ForgotPasswordPage/>}/>
                        <Route path={R.auth.resetPassword} element={<ResetPasswordPage/>}/>
                        <Route path={R.auth.otp(":txID")} element={<OTPPage/>} />
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
                        <Route path={R.app.history.id(":id")} element={<HistoryDetail/>}/>

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
                </Suspense>
            </BrowserRouter>
            <Toaster />
            <OnErrorCard />
        </ThemeProvider>
    );
}

export default App;
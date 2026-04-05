import {lazy, Suspense, useEffect} from "react";
import "./app.css";

// Routes
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {R} from "@/app/routes.ts";
import {ThemeProvider} from "@/cn/components/theme/theme-provider.tsx";
import {Toaster} from "@/cn/components/ui/sonner.tsx";
import OnErrorCard from "@/ui/components/cards/OnErrorCard.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";

// Lazy load pages
const LoginPage = lazy(() => import("@/pages/LoginPage.tsx"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.tsx"));
const UserLayout = lazy(() => import("@/ui/layouts/UserLayout"));
const Dashboard = lazy(() => import("@/pages/app/dashboard"));

// Purchase pages
const AgentStorePage = lazy(() => import("@/pages/app/agent-store"));
const CommissionsPage = lazy(() => import("@/pages/app/commissions"));

// Stock pages
const StockPage = lazy(() => import("@/pages/app/stock"));
const StockBundlesPage = lazy(() => import("@/pages/app/stock/bundles"));
const StockAFAPage = lazy(() => import("@/pages/app/stock/afa"));
const StockCheckerPage = lazy(() => import("@/pages/app/stock/checker"));

// Other pages
const SettingsPage = lazy(() => import("@/pages/app/settings"));
const TransactionsPage = lazy(() => import("@/pages/app/transactions"));
const UsersPage = lazy(() => import("@/pages/app/users"));

// Loading component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full size-16 border-b-2 border-primary"></div>
    </div>
);

const App = () => {
    const {setDeferAppInstallReady} = useAppStore();
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferAppInstallReady(e);
        });
    }, []);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="wondamart-app-ui-theme">
            <BrowserRouter>
                <Suspense fallback={<PageLoader/>}>
                    <Routes>
                        {/*Login Page as default index page*/}
                        <Route index path={R.index} element={<LoginPage/>}/>
                        <Route path={R.login} element={<LoginPage/>}/>


                        {/*Routes group for user*/}
                        <Route path={R.app.index} element={<UserLayout/>}>
                            {/* Dashboard */}
                            <Route index path={R.app.index} element={<Dashboard/>}/>
                            <Route path={R.app.dashboard} element={<Dashboard/>}/>

                            {/* Agent Store */}
                            <Route path={R.app.agentStore} element={<AgentStorePage/>}/>

                            {/* Commissions */}
                            <Route path={R.app.commissions.index} element={<CommissionsPage/>}/>

                            {/* Settings */}
                            <Route path={R.app.settings} element={<SettingsPage/>}/>

                            {/* Stock */}
                            <Route path={R.app.stock.index} element={<StockPage/>}/>
                            <Route path={R.app.stock.bundles} element={<StockBundlesPage/>}/>
                            <Route path={R.app.stock.afa} element={<StockAFAPage/>}/>
                            <Route path={R.app.stock.checker} element={<StockCheckerPage/>}/>

                            {/* Transactions */}
                            <Route path={`${R.app.transactions.index}/:type?`} element={<TransactionsPage/>}/>

                            {/* Users */}
                            <Route path={R.app.users} element={<UsersPage/>}/>

                            {/*Not found page*/}
                            <Route path={"*"} element={<NotFoundPage/>}/>
                        </Route>

                        {/*Not Found Page*/}
                        <Route path={"*"} element={<NotFoundPage/>}/>
                    </Routes>
                </Suspense>
            </BrowserRouter>
            <Toaster/>
            <OnErrorCard/>
        </ThemeProvider>
    );
}

export default App;
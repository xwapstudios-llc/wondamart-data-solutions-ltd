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
                        {/*Signup or register page*/}

                        {/*Routes group for user*/}
                        <Route path={R.app.index} element={<UserLayout/>}>
                            {/* Dashboard */}
                            <Route index path={R.app.index} element={<Dashboard/>}/>
                            <Route path={R.app.dashboard} element={<Dashboard/>}/>

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
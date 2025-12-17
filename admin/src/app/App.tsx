import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import R from "@/routes.ts";
import HomePage from "@/pages/HomePage.tsx";
import BundlesPage from "@/pages/bundle/BundlesPage.tsx";
import CommissionsPage from "@/pages/CommissionsPage.tsx";
import UsersPage from "@/pages/users/UsersPage.tsx";
import SettingsPage from "@/pages/SettingsPage.tsx";
import AccountsPage from "@/pages/AccountsPage.tsx";
import LoginPage from "@/app/LoginPage.tsx";
import BundleViewPage from "@/pages/bundle/BundleViewPage.tsx";
import BundleEditPage from "@/pages/bundle/BundleEditPage.tsx";
import NotFoundPage from "@/pages/NotFoundPage.tsx";
import UserViewPage from "@/pages/users/UserViewPage.tsx";
import UserEditPage from "@/pages/users/UserEditPage.tsx";
import TxPage from "@/pages/tx/TxPage.tsx";
import TxViewPage from "@/pages/tx/TxViewPage.tsx";

const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route index path={R.login} element={<LoginPage/>} />
                <Route path={R.dashboard} element={<HomePage/>} />

                {/*Bundle*/}
                <Route path={R.bundles} element={<BundlesPage/>} />
                <Route path={"/bundle"} element={<BundlesPage/>} />
                <Route path={R.bundle()} element={<BundleViewPage />} />
                <Route path={R.bundleEdit()} element={<BundleEditPage />} />

                {/*Users*/}
                <Route path={R.users} element={<UsersPage/>} />
                <Route path={"/user"} element={<UsersPage/>} />
                <Route path={R.user()} element={<UserViewPage />} />
                <Route path={R.userEdit()} element={<UserEditPage />} />

                {/*Tx*/}
                <Route path={R.transactions} element={<TxPage/>} />
                <Route path={"/tx"} element={<TxPage/>} />
                <Route path={R.tx()} element={<TxViewPage />} />

                <Route path={R.commissions} element={<CommissionsPage/>} />
                <Route path={R.settings} element={<SettingsPage/>} />
                <Route path={R.accounts} element={<AccountsPage/>} />

                <Route path={"*"} element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
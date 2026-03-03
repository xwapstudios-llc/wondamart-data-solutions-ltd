import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {R} from "@/app/routes.ts";
import Dashboard from "@/root/Dashboard.tsx";
import LoginPage from "@/root/LoginPage.tsx";
import NotFoundPage from "@/root/NotFoundPage.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index path={R.login} element={<LoginPage/>} />
                <Route path={R.dashboard} element={<Dashboard/>} />

                <Route path={"*"} element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
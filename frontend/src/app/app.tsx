import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./auth/signup";
import { Provider } from "react-redux";
import { store } from "@modules/reducers";
import SignIn from "./auth/signin";
import { Suspense, lazy } from "react";
import MainP from "./mainp/mainp";
import ErrorPage from "@modules/components/errorPage";

const LazyHome = lazy(() => import("./mainp/home"));

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainP />} index />
                    <Route path="/auth/signup" element={<SignUp />} />
                    <Route path="/auth/signin" element={<SignIn />} />
                    <Route
                        path="/home"
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <LazyHome />
                            </Suspense>
                        }
                    />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
};

export default App;

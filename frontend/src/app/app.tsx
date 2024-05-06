import dayjs  from "dayjs";
import utc from 'dayjs/plugin/utc';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./auth/signup";
import { Provider } from "react-redux";
import { store } from "@modules/reducers";
import SignIn from "./auth/signin";
import { Suspense, lazy } from "react";
import MainP from "./mainp/mainp";
import ErrorPage from "@modules/components/errorPage";
import Layout from "@modules/components/layout";
import AddPost from "./post/add.post";

const LazyHome = lazy(() => import("./mainp/home"));

dayjs.extend(utc);

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
                    <Route path="/post/new" element={<AddPost />} />
                    <Route path="*" element={
                        <Layout>
                            <ErrorPage>
                                <p className="lead">
                                    The page you are looking for might have been removed, had
                                    its name changed, or is temporarily unavailable.
                                </p>
                            </ErrorPage>
                        </Layout>
                    } />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
};

export default App;

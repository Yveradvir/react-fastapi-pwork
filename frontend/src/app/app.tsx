import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Layout from "@modules/components/layout";
import ErrorPage from "@modules/components/errorPage";
import MainP from "./mainp/mainp";
import SignUp from "./auth/signup";
import SignIn from "./auth/signin";
import AddPost from "./post/add.post";
import AddGroup from "./group/add.group";
import { useAppSelector, useAppDispatch } from "@modules/reducers";
import cookies from "@modules/utils/cookies";
import { getProfile } from "@modules/reducers/profile.slice";

const LazyHome = lazy(() => import("./mainp/home"));
const LazyMyGroups = lazy(() => import("./group/my.group"));
const LazyAllGroups = lazy(() => import("./group/all.group"));
const LazySingleGroup = lazy(() => import("./group/single.group"));
const LazySinglePost = lazy(() => import("./post/single.post"));

dayjs.extend(utc);

const LazyElement: React.FC<{ Lazy: React.LazyExoticComponent<React.FC> }> = ({
    Lazy,
}) => (
    <Suspense fallback={<div>Loading...</div>}>
        <Lazy />
    </Suspense>
);

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const profile = useAppSelector((state) => state.profile);

    if (
        cookies.get("refresh_csrf") &&
        !profile.profile
    )
        dispatch(getProfile());

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainP />} index />
                <Route path="/auth/signup" element={<SignUp />} />
                <Route path="/auth/signin" element={<SignIn />} />
                <Route path="/home" element={<LazyElement Lazy={LazyHome} />} />
                <Route path="/post/new" element={<AddPost />} />
                <Route path="/group/new" element={<AddGroup />} />
                <Route
                    path="/group/my"
                    element={<LazyElement Lazy={LazyMyGroups} />}
                />
                <Route
                    path="/group/"
                    element={<LazyElement Lazy={LazyAllGroups} />}
                />
                <Route
                    path="/group/:group_id"
                    element={<LazyElement Lazy={LazySingleGroup} />}
                />
                <Route
                    path="/group/:group_id/:post_id"
                    element={<LazyElement Lazy={LazySinglePost} />}
                />
                <Route
                    path="*"
                    element={
                        <Layout>
                            <ErrorPage>
                                <p className="lead">
                                    The page you are looking for might have been
                                    removed, had its name changed, or is
                                    temporarily unavailable.
                                </p>
                            </ErrorPage>
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

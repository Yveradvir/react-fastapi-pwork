import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainP from "./mainp/mainp";
import NotFoundPage from "@modules/components/p404";
import SignUp from "./auth/signup";
import { Provider } from "react-redux";
import { store } from "@modules/reducers";
import SignIn from "./auth/signin";

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainP/>} index/>
                    <Route path="/auth/signup" element={<SignUp/>} index/>
                    <Route path="/auth/signin" element={<SignIn/>} index/>
                    <Route path="*" element={<NotFoundPage/>} index/>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}
 
export default App;
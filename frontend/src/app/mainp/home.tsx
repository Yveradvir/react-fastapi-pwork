import Layout from "@modules/components/layout"
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { getProfile } from "@modules/reducers/profile.slice";
import { useEffect } from "react";

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const selector = useAppSelector((state) => state);

    useEffect(() => {
        let is_ignore = false;

        if (!is_ignore) {
            if (selector.profile.error || !selector.profile.profile) {
                const _ = async () => dispatch(getProfile());
                _();
            }
        }

        return () => {
            console.log(selector);
            is_ignore = true;
        }
    }, [dispatch, selector])
    

    return (
        <Layout>
            <h1>sas</h1>
        </Layout>
    );
}

export default Home;
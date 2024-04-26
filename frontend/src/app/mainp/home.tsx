import ErrorPage from "@modules/components/errorPage";
import Layout from "@modules/components/layout";
import ProfileImage from "@modules/components/profileimage";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { LoadingStatus } from "@modules/reducers/main";
import { getProfile } from "@modules/reducers/profile.slice";
import { useEffect } from "react";
import { Card, Row } from "react-bootstrap";

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const { profile, loadingStatus, error } = useAppSelector((state) => state.profile);

    useEffect(() => {
        if (loadingStatus === LoadingStatus.NotLoaded) {
            dispatch(getProfile());
        }
    }, [dispatch, loadingStatus]);

    return (
        <Layout>
            {error ? (
                <ErrorPage 
                    status_code={error.status_code}
                    initial_message={error.detail}
                />
            ) : (
                profile && (
                    <Card>
                        <Row>
                            <ProfileImage uid={profile.id as string} />
                        </Row>
                        <Row>
                            <h1>Welcome, {profile.first_name} {profile.last_name}</h1>
                        </Row>
                    </Card>
                )
            )}
        </Layout>
    );
}

export default Home;

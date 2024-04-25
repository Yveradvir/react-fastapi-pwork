import Layout from "@modules/components/layout"
import ProfileImage from "@modules/components/profileimage";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { getProfile } from "@modules/reducers/profile.slice";
import { useEffect } from "react";
import { Card, Row } from "react-bootstrap";

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const selector = useAppSelector((state) => state);

    const profile = selector.profile.profile

    useEffect(() => {
        let is_ignore = false;

        if (!is_ignore) {
            if (selector.profile.error || !selector.profile.profile) {
                const _ = async () => dispatch(getProfile());
                _();
            }
        }

        return () => {
            is_ignore = true;
        }
    }, [dispatch, selector])
    

    return (
        <Layout>
            <Card>
                <Row>
                    <ProfileImage uid={profile?.id as string} />
                </Row>
                <Row>
                    <h1>Welcome, {profile?.first_name} {profile?.last_name}</h1>
                </Row>
            </Card>
        </Layout>
    );
}

export default Home;
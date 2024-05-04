import ErrorPage from "@modules/components/errorPage";
import Layout from "@modules/components/layout";
import ProfileImage from "@modules/components/profileimage";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { LoadingStatus } from "@modules/reducers/main";
import { getProfile } from "@modules/reducers/profile.slice";
import { useEffect } from "react";
import { Card, Grid, Typography } from "@mui/material";

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
                        <Grid container spacing={2} className="m-2" alignItems="center">
                            <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
                                <ProfileImage uid={profile.id as string} w={100} h={100} />
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="h4">
                                    Welcome, {profile.first_name} {profile.last_name}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                )
            )}
        </Layout>
    );
}

export default Home;
 
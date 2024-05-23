import ErrorPage from "@modules/components/errorPage";
import Layout from "@modules/components/layout";
import ProfileImage from "@modules/components/profileimage";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { LoadingStatus } from "@modules/reducers/main";
import { getProfile } from "@modules/reducers/profile.slice";
import { useEffect, useState } from "react";
import { Button, Card, Grid, Paper, Typography } from "@mui/material";
import DeleteBtn from "@modules/components/deleteBtn";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showToken, setShowToken] = useState(false);
    const { profile, loadingStatus, error } = useAppSelector((state) => state.profile);

    useEffect(() => {
        if (loadingStatus === LoadingStatus.ANotLoaded) {
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
                                <Grid>
                                    <DeleteBtn
                                        label="Delete an account"
                                        url={`/profile/single/${profile.id}`}
                                        callback={() => {navigate("/auth/signin")}}
                                    />
                                    <Button
                                        variant="contained"
                                        color="info"
                                        onClick={() => {setShowToken(!showToken)}}
                                    >
                                        {showToken ? "Show" : "Hide"} token
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        {showToken && (
                            <Paper>
                                <Typography>Your secret token:</Typography>
                                <Typography>{profile.api_key}</Typography>
                            </Paper>
                        )}
                    </Card>
                )
            )}
        </Layout>
    );
}

export default Home;
 
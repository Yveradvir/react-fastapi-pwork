import React, { useState } from "react";
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Formik, Field, ErrorMessage, Form as FForm } from "formik";
import Danger from "@modules/components/danger";
import Layout from "@modules/components/layout";
import SpinnerButton from "@modules/components/submitspinner";
import { PostSchema, PostValues } from "@modules/validations/post.vd";
import ImagePanel from "./components/imagePanel";
import Carousel from "react-material-ui-carousel";
import { useAppDispatch, store, useAppSelector } from "@modules/reducers";
import { postImagesActions } from "@modules/reducers/post_images.slice";
import PropsPanel from "./components/propsPanel";
import { useNavigate } from "react-router-dom";
import { LoadingStatus } from "@modules/reducers/main";
import { getProfileGroups } from "@modules/reducers/profile.slice";

const AddPost: React.FC = () => {
    const navigate = useNavigate();
    const { loadingStatus, profile, groups } = useAppSelector(
        (state) => state.profile
    );
    const dispatch = useAppDispatch();

    const [error, setError] = useState("");
    const initialValues: PostValues = {
        title: "",
        content: "",
        postImages: {
            main: undefined,
            second: undefined,
            third: undefined,
            fourth: undefined,
            fifth: undefined,
        },
        postProps: {
            discord_tag: undefined,
            telegram_tag: undefined,
            rank: undefined,
        },
    };
    const _postImagesKeys = ["main", "second", "third", "fourth", "fifth"];

    const onSubmitHandler = async (values: PostValues) => {
        try {
            values.postImages = store.getState().post_images.images!;
            console.log(values, store.getState().post_images.images!);
            setError("");
        } catch (error) {
            setError("Something went wrong . . .");
        }
    };

    React.useEffect(() => {
        if (loadingStatus !== LoadingStatus.Loaded) navigate("/auth/signin");
        let is_ignore = false;

        if (!is_ignore) {
            dispatch(postImagesActions.globalReset());
            dispatch(getProfileGroups(profile!.id));
        }

        return () => {
            is_ignore = true;
        };
    }, [dispatch, profile, loadingStatus, navigate]);

    return (
        <Layout needToFab={false}>
            <div className="frame">
                <Typography variant="h5" gutterBottom>
                    Add Post
                </Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={PostSchema}
                    onSubmit={onSubmitHandler}
                >
                    {({ isSubmitting }) => (
                        <FForm noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Field
                                        name="title"
                                        type="text"
                                        as={TextField}
                                        label="Title"
                                        fullWidth
                                    />
                                    <ErrorMessage name="title">
                                        {(msg) => <Danger text={msg} />}
                                    </ErrorMessage>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        name="content"
                                        type="text"
                                        as={TextField}
                                        label="Content"
                                        multiline
                                        fullWidth
                                    />
                                    <ErrorMessage name="content">
                                        {(msg) => <Danger text={msg} />}
                                    </ErrorMessage>
                                </Grid>
                                <Grid item xs={12}>
                                    <PropsPanel />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid item xs={12}>
                                        {!groups! ? (
                                            <Select>
                                                {groups!.map((key) => (
                                                    <MenuItem
                                                        key={key.uuid}
                                                        title={key.title}
                                                        value={key.uuid}
                                                    />
                                                ))}
                                            </Select>
                                        ) : (
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                            >
                                                <Typography
                                                    variant="body1"
                                                    color="textSecondary"
                                                    style={{
                                                        marginRight: "8px",
                                                    }}
                                                >
                                                    You don't have any groups
                                                    yet! Let's find you a new
                                                    one:
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {navigate("/group/")}}
                                                >
                                                    Find Group
                                                </Button>
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Carousel>
                                        {_postImagesKeys.map((key) => (
                                            <ImagePanel name={key} key={key} />
                                        ))}
                                    </Carousel>
                                </Grid>
                            </Grid>
                            <SpinnerButton
                                type="submit"
                                text="Add Post"
                                isSubmitting={isSubmitting}
                            />
                            {error && <Danger text={error} />}
                        </FForm>
                    )}
                </Formik>
            </div>
        </Layout>
    );
};

export default AddPost;

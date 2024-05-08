import React, { useState } from "react";
import { Grid, TextField, Typography } from "@mui/material";
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

const AddPost: React.FC = () => {
    const navigate = useNavigate();
    const { loadingStatus, profile } = useAppSelector(state => state.profile)
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
            fifth: undefined
        },
        postProps: {
            discord_tag: undefined,
            telegram_tag: undefined,
            rank: undefined
        }
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
        if (loadingStatus !== LoadingStatus.Loaded) navigate("/auth/signin")
        let is_ignore = false;

        if (!is_ignore) {
            dispatch(postImagesActions.globalReset())

            const _ = async () => {

            }

            _();
        }
        
        return () => {
            is_ignore = true;
        }
    }, [dispatch, profile, loadingStatus, navigate])

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

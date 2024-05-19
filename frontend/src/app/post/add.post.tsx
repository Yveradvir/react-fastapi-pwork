import React, { useState, useEffect } from "react";
import { Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Formik, Field, ErrorMessage, Form as FForm, FormikHelpers } from "formik";
import Danger from "@modules/components/danger";
import Layout from "@modules/components/layout";
import SpinnerButton from "@modules/components/submitspinner";
import { PostSchema, PostValues } from "@modules/validations/post.vd";
import ImagePanel from "./components/imagePanel";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";
import { store, useAppDispatch, useAppSelector } from "@modules/reducers";
import { postImagesActions } from "@modules/reducers/post_images.slice";
import { getProfileGroups } from "@modules/reducers/profile.slice";
import PropsPanel from "./components/propsPanel";
import { LoadingStatus } from "@modules/reducers/main";
import { LaunchedAxios } from "@modules/api/api";

const AddPost: React.FC = () => {
    const navigate = useNavigate();
    const { loadingStatus, profile, groups } = useAppSelector(state => state.profile);
    const dispatch = useAppDispatch();

    const [error, setError] = useState("");
    const initialValues: PostValues = {
        title: "",
        content: "",
        postImages: {
            main: "",
            second: "",
            third: "",
            fourth: "",
            fifth: "",
        },
        postProps: {
            discord_tag: "",
            telegram_tag: "",
            rank: "",
        },
        group_id: "",
    };
    const _postImagesKeys = ["main", "second", "third", "fourth", "fifth"];

    const onSubmitHandler = (values: PostValues, actions: FormikHelpers<PostValues>) => {
        const submitForm = async () => {
            try {
                values.postImages = { ...store.getState().post_images.images };
                console.log(values)
                const response = await LaunchedAxios.post("/post/new", values);
                
                if (response.data.ok) {
                    const sdata = response.data.subdata;
                    navigate(`/group/${sdata.group_id}/${sdata.post_id}`);
                }
            } catch (error) {
                setError("Something went wrong . . .");
            } finally {
                actions.setSubmitting(false);
            }
        };
        submitForm();
    };

    useEffect(() => {
        if ([LoadingStatus.Error, LoadingStatus.NotLoaded].includes(loadingStatus)) {
            navigate("/auth/signin");
        }

        if (profile) {
            dispatch(postImagesActions.globalReset());
            dispatch(getProfileGroups(profile.id));
        }
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
                    {({ isSubmitting, values, handleChange }) => (
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
                                    <Select
                                        name="group_id"
                                        value={values.group_id}
                                        onChange={handleChange}
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            Select any of group
                                        </MenuItem>
                                        {groups && groups.map((group) => (
                                            <MenuItem key={group.uuid} value={group.uuid}>
                                                {group.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <ErrorMessage name="group_id">
                                        {(msg) => <Danger text={msg} />}
                                    </ErrorMessage>
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

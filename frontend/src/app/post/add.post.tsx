import React, { useState } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { Formik, Field, ErrorMessage, Form as FForm } from "formik";
import Danger from "@modules/components/danger";
import Layout from "@modules/components/layout";
import SpinnerButton from "@modules/components/submitspinner";
import { PostSchema, PostValues } from "@modules/validations/post.vd";


const AddPost: React.FC = () => {
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
        }
    };
    // const _postImagesKeys = ["main", "second", "third", "fourth", "fifth"] 

    const onSubmitHandler = async (values: PostValues) => {
        try {
            console.log(values);
            setError("");
        } catch (error) {
            setError("Something went wrong . . .");
        }
    };

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
                                <Grid>

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

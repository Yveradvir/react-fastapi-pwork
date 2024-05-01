import React, { useState } from "react";
import { Grid, TextField } from "@mui/material";
import {
    Formik,
    Field,
    ErrorMessage,
    Form as FForm,
    FormikHelpers,
} from "formik";
import Danger from "@modules/components/danger";
import Layout from "@modules/components/layout";
import SpinnerButton from "@modules/components/submitspinner";
import { SignUpSchema, SignUpValues } from "@modules/validations/auth.vd";
import { LaunchedAxios } from "@modules/api/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import ImageLoader from "@modules/components/imageLoader";
import blobToBase64 from "@modules/utils/blob";
import FormikDatePicker from "@modules/components/formikdp";

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [error, setErrors] = useState("");
    const initialValues: SignUpValues = {
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        confirm_password: "",
        email: "",
        birth: "",
        profile_image: undefined,
    };

    const onSubmitHandler = (
        values: SignUpValues,
        actions: FormikHelpers<SignUpValues>
    ) => {
        actions.setSubmitting(true);

        const _ = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { confirm_password, ...body } = values;

                body.birth = new Date(body.birth).toISOString();

                if (body.profile_image && body.profile_image instanceof File) {
                    body.profile_image = await blobToBase64(
                        new Blob([body.profile_image], {
                            type: body.profile_image.type,
                        })
                    );
                }

                console.log(body);

                const response = await LaunchedAxios.post("/auth/signup", body);

                if (response.data.ok) {
                    navigate("/home");
                } else {
                    setErrors(response.data.error);
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response?.data.detail) {
                        setErrors(error.response.data.detail);
                    } else {
                        setErrors("Something went wrong . . .");
                    }
                }
            }

            actions.setSubmitting(false);
        };

        _();
    };

    return (
        <Layout>
            <Formik
                initialValues={initialValues}
                validationSchema={SignUpSchema}
                onSubmit={onSubmitHandler}
            >
                {({ isSubmitting }) => (
                    <FForm noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="first_name"
                                    type="text"
                                    as={TextField}
                                    label="First Name"
                                    fullWidth
                                />
                                <ErrorMessage name="first_name">
                                    {(msg) => <Danger text={msg} />}
                                </ErrorMessage>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="last_name"
                                    type="text"
                                    as={TextField}
                                    label="Last Name"
                                    fullWidth
                                />
                                <ErrorMessage name="last_name">
                                    {(msg) => <Danger text={msg} />}
                                </ErrorMessage>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    name="username"
                                    type="text"
                                    as={TextField}
                                    label="Username"
                                    fullWidth
                                />
                                <ErrorMessage name="username">
                                    {(msg) => <Danger text={msg} />}
                                </ErrorMessage>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    name="password"
                                    type="password"
                                    as={TextField}
                                    label="Password"
                                    fullWidth
                                />
                                <ErrorMessage name="password">
                                    {(msg) => <Danger text={msg} />}
                                </ErrorMessage>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    name="confirm_password"
                                    type="password"
                                    as={TextField}
                                    label="Confirm Password"
                                    fullWidth
                                />
                                <ErrorMessage name="confirm_password">
                                    {(msg) => <Danger text={msg} />}
                                </ErrorMessage>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    name="email"
                                    type="email"
                                    as={TextField}
                                    label="Email"
                                    fullWidth
                                />
                                <ErrorMessage name="email">
                                    {(msg) => <Danger text={msg} />}
                                </ErrorMessage>
                            </Grid>
                            <Grid item xs={12}>
                                <FormikDatePicker 
                                    field_name="birth"
                                    label="Date of your birth"
                                />
                                <ErrorMessage name="birth">
                                    {(msg) => <Danger text={msg} />}
                                </ErrorMessage>
                            </Grid>
                            <Grid item xs={12}>
                                <ImageLoader 
                                    field_name="profile_image" 
                                    label="Image of your profile"
                                />
                                <ErrorMessage name="profile_image">
                                    {(msg) => <Danger text={msg} />}
                                </ErrorMessage>
                            </Grid>
                        </Grid>
                        <SpinnerButton
                            type="submit"
                            text="Submit"
                            isSubmitting={isSubmitting}
                        />
                        {error && <Danger text={error} />}
                    </FForm>
                )}
            </Formik>
        </Layout>
    );
};

export default SignUp;

import React, { useState } from "react";
import { Grid, TextField, Typography } from "@mui/material";
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
import { SignInValues, SignInSchema } from "@modules/validations/auth.vd";
import { LaunchedAxios } from "@modules/api/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [error, setErrors] = useState("");
    const initialValues: SignInValues = {
        username: "",
        password: "",
        confirm_password: "",
    };

    const onSubmitHandler = (
        values: SignInValues,
        actions: FormikHelpers<SignInValues>
    ) => {
        actions.setSubmitting(true);

        const _ = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { confirm_password, ...body } = values;
                const response = await LaunchedAxios.post("/auth/signin", body);
                
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
        <Layout needToFab={false}>
            <div className="frame">
                <Typography variant="h5" gutterBottom>
                    Sign In
                </Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={SignInSchema}
                    onSubmit={onSubmitHandler}
                >
                    {({ isSubmitting }) => (
                        <FForm noValidate>
                            <Grid container spacing={2}>
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
                            </Grid>
                            <SpinnerButton
                                type="submit"
                                text="Sign In"
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

export default SignIn;

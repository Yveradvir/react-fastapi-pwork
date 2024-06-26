import { LaunchedAxios } from "@modules/api/api";
import Danger from "@modules/components/danger";
import Layout from "@modules/components/layout";
import SpinnerButton from "@modules/components/submitspinner";
import { useAppSelector } from "@modules/reducers";
import { LoadingStatus, ReduxRejfullTools } from "@modules/reducers/main";
import { GroupSchema, GroupValues } from "@modules/validations/group.vd";
import { Grid, TextField, Typography } from "@mui/material";
import {
    Formik,
    Field,
    ErrorMessage,
    Form as FForm,
    FormikHelpers,
} from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddGroup: React.FC = () => {
    const navigate = useNavigate();
    const { loadingStatus } = useAppSelector((state) => state.profile);
    const initialValues: GroupValues = {
        content: "",
        title: "",
    };
    const [error, setError] = useState("");

    const onSubmitHandler = async (
        values: GroupValues,
        action: FormikHelpers<GroupValues>
    ) => {
        try {
            const response = await LaunchedAxios.post("/group/new", values);
            if (response.data.ok) {
                navigate(`/group/${response.data.subdata.result}`);
            }
            setError("");
        } catch (error) {
            setError((ReduxRejfullTools.standartAxiosReject(error)).detail)
        } finally {
            action.setSubmitting(false);
        }
    };

    useEffect(() => {
        if (
            [LoadingStatus.Error, LoadingStatus.NotLoaded].includes(
                loadingStatus
            )
        ) {
            navigate("/auth/signin");
        }
    }, [loadingStatus, navigate]);

    return (
        <Layout needToFab={false}>
            <div className="frame">
                <Typography variant="h5" gutterBottom>
                    Add Post
                </Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={GroupSchema}
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
                            </Grid>
                            <SpinnerButton
                                type="submit"
                                text="Add Group"
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

export default AddGroup;

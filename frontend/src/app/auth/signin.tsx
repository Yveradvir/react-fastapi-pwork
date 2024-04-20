import React, { useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import { Formik, Field, ErrorMessage, FormikHelpers, Form as FForm } from "formik";
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
        confirm_password: ""
    };

    const onSubmitHandler = (values: SignInValues, actions: FormikHelpers<SignInValues>) => {
        actions.setSubmitting(true);
        
        const _ = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { confirm_password, ...body } = values;
                
                const response = await LaunchedAxios.post("/auth/signin", body)
                
                if (response.data.ok) {
                    navigate("/home")
                } else {
                    setErrors(response.data.error)
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response?.data.detail) {
                        setErrors(error.response.data.detail)
                    } else {
                        setErrors("Something went wrong . . .")
                    }
                }
            }
            
            actions.setSubmitting(false);
        }

        _();
    };

    return (
        <Layout>
            <div className="d-flex justify-content-center align-items-center h-100">
                <Card className="w-75">
                    <Card.Body>
                        <Card.Title className="text-center">Sign Up</Card.Title>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={SignInSchema}
                            onSubmit={onSubmitHandler}
                        >
                            {({ isSubmitting }) => (
                                <FForm noValidate>
                                    <Form.Group controlId="username">
                                        <Form.Label>Username</Form.Label>
                                        <Field
                                            type="text"
                                            name="username"
                                            placeholder="Enter username"
                                            as={Form.Control}
                                        />
                                        <ErrorMessage name="username">
                                            {(msg) => <Danger text={msg} />}
                                        </ErrorMessage>
                                    </Form.Group>

                                    <Row>
                                        <Col>
                                            <Form.Group controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Field
                                                    type="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    as={Form.Control}
                                                />
                                                <ErrorMessage name="password">
                                                    {(msg) => <Danger text={msg} />}
                                                </ErrorMessage>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="confirm_password">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Field
                                                    type="password"
                                                    name="confirm_password"
                                                    placeholder="Confirm password"
                                                    as={Form.Control}
                                                />
                                                <ErrorMessage name="confirm_password">
                                                    {(msg) => <Danger text={msg} />}
                                                </ErrorMessage>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <SpinnerButton
                                        className="mt-2 w-100"
                                        text="Sign Up"
                                        type="submit"
                                        isSubmitting={isSubmitting}
                                    />
                                    {error && (<Danger text={error}/>)}
                                </FForm>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            </div>
        </Layout>
    );
};

export default SignIn;


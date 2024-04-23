import React, { ChangeEvent, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import { Formik, Field, ErrorMessage, FormikHelpers, Form as FForm } from "formik";
import Danger from "@modules/components/danger";
import Layout from "@modules/components/layout";
import SpinnerButton from "@modules/components/submitspinner";
import { SignUpSchema, SignUpValues } from "@modules/validations/auth.vd";
import { LaunchedAxios } from "@modules/api/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import ImageLoader from "@modules/components/imageLoader";

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
        profile_image: undefined
    };

    const onSubmitHandler = (values: SignUpValues, actions: FormikHelpers<SignUpValues>) => {
        actions.setSubmitting(true);
        
        const _ = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { confirm_password, ...body } = values;
                
                body.birth = new Date(body.birth).toISOString()
                console.log(body);
                
                const response = await LaunchedAxios.post("/auth/signup", body)

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
                            validationSchema={SignUpSchema}
                            onSubmit={onSubmitHandler}
                        >
                            {({ isSubmitting, setFieldValue, values }) => (
                                <FForm noValidate>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="first_name">
                                                <Form.Label>First Name</Form.Label>
                                                <Field
                                                    type="text"
                                                    name="first_name"
                                                    placeholder="Enter first name"
                                                    as={Form.Control}
                                                />
                                                <ErrorMessage name="first_name">
                                                    {(msg) => <Danger text={msg} />}
                                                </ErrorMessage>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="last_name">
                                                <Form.Label>Last Name</Form.Label>
                                                <Field
                                                    type="text"
                                                    name="last_name"
                                                    placeholder="Enter last name"
                                                    as={Form.Control}
                                                />
                                                <ErrorMessage name="last_name">
                                                    {(msg) => <Danger text={msg} />}
                                                </ErrorMessage>
                                            </Form.Group>
                                        </Col>
                                    </Row>

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

                                    <Form.Group controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Field
                                            type="email"
                                            name="email"
                                            placeholder="Enter email"
                                            as={Form.Control}
                                        />
                                        <ErrorMessage name="email">
                                            {(msg) => <Danger text={msg} />}
                                        </ErrorMessage>
                                    </Form.Group>
                                    
                                    <Form.Group controlId="birth">
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Field
                                            type="date"
                                            name="birth"
                                            value={values.birth || ''}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                const selectedDate = e.target.value;
                                                setFieldValue('birth', selectedDate);
                                            }}
                                            as={Form.Control}
                                        />

                                        <ErrorMessage name="birth">
                                            {(msg) => <Danger text={msg} />}
                                        </ErrorMessage>
                                    </Form.Group>

                                    <ImageLoader 
                                        field_name="profile_image"
                                        label="Image of your profile"
                                    />

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

export default SignUp;


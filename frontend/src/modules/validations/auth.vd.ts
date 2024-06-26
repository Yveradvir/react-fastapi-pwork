import { YvesFile } from '@modules/utils/const';
import * as Yup from 'yup';

export interface SignUpValues {
    username: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
    email: string;
    birth: string;
    profile_image?: YvesFile; 
}

export interface SignInValues {
    username: string;
    password: string;
    confirm_password: string;
}

export const SignUpSchema = Yup.object().shape({
    first_name: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    last_name: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    username: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    password: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Field is required'),
    email: Yup.string()
        .email("You should put here an email")
        .max(120, "Maximum 120 letters")
        .required("Field is required"),
    birth: Yup.date()
        .max(new Date(), "Date of birth must be in the past")
        .required("Field is required"),
    profile_image: Yup.mixed().optional()        
});

export const SignInSchema = Yup.object().shape({
    username: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    password: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Field is required')
});

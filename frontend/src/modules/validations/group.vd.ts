import * as Yup from "yup";

export interface GroupValues {
    title: string;
    content: string;
}

export const GroupSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    content: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(12000, "Maximum 12000 letters")
        .required("Field is required")
});

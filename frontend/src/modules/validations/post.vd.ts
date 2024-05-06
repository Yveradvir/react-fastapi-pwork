import { YvesFile } from '@modules/utils/const';
import * as Yup from 'yup';

export interface PostImages {
    main?: YvesFile;
    second?: YvesFile;
    third?: YvesFile;
    fourth?: YvesFile;
    fifth?: YvesFile;
}

export interface PostValues {
    title: string;
    content: string;
    postImages: PostImages;
}

export const PostSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    content: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(12000, "Maximum 12000 letters")
        .required("Field is required"),
})
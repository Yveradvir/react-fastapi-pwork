import { YvesFile } from '@modules/utils/const';
import * as Yup from 'yup';

export interface PostImages {
    main?: YvesFile;
    second?: YvesFile;
    third?: YvesFile;
    fourth?: YvesFile;
    fifth?: YvesFile;
}

export interface PostProps {
    rank: string | undefined;
    discord_tag: string | undefined;
    telegram_tag: string | undefined; 
}

export interface PostValues {
    title: string;
    content: string;
    postProps: PostProps;
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
    postProps: Yup.object().shape({
        rank: Yup.string()
            .max(20, "Maximum 20 letters")
            .optional(),
        discord_tag: Yup.string()
            .min(2, "Minimum 2 letters")
            .max(100, "Maximum 100 letters")
            .optional(),
        telegram_tag: Yup.string()
            .min(2, "Minimum 2 letters")
            .max(100, "Maximum 100 letters")
            .optional(),
    })
});

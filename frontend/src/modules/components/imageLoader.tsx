import React, { useState } from "react";
import {
    Button,
    ButtonGroup,
    Grid,
    FormControl,
    FormHelperText,
    InputLabel,
} from "@mui/material";
import { ErrorMessage, Field, FormikValues, useFormikContext } from "formik";
import Danger from "./danger";
import blobToBase64 from "@modules/utils/blob";
import ImageModal from "@modules/modals/image.modal";
import { CgClose, CgImage } from "react-icons/cg";

interface ImageLoaderProps {
    field_name: string;
    label: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ field_name, label }) => {
    const { setFieldValue } = useFormikContext<FormikValues>();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} lg={10}>
                    <FormControl fullWidth>
                        <InputLabel>{label}</InputLabel>
                        <Field
                            type="file"
                            name={field_name}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                const file =
                                    e.target.files && e.target.files[0];
                                if (file instanceof File) {
                                    setFieldValue(field_name, file);
                                    blobToBase64(
                                        new Blob([file], { type: file.type })
                                    )
                                        .then((b64) => {
                                            setImageUrl(b64);
                                        })
                                        .catch((error) => {
                                            console.error(
                                                "Error converting file to Base64:",
                                                error
                                            );
                                        });
                                }
                            }}
                            value={undefined}
                            as={FormControl}
                        />
                        <FormHelperText>
                            <ErrorMessage name={field_name}> 
                                {(msg) => <Danger text={msg}/>}
                            </ErrorMessage>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} lg={2}>
                    <ButtonGroup>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                console.log(imageUrl);
                                setIsModalOpen(true);
                            }}
                        >
                            <CgImage />
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setFieldValue(field_name, undefined);
                                setImageUrl("");
                            }}
                        >
                            <CgClose />
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>

            <ImageModal
                show={isModalOpen}
                onClose={handleCloseModal}
                imageUrl={imageUrl}
            />
        </>
    );
};

export default ImageLoader;

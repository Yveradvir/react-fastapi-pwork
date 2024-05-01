import React, { useState } from 'react';
import { Button, ButtonGroup, FormControl, FormHelperText, Grid, InputLabel } from '@mui/material';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import Danger from './danger';
import blobToBase64 from '@modules/utils/blob';
import ImageModal from '@modules/modals/image.modal';
import { CgClose, CgImage } from 'react-icons/cg';
import { MuiFileInput } from 'mui-file-input';

interface ImageLoaderProps {
    field_name: string;
    label: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ field_name, label }) => {
    const { setFieldValue } = useFormikContext();
    const [imageUrl, setImageUrl] = useState<string>('');
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
                            inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                            size="small"                
                            name={field_name}
                            value={undefined}
                            onChange={(file: BlobPart) => {
                                if (file instanceof File) {
                                    setFieldValue(field_name, file);
                                    blobToBase64(new Blob([file], { type: file.type }))
                                        .then((b64) => {
                                            setImageUrl(b64);
                                        })
                                        .catch((error) => {
                                            console.error('Error converting file to Base64:', error);
                                        });
                                }
                            }}
                            as={MuiFileInput}
                        />
                        <FormHelperText>
                            <ErrorMessage name={field_name}>
                                {(msg) => <Danger text={msg} />}
                            </ErrorMessage>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} lg={2}>
                    <ButtonGroup>
                        <Button
                            variant="outlined"
                            onClick={() => setIsModalOpen(true)}
                            disabled={!imageUrl}
                        >
                            <CgImage />
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setFieldValue(field_name, undefined);
                                setImageUrl('');
                            }}
                            disabled={!imageUrl}
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

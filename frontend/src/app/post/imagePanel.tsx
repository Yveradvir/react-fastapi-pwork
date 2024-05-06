import { Grid, Paper, Skeleton, Button, Typography } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React, { useState } from "react";
import { postImagesActions } from "@modules/reducers/post_images.slice";
import blobToBase64 from "@modules/utils/blob";
import { useAppDispatch } from "@modules/reducers";

interface ImagePanelProps {
    name: string;
}

const ImagePanel: React.FC<ImagePanelProps> = ({ name }) => {
    const dispatch = useAppDispatch();

    const [image, setImage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (file: File) => {
        blobToBase64(new Blob([file]))
            .then((b64) => {
                setImage(b64);
                setError(null);

                dispatch(postImagesActions.change({ image: b64, name: name }));
            })
            .catch((error) => {
                setError(error)
                console.error(error);
            })
    };

    const handleRemoveImage = () => {
        dispatch(postImagesActions.reset({ name }));
        setImage("");
        setError(null);
    };

    return (
        <Grid item>
            <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
            >
                {error ? (
                    <Typography variant="body1" color="error">
                        {error}
                    </Typography>
                ) : (
                    <>
                        {image ? (
                            <>
                                <img
                                    src={image}
                                    alt={name}
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "300px",
                                        marginBottom: "10px",
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleRemoveImage}
                                >
                                    Remove Image
                                </Button>
                            </>
                        ) : (
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={300}
                            />
                        )}
                    </>
                )}
            </Paper>
            <MuiFileInput
                inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                size="small"
                onChange={(file) =>
                    file instanceof File
                        ? handleFileChange(file)
                        : handleRemoveImage()
                }
            />
        </Grid>
    );
};

export default ImagePanel;

import { Grid, Paper, Skeleton, Button, Typography, Box } from "@mui/material";
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
                setError(error);
                console.error(error);
            });
    };

    const handleRemoveImage = () => {
        dispatch(postImagesActions.reset({ name }));
        setImage("");
        setError(null);
    };

    return (
        <Grid item xs={12}>
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
                            <img
                                src={image}
                                alt={name}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    marginBottom: "10px",
                                }}
                            />
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
            <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                <MuiFileInput
                    inputProps={{
                        accept: "image/jpeg",
                    }}
                    size="small"
                    id="file-input"
                    onChange={(file) =>
                        file instanceof File
                            ? handleFileChange(file)
                            : handleRemoveImage()
                    }
                />
                {image && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleRemoveImage}
                        style={{ marginLeft: "8px" }}
                    >
                        Remove Image
                    </Button>
                )}
            </Box>
        </Grid>
    );
};

export default ImagePanel;

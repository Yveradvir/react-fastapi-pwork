import { Grid, Paper, Skeleton, Button, Typography } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React from "react";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { postImagesActions } from "@modules/reducers/post_images.slice";

interface ImagePanelProps {
    name: string;
}

const ImagePanel: React.FC<ImagePanelProps> = ({ name }) => {
    const dispatch = useAppDispatch();
    const { images, error } = useAppSelector((state) => state.post_images);

    const handleFileChange = (image: File) =>
        dispatch(
            postImagesActions.change({
                image,
                name,
            })
        );

    const handleRemoveImage = () => dispatch(postImagesActions.reset({ name }));

    return (
        <Grid>
            <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
            >
                {error ? (
                    <Typography variant="body1" color="error">
                        {error.detail}
                    </Typography>
                ) : (
                    <>
                        {images![name] ? (
                            <>
                                <img
                                    src={images[name]}
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
                onChange={(file) => {
                    if (file instanceof File) handleFileChange(file)
                    else handleRemoveImage()
                }}
            />
        </Grid>
    );
};

export default ImagePanel;

import React from "react";
import { Button, Modal, Typography } from "@mui/material";

interface ImageModalProps {
    show: boolean;
    imageUrl: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
    show,
    imageUrl,
    onClose,
}) => {
    return (
        <Modal open={show} onClose={onClose}>
            <div style={{ backgroundColor: "#fff", padding: "1rem", maxWidth: "600px", margin: "auto", marginTop: "20vh" }}>
                <Typography variant="h6" align="center" gutterBottom>Preview</Typography>
                <div style={{ textAlign: "center" }}>
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Selected Image"
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    )}
                </div>
                <Typography variant="body1" align="center">This image you have picked</Typography>
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Ok
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ImageModal;

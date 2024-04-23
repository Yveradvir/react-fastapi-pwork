import React from "react";
import { Button, Modal } from "react-bootstrap";

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
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Selected Image"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                )}
                <p>This image you have picked</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageModal;

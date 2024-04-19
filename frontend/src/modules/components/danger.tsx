import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { BsFillXCircleFill } from "react-icons/bs";

const Danger: React.FC<{ text: string }> = ({ text }) => {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);

    return (
        <>
            {show && (
                <Alert variant="danger" className="m-1 border border-danger rounded-lg shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                        <Alert.Heading className="m-0">{text}</Alert.Heading>
                        <Button onClick={handleClose} variant="link" size="sm" className="text-danger p-0" aria-label="Close">
                            <BsFillXCircleFill style={{ fontSize: "1.5rem" }} />
                        </Button>
                    </div>
                </Alert>
            )}
        </>
    );
};

export default Danger;

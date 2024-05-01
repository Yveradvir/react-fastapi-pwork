import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import { IoCloseCircleOutline } from "react-icons/io5";


const Danger: React.FC<{ text: string }> = ({ text }) => {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);

    return (
        <>
            {show && (
                <Alert severity="error" className="m-1 border border-danger rounded-lg shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="m-0">{text}</span>
                        <IconButton aria-label="close" size="small" onClick={handleClose}>
                            <IoCloseCircleOutline fontSize="inherit" />
                        </IconButton>
                    </div>
                </Alert>
            )}
        </>
    );
};

export default Danger;

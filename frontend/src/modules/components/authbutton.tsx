import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

interface AuthButtonProps {
    text: string;
    to: string;
    currentPath: string;
    variant: "contained" | "outlined";
}

const AuthButton: React.FC<AuthButtonProps> = ({
    text,
    to,
    currentPath,
    variant,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(to);
    };

    const getColor = (): "inherit" | "primary" | "secondary" | "info" | "success" | "warning" | "error" => {
        return currentPath === to ? "primary" : "inherit";
    }
    

    return (
        <Button
            variant={variant}
            color={getColor()}
            onClick={handleClick}
        >
            {text}
        </Button>
    );
};

export default AuthButton;

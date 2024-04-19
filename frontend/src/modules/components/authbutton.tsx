import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface AuthButtonProps {
    text: string;
    to: string;
    currentPath: string;
    variant: "primary" | "outline-primary";
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

    return (
        <Button
            variant={`${variant} ${currentPath === to ? "active" : ""}`}
            onClick={handleClick}
        >
            {text}
        </Button>
    );
};

export default AuthButton;

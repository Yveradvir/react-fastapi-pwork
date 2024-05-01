import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

interface ErrorPageProps {
    status_code?: number;
    initial_message?: string;
    children?: React.ReactNode;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
    status_code = 404,
    initial_message = "Oops! Page Not Found",
    children
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                navigate(-1);
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [navigate]);

    return (
        <div className="text-center mt-5">
            <h1 className="display-1">{status_code}</h1>
            <h2 className="display-4">{initial_message}</h2>
            {children}
            <Button
                onClick={() => {
                    navigate(-1);
                }}
                variant="contained"
                color="primary"
            >
                Go back to previous
            </Button>
        </div>
    );
};

export default ErrorPage;

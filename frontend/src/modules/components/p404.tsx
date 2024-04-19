import React, { useEffect } from "react";
import Layout from "./layout";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const NotFoundPage: React.FC = () => {
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
        <Layout>
            <div className="text-center mt-5">
                <h1 className="display-1">404</h1>
                <h2 className="display-4">Oops! Page Not Found</h2>
                <p className="lead">
                    The page you are looking for might have been removed, had
                    its name changed, or is temporarily unavailable.
                </p>
                <Button
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    Go back to previous
                </Button>
            </div>
        </Layout>
    );
};

export default NotFoundPage;

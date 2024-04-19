import React from "react";
import { Button, ButtonProps, Spinner } from "react-bootstrap";

interface SpinnerButtonProps {
    isSubmitting: boolean;
    text: string;
}

const SpinnerButton: React.FC<SpinnerButtonProps & ButtonProps> = ({ isSubmitting, text, ...rest }) => {
    return (
        <Button variant="primary" disabled={isSubmitting} {...rest}>
            {isSubmitting ? (
                <>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    <span className="visually-hidden">Loading...</span>
                </>
            ) : (
                text
            )}
        </Button>
    );
};

export default SpinnerButton;

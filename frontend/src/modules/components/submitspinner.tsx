import React from "react";
import Button, { ButtonProps } from '@mui/material/Button'; 
import CircularProgress from '@mui/material/CircularProgress';

interface SpinnerButtonProps extends ButtonProps { 
    isSubmitting: boolean;
    text: string;
}

const SpinnerButton: React.FC<SpinnerButtonProps> = ({ isSubmitting, text, ...rest }) => {
    return (
        <Button variant="contained" disabled={isSubmitting} {...rest}>
            {isSubmitting ? (
                <>
                    <CircularProgress size={20} color="inherit" />
                    <span className="visually-hidden">Loading...</span>
                </>
            ) : (
                text
            )}
        </Button>
    );
};

export default SpinnerButton;

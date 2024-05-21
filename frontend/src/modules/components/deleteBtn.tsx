import React, { useState } from "react";
import { LaunchedAxios } from "@modules/api/api";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Danger from "./danger";

interface DeleteBtnInterface {
    callback?: () => void;
    label: string;
    url: string;
}

const DeleteBtn: React.FC<DeleteBtnInterface> = ({ callback, label, url }) => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [password, setPassword] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleDelete = async () => {
        try {
            const pCheck = await LaunchedAxios.post("/auth/passwords", {password});
            
            if (pCheck.data.ok) {
                setError(false);

                await LaunchedAxios.delete(url);
                if (callback) callback();
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <>
            <Button
                color="error"
                variant="contained"
                onClick={handleClickOpen}
            >
                {label}
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    {error && (
                        <Danger text="Password don't match"/>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteBtn;

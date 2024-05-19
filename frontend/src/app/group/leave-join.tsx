import { LaunchedAxios } from "@modules/api/api";
import { Button } from "@mui/material";

interface LeaveJoinButtonProps {
    group_id: string | undefined;
    setError: (arg: boolean) => void;
    membership?: {
        user_id: string;
        group_id: string;
        access: number;
    } | null;
}

const LeaveJoinButton: React.FC<LeaveJoinButtonProps> = ({
    group_id,
    setError,
    membership,
}) => {
    if (membership == null) {
        return (
            <Button
                style={{
                    position: "fixed",
                    bottom: "16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                }}
                color="success"
                variant="contained"
                onClick={() => {
                    const _ = async () => {
                        try {
                            await LaunchedAxios.post(
                                `/group/single/${group_id}/membership`
                            );
                        } catch (error) {
                            setError(true);
                        }
                    };
                    _();
                }}
            >
                Join
            </Button>
        );
    } else {
        if (membership.access === 0) {
            return (
                <Button
                    style={{
                        position: "fixed",
                        bottom: "16px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1000,
                    }}
                    color="error"
                    variant="contained"
                    onClick={() => {
                        const _ = async () => {
                            await LaunchedAxios.delete(
                                `/group/single/${group_id}/membership`
                            );
                        };
                        _();
                    }}
                >
                    Leave
                </Button>
            );
        }
    }

    return <></>;
};

export default LeaveJoinButton;

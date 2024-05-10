import React from "react";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { Group, GroupAdd, PostAdd } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const actions = [
    { icon: <PostAdd />, name: "Add new post", url: "/post/new"},
    { icon: <GroupAdd />, name: "Add new group", url: "/group/new" },
    { icon: <Group />, name: "My groups", url: "/group/my"},
];

const YvesFab: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleFabClick = (link?: string): void => {
        if (link) navigate(link);        
        handleClose();
    }

    return (
        <SpeedDial
            ariaLabel="SpeedDial example"
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={() => {handleFabClick(action.url)}}
                />
            ))}
        </SpeedDial>
    );
};

export default YvesFab;

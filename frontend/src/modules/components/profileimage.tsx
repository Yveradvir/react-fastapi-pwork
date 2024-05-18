import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { LoadingStatus } from "@modules/reducers/main";
import { getProfileImage } from "@modules/reducers/profile.slice";
import { Avatar, CircularProgress } from "@mui/material";

interface ProfileImageProps {
    uid: string;
    w?: number;
    h?: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ uid, w = 64, h = 64 }) => {
    const dispatch = useAppDispatch();
    const { profile, profileImageStatus } = useAppSelector((state) => state.profile);

    useEffect(() => {
        if (!profile?.profile_b64 && profileImageStatus === LoadingStatus.ANotLoaded) {
            dispatch(getProfileImage(uid));
        }
    }, [dispatch, profile?.profile_b64, profileImageStatus, uid]);

    if (profileImageStatus === LoadingStatus.Loaded) {
        return (
            <Avatar
                alt="Profile"
                src={profile?.profile_b64 || "https://static-00.iconduck.com/assets.00/user-avatar-1-icon-511x512-ynet6qk9.png"}
                style={{ width: w, height: h }}
            />
        );
    } else if (profileImageStatus === LoadingStatus.Loading) {
        return (
            <CircularProgress
                size={Math.min(w, h)}
            />
        );
    }

    return null;
};

export default ProfileImage;

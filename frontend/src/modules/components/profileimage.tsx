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
    const selector = useAppSelector((state) => state);

    useEffect(() => {
        let is_ignore = false;

        if (!is_ignore) {
            if (
                !selector.profile.profile?.profile_b64 &&
                selector.profile.profileImageStatus === LoadingStatus.NotLoaded
            ) {
                dispatch(getProfileImage(uid));
            }
        }

        return () => {
            is_ignore = true;
        };
    }, [dispatch, selector.profile.profile?.profile_b64, selector.profile.profileImageStatus, uid]);

    const profileB64 = selector.profile.profile?.profile_b64;

    if (selector.profile.profileImageStatus === LoadingStatus.Loaded) {
        if (!selector.profile.profile?.profile_b64) {
            return (
                <Avatar
                    alt="Profile"
                    src="https://static-00.iconduck.com/assets.00/user-avatar-1-icon-511x512-ynet6qk9.png"
                    style={{ width: w, height: h }}
                />
            );
        }
        return (
            <Avatar
                alt="Profile"
                src={profileB64}
                style={{ width: w, height: h }}
            />
        );
    } else if (selector.profile.profileImageStatus === LoadingStatus.Loading) {
        return (
            <CircularProgress
                size={Math.min(w, h)}
            />
        );
    }
    return null;
};

export default ProfileImage;

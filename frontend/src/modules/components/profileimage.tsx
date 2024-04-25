import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { LoadingStatus } from "@modules/reducers/loadstatus";
import { getProfileImage } from "@modules/reducers/profile.slice";
import React, { useEffect } from "react";

interface ProfileImageProps {
    uid: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ uid }) => {
    const dispatch = useAppDispatch();
    const selector = useAppSelector((state) => state);

    useEffect(() => {
        let is_ignore = false;

        if (!is_ignore) {
            if (!selector.profile.profile?.profile_b64 && selector.profile.loadingStatus === LoadingStatus.Loaded) {
                dispatch(getProfileImage(uid));
            }
        }

        return () => {
            is_ignore = true;
        }
    })

    return (
        <div>

        </div>
    )
}

export default ProfileImage;
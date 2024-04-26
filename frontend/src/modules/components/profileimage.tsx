import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { LoadingStatus } from "@modules/reducers/main";
import { getProfileImage } from "@modules/reducers/profile.slice";
import { MutatingDots } from "react-loader-spinner";

interface ProfileImageProps {
    uid: string;
    w?: number;
    h?: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ uid, w=128, h=128 }) => {
    const dispatch = useAppDispatch();
    const selector = useAppSelector((state) => state);

    useEffect(() => {
        let is_ignore = false;

        if (!is_ignore) {
            if (!selector.profile.profile?.profile_b64 
                && selector.profile.profileImageStatus === LoadingStatus.NotLoaded
            ) {
                dispatch(getProfileImage(uid));
            }
        }

        return () => {
            is_ignore = true;
        }
    }, [dispatch, selector.profile.profile?.profile_b64, selector.profile.profileImageStatus, uid]);

    const profileB64 = selector.profile.profile?.profile_b64;

    if (selector.profile.profileImageStatus === LoadingStatus.Loaded) {
        return (
            <div>
                <img 
                    src={`data:image/jpeg;base64,${profileB64}`} 
                    alt="Profile" 
                    style={{ borderRadius: "50%", width: `${w}px`, height: `${h}px` }} 
                />
            </div>
        );
    } else if (selector.profile.profileImageStatus === LoadingStatus.Loading) {
        return (
            <MutatingDots
                width={w}
                height={h}
            />
        );
    }
}

export default ProfileImage;

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

const ProfileImage: React.FC<ProfileImageProps> = ({ uid, w=64, h=64 }) => {
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
        if (!selector.profile.profile?.profile_b64) {
            return (
                <div>
                    <img 
                        src={`https://static-00.iconduck.com/assets.00/user-avatar-1-icon-511x512-ynet6qk9.png`} 
                        alt="Profile" 
                        style={{ borderRadius: "50%", width: `${w}px`, height: `${h}px` }} 
                    />
                </div>                
            );
        }
        return (
            <div>
                <img 
                    src={`${profileB64}`} 
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

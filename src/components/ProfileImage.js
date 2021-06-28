import React,{useEffect,useState} from 'react';

import { db } from '../firebase';


export default function ProfileImage({userData}){

    const [profImageUrl,updateUrl] = useState(userData.profile_info.picture);

    useEffect(() => {
        db.collection('users').doc(userData.profile_info.name).
        onSnapshot(async () => {
            const image = await db.collection('users')
            .doc(userData.profile_info.name)
            .get().then((ele) => {
                return ele.data().profileImage;
            });

            updateUrl(image);
        })
        
    }, [profImageUrl]);
    return <img id="profile-img" src={profImageUrl} alt="cant display" />
}
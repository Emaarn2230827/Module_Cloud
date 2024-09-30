"use client";
import Header from '@/app/Components/header';
import init from '@/app/common/init';
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, listAll, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';

function Profil({ params }) {
    const { db, auth } = init();
    const router = useRouter();
    const [imageFiles, setImageFiles] = useState([]);
    const storage = getStorage();
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    useEffect(() => {
        if (!params.id) {
            router.push('../login');
            return;
        }
        const listRef = ref(storage, `${params.id}/ProfilePicture`);
        listAll(listRef)
            .then(res => {
                const downloads = res.items.map(itemRef => getDownloadURL(itemRef));
                Promise.all(downloads).then(setImageFiles);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, [params.id, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const listRef = ref(storage, `${params.id}/ProfilePicture`);
            const res = await listAll(listRef);
    
            // Supprimer tous les fichiers
            if (res.items.length > 0) {
                const deletePromises = res.items.map(itemRef => deleteObject(itemRef));
                await Promise.all(deletePromises);
                console.log('Tous les fichiers ont été supprimés avec succès.');
            }
    
            const imageUpdate = e.target.image.files[0];
            if (imageUpdate) {
                if (!imageUpdate.type.startsWith('image/')) {
                    alert('Veuillez sélectionner un fichier image');
                    return;
                }
    
                const refFile = ref(storage, `${params.id}/ProfilePicture/${imageUpdate.name}`);
                await uploadBytes(refFile, imageUpdate);
                console.log('Uploaded a blob or file!');
    
                // Recharger les images après l'upload
                const downloads = await listAll(ref(storage, `${params.id}/ProfilePicture`)).then(res => {
                    return Promise.all(res.items.map(itemRef => getDownloadURL(itemRef)));
                });
                setImageFiles(downloads);
            }
    
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };
    
    

    return (
        <>
            <Header />
            <br />
            <center><h1><u><mark>My Profile </mark></u></h1></center>
            <br />
            {imageFiles.map((file, i) => (
                <p key={i} className='text-center'>
                    <b>Profile Picture: </b>
                    <img src={file} alt="Profile" className='rounded-circle' width={70} height={70} />
                </p>
            ))}
            <div>
                <button className='btn btn-primary text-center' onClick={handleEditClick}>
                    Edit
                </button>
                {isEditing && (
                    <form onSubmit={handleSubmit}>
                        <input type="file" name="image" />
                        <button type="submit" className="btn btn-primary btn-block">
                            Update
                        </button>
                    </form>
                )}
            </div>
            <br />
            <p className='text-center'><b>Email: </b>mon email</p>
            <br />
        </>
    );
}

export default Profil;

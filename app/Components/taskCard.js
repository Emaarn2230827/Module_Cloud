"use client";

import React from 'react';
import Link from 'next/link';
import init from '../common/init';
import {  deleteDoc, doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation";
import { getStorage, ref, deleteObject } from "firebase/storage";


function TaskCard({ id, name, description, status, startDate, deadLine, image }) {
    const {db, auth} = init()
    const router = useRouter();
    const storage = getStorage();
    const handleDeleteTask = async () => {
        try {
        const user = auth.currentUser;
        if (!user) {
            console.log('User not authenticated');
            router.push('../login');
            return;
        }

        const documentRef = doc(db, "ListTask", id);
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
            const documentData = documentSnapshot.data();
        
            if (documentData.image) {
                console.log("documentData.image: " + documentData.image);
                const imageRef = ref(storage, documentData.image);
                await deleteObject(imageRef);
            }
        
            await deleteDoc(documentRef);
            console.log("Document supprimé");
        } else {
            console.log("Le document n'existe pas");
        }
        } catch (err) {
            console.error("Error deleting document: ", err);
            console.log("id: "+id);
        }
    };

    // Déterminer la couleur de fond en fonction du statut
    const cardStyle = {
        width: '25rem',
        backgroundColor: status === 'done' ? 'green' : 
                          status === 'doing' ? 'cyan' : 
                          'white', // Fond blanc si statut n'est pas "done" ou "doing"
       
    };
    

    return (
        <div className="cardEnd col-12 col-lg-4 contenuLambda" key={id}>
            <div className="card" style={cardStyle}>
                <div className="card-body">
                    <h5 className="card-title"> {name}</h5>
                   <img src={image} className="card-img-top" alt="image" width={380} height={250}/>
                    <p className="card-text">Description: {description}</p>
                    <p className="card-text">Status: {status}</p>
                    <p className="card-text">Start Date: {startDate}</p>
                    <p className="card-text">Deadline: {deadLine}</p>
                    <button type="button" className="btn btn-primary">
                        <Link href={`../modifTask/${id}`} className="text-white">Edit</Link>
                    </button>
                    <button type="button" className="btn btn-danger">
                        <Link href="/accueil" className="text-white" onClick={handleDeleteTask}>Delete</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;

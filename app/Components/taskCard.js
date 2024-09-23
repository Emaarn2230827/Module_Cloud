"use client";

import React from 'react';
import Link from 'next/link';
import init from '../common/init';
import {  deleteDoc, doc } from "firebase/firestore"
import { useRouter } from "next/navigation";

function TaskCard({ id, name, description, status, startDate, deadLine }) {
    const {db, auth} = init()
    const router = useRouter();
    const handleDeleteTask = async () => {
        try {
        const user = auth.currentUser;
        if (!user) {
            console.log('User not authenticated');
            router.push('../login');
            return;
        }

        await deleteDoc(doc(db, "ListTask", id));      
        console.log("Document supprimé")
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

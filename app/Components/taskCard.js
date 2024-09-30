"use client";
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import init from '../common/init'
import { useRouter } from 'next/navigation';
import { deleteDoc ,doc} from 'firebase/firestore';

function TaskCard({ id, name, description, status, startDate, deadLine }) {

    const { auth, db } = init();
    const router = useRouter();

    const handleDeleteTask = async () => {
        try {
            const user = auth.currentUser;
          
            if(!user) {
                console.log('User not authenticated');
                router.push('../login');
                return;
            }
            await deleteDoc(doc(db, "ListTask", id));

        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche :', error);
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
                    <p className="card-text">deadLine: {deadLine}</p>
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

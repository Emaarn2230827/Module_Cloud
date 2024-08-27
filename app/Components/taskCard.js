"use client";
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

function TaskCard({ id, name, description,status, startDate, deadline }) {

    const handleDeleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/listTask/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
  
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la modification de la chaussure');
            }

        } catch (error) {
            console.error('Erreur lors de la suppression de la chaussure :', error);
        }
    };
    return (
        <div className="cardEnd col-12 col-lg-4  contenuLambda" key={id}>
            <div className="card" style={{ width: '25rem' }}>                        
                <div className="card-body">
                    <h5 className="card-title"> {name}</h5>
                    <p className="card-text">Description: {description}</p>
                    <p className="card-text">Status: {status}</p>
                    <p className="card-text">Start Date: {startDate}</p>
                    <p className="card-text">Deadline: {deadline}</p>
                   <button type="button" className="btn btn-primary "><Link href={`../modifTask/${id}`} className="text-white">Edit</Link></button>
                   <button type="button" className="btn btn-danger"><Link href="/accueil" className="text-white" onClick={() => handleDeleteTask(id)}>Delete</Link></button>
                </div>
            </div>
        </div>
        
    );
}

export default TaskCard;

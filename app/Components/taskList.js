"use client";

import React, { useState, useEffect } from 'react';
import TaskCard from './taskCard';
import init from '../common/init';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
   
    
    useEffect(() => {
        async function fetchTask() {

            const {auth} = init()
            const user = auth.currentUser;
        if (!auth.currentUser) {
            console.log('User not authenticated');
            return;
        }
        const { currentUser } = auth;
        
            try {             
                const response = await fetch('http://localhost:3000/listTask?emailUser=' + user.email);
                
                if (!response.ok) {
                    throw new Error('Erreur de réseau ou serveur indisponible');
                }
                
                const json = await response.json();

                setTasks(json);
                setLoading(false);
            } catch (error) {
               console.error(error);
            }
        }
        fetchTask();
        const intervalId = setInterval(() => {
            fetchTask(); 
        }, 2000);

        // Nettoyage de l'intervalle lors du démontage du composant
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="container-fluid">
            <div className="row align-items-center" >
            {loading ? (
                    <p>loading...</p>
                ) : tasks.length > 0 ? (
                tasks.map(ts => (
                    <TaskCard key={ts.id} id={ts.id} name={ts.name} description={ts.description} status={ts.status} startDate={ts.startDate} deadline={ts.deadline}/>
                ))
            ) : (
                <h1 className="scrolling-text">No task found</h1>
                    )}
            
            </div>
        </div>
    );
}

export default TaskList;

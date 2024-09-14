"use client";

import React, { useState, useEffect } from 'react';
import TaskCard from './taskCard';
import init from '../common/init';
import { collection, getDocs, query, where } from "firebase/firestore"

function TaskList() {
    const { db } = init();
    const [loading, setLoading] = useState(true);
    const [snapshot, setSnapshot] = useState([]);
    
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

                // Recherche des tâches pour l'utilisateur connecté
               const q = query(collection(db, "ListTask"), where("userId", "==", currentUser.uid));
               const querySnapshot = await getDocs(q);
               const fetchedTasks = [];
                querySnapshot.forEach((doc) => {
                    fetchedTasks.push({ id: doc.id, ...doc.data() });
                });

                // Mettre à jour l'état avec le tableau de tâches
                setSnapshot(fetchedTasks);
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
                ) : snapshot.length > 0 ? (
                    snapshot.map(ts => (
                    <TaskCard key={ts.id} name={ts.name} description={ts.description} status={ts.status} startDate={ts.startDate} deadline={ts.deadline}/>
                ))
            ) : (
                <h1 className="scrolling-text">No task found</h1>
                    )}
            
            </div>
        </div>
    );
}

export default TaskList;

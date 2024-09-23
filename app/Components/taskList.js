"use client";

import React, { useState, useEffect } from 'react';
import TaskCard from './taskCard';
import init from '../common/init';
import { collection,query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

function TaskList() {
    const { db, auth } = init();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if(!user){
            console.log('User not authenticated');
            router.push('../login');
            return;
        }
        async function fetchTask() {       
            try {
                //  requête permettant de ne recharger que les documents de l'utilisateur connecté
                const q = query(collection(db, "ListTask"), where("userId", "==", user.uid));
        
                const querySnapshot = await getDocs(q);
                setTasks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()})));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
                setLoading(false);
            }
        }

        fetchTask();

        const intervalId = setInterval(fetchTask, 500);

        // Nettoyage de l'intervalle lors du démontage du composant
        return () => {
            clearInterval(intervalId); 
        };
    }, [db, auth]);

    return (
        <div className="container-fluid">
            <div className="row align-items-center">
                {loading ? (
                    <p>loading...</p>
                ) : tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <TaskCard
                            key={index}
                            id={task.id}
                            name={task.name}
                            description={task.description}
                            status={task.status}
                            startDate={task.startDate}
                            deadLine={task.deadLine}
                        />
                    ))
                ) : (
                    <h1 className="scrolling-text">No task found</h1>
                )}
            </div>
        </div>
    );
}

export default TaskList;

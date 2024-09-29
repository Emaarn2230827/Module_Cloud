"use client";

import React, { useState, useEffect } from 'react';
import TaskCard from './taskCard';
import init from '../common/init';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function TaskList() {
    const { db, auth } = init();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const storage = getStorage();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            console.log('User not authenticated');
            router.push('../login');
            return;
        }

        async function fetchTask() {
            try {
                // Requête pour ne récupérer que les tâches de l'utilisateur connecté
                const q = query(collection(db, "ListTask"), where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);

                const tasksWithImages = await Promise.all(
                    querySnapshot.docs.map(async (doc) => {
                        const taskData = doc.data();

                        // Si la tâche contient une image, récupérer l'URL de téléchargement
                        if (taskData.image) {
                            const imageRef = ref(storage, taskData.image);
                            const imageUrl = await getDownloadURL(imageRef);
                            return { id: doc.id, ...taskData, image: imageUrl }; // Ajouter l'URL de l'image à la tâche
                        }
                        
                        return { id: doc.id, ...taskData };
                    })
                );

                setTasks(tasksWithImages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
                setLoading(false);
            }
        }

        fetchTask();
    }, [db, auth, router]);

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
                            image={task.image || ""} // Si aucune image, définir une chaîne vide
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

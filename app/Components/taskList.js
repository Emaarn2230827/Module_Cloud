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
                // récupératyion du résultat de la requête précédente, donc toutes les tâches de l'utilisateur seront stockées dans la variable querySnapshot
                const querySnapshot = await getDocs(q);
                //promise.all() permet de garamtir que toute les promsesses soient résolues, garantissant ainsi que toutes les iamges sont récupérées avant l'update de l'application
                const tasksWithImages = await Promise.all(
                    //  querySnapshot.docs.map permet de faire une iteration sur tous les documents de la requête
                    querySnapshot.docs.map(async (doc) => {
                        // doc.data() contient les données de la tâche sous la forme d'un objet
                        const taskData = doc.data();

                        // Si la tâche contient une image, on récupère l'URL de téléchargement
                        if (taskData.image) {
                            // imageRef contient la reference de l'image
                            const imageRef = ref(storage, taskData.image);
                            //imageUrl contient l'URL de telechargement
                            const imageUrl = await getDownloadURL(imageRef);
                            return { id: doc.id, ...taskData, image: imageUrl }; // Ajout de l'URL de l'image à la tâche
                        }
                        
                        return { id: doc.id, ...taskData };
                    })
                );
                // update de l'état de task avec les tâches et leurs images(si existantes)
                setTasks(tasksWithImages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
                setLoading(false);
            }
        }

        fetchTask();
        const interval = setInterval(fetchTask, 500);
        return () => clearInterval(interval);
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
                            image={task.image || ""} // Si aucune image,on affiche une chaîne vide
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

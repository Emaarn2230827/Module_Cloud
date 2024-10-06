"use client";

import React, { useState, useEffect } from 'react';
import TaskCard from './taskCard';
import init from '../common/init';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function TaskList() {
    const { db, auth } = init();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const storage = getStorage();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Surveiller les changements d'état d'authentification
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // Rediriger si l'utilisateur n'est pas connecté
                router.push('../login');
            }
        });

        return () => unsubscribe(); // Nettoyage lors de la fin de l'utilisation
    }, [auth, router]);

    // Fonction pour récupérer les tâches
    const fetchTask = async () => {
        if (!user) return; // Si l'utilisateur n'est pas encore défini, ne rien faire

        try {
            // Requête pour ne récupérer que les tâches de l'utilisateur connecté
            const q = query(collection(db, "ListTask"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            // Récupération des tâches avec images
            const tasksWithImages = await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const taskData = doc.data();
                    if (taskData.image) {
                        const imageRef = ref(storage, taskData.image);
                        const imageUrl = await getDownloadURL(imageRef);
                        return { id: doc.id, ...taskData, image: imageUrl }; // Ajout de l'URL de l'image à la tâche
                    }
                    return { id: doc.id, ...taskData };
                })
            );

            setTasks(tasksWithImages);
        } catch (error) {
            console.error("Error fetching tasks: ", error);
        } finally {
            setLoading(false); // Assure que l'état de chargement est mis à jour
        }
    };

    useEffect(() => {
        fetchTask(); // Appeler la fonction de récupération des tâches

        const interval = setInterval(fetchTask, 500); // Rafraîchir les tâches toutes les 500ms
        return () => clearInterval(interval); // Nettoyage du setInterval
    }, [db, user]); // Utilise `user` comme dépendance pour vérifier les changements

    return (
        <div className="container-fluid">
            <div className="row align-items-center">
                {loading ? (
                    <p>Loading...</p>
                ) : tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id} // Utiliser l'ID de la tâche comme clé
                            id={task.id}
                            name={task.name}
                            description={task.description}
                            status={task.status}
                            startDate={task.startDate}
                            deadLine={task.deadLine}
                            image={task.image || ""} // Si aucune image, on affiche une chaîne vide
                        />
                    ))
                ) : (
                    <h1 className="scrolling-text">No tasks found</h1>
                )}
            </div>
        </div>
    );
}

export default TaskList;

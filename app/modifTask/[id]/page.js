"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Header from '@/app/Components/header';
import init from '@/app/common/init';
import { doc, getDoc, updateDoc } from "firebase/firestore";


export default function ModifTaskForm({ params }) {
     const router = useRouter();
    const { db, auth } = init();
   
    const [task, setTask] = useState({
        name: '',
        description: '',
        status: 'todo',
        startDate: '',
        deadLine: ''
    });
   
    useEffect(() => {
        const user = auth.currentUser;
        if(!user){
            console.log('User not authenticated');
            router.push('../login');
            return;
        }
        async function fetchTask() {
            try {

                const docRef = await getDoc(doc(db, "ListTask", params.id)); 
                if(docRef.exists()){
                    setTask(docRef.data());
                } else {
                    console.log('no such document');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        }

        fetchTask();
    }, [params.id, db, auth, router]);

    const handleChange = (event) => {
        const { name, value} = event.target;
        setTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateDoc(doc(db, "ListTask", params.id), task)
            router.push('../accueil'); 
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche:', error);
        }
    };

    return (
        <>
         <Header/>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 bg-light shadow">
                            <div className="card-body p-5 contenuLambda">
                                <h2 className="card-title text-center mb-4">Update a Task</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name of the task</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={task.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={task.description}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">Status</label>
                                        <select
                                            className="form-control"
                                            id="status"
                                            name="status"
                                            value={task.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="todo">To do</option>
                                            <option value="doing">Doing</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="startDate">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="startDate"
                                            name="startDate"
                                            value={task.startDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="deadline">Deadline</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="deadline"
                                            name="deadline"
                                            value={task.deadLine}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

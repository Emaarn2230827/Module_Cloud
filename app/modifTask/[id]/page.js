"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";


export default function ModifTaskForm({ params }) {
    const [task, setTask] = useState({});
    const router = useRouter();

    useEffect(() => {
        async function fetchTask() {
            try {
                const response = await fetch(`http://localhost:3000/listTask/${params.id}`);
                const json = await response.json();
                setTask(json);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        }

        fetchTask();
    }, [params.id]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setTask(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch(`http://localhost:3000/listTask/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            router.push('../accueil'); 
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche:', error);
        }
    };

    return (
        <>
         
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
                                            value={task.name || ''}
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
                                            value={task.description || ''}
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
                                            value={task.status || 'todo'}
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
                                            value={task.startDate || ''}
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
                                            value={task.deadline || ''}
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

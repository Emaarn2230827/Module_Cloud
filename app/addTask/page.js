"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Components/header';
import init from '../common/init'; 

export default function AddTask() {
    const { auth } = init();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'todo',
        startDate: '',
        deadline: ''
    });
    const [error, setError] = useState('');
    const router = useRouter();

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.currentUser) {
            setError('User not authenticated');
            return;
        }

        const { currentUser } = auth;
        const { name, description, status, startDate, deadline } = formData;

        try {
            const response = await fetch('http://localhost:3000/listTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    status,
                    startDate,
                    deadline,
                    emailUser: currentUser.email
                }),
            });

            if (response.ok) {
                router.push('../accueil'); // Redirect to  accueil
            } else {
                setError('Failed to add task');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred');
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 bg-light shadow">
                            <div className="card-body p-5 contenuLambda">
                                <h2 className="card-title text-center mb-4">Add a Task</h2>
                                {error && <p className="text-danger">{error}</p>}
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name of the task</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
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
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">Status</label>
                                        <select
                                            className="form-control"
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="todo">To Do</option>
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
                                            value={formData.startDate}
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
                                            value={formData.deadline}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">Save</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

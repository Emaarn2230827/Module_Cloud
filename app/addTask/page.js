"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Components/header';
import init from '../common/init'; 
import { collection, addDoc, setDoc, doc } from "firebase/firestore"

export default function AddTask() {
    const { db } = init();
    const { auth } = init();
    const [error, setError] = useState('');
    const router = useRouter();
    const user = auth.currentUser;
    if(!user){
        console.log('User not authenticated');
        router.push('../login');
        return;
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.currentUser) {
            setError('User not authenticated');
            return;
        }

        const { currentUser } = auth;
        try {
            const TaskDocRef = collection(db, "ListTask");
            await addDoc( TaskDocRef, {
                  name: e.target.name.value
                , description: e.target.description.value
                , status: e.target.status.value
                , startDate: e.target.startDate.value
                , deadLine: e.target.deadLine.value
                , userId: currentUser.uid
            });
            console.log("Document written with ID: ",TaskDocRef.id)

            router.push('../accueil'); // Redirect to  accueil
   
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
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">Status</label>
                                        <select
                                            className="form-control"
                                            id="status"
                                            name="status"                                
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
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="deadLine">DeadLine</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="deadLine"
                                            name="deadLine"
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

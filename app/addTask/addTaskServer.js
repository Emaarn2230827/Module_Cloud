"use server";
import init from '../common/init'
import { getAuth } from 'firebase/auth';
export default async function addTaskServer(formData) {


    const {auth} = init()
    const user = auth.currentUser;

    const name = formData.get('name');
    const description = formData.get('description');
    const status = formData.get('status');
    const startDate = formData.get('startDate');
    const deadline = formData.get('deadline');
    const emailUser = user.email;


    const response = fetch('http://localhost:3000/listTask', {
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
            emailUser
        }),
    });
    console.log(name, description, status, startDate, deadline, emailUser);

}
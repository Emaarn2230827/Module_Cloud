"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import init from '../common/init'
import {  createUserWithEmailAndPassword } from "firebase/auth"

export function Inscription() {
  const {auth} = init()
  const router = useRouter();
  //Appelé lorsqu'on envoie le formulaire
  function submitForm(e){
    e.preventDefault()

    //Récupération des champs du formulaire
    const email = e.target.email.value
    const password = e.target.password.value

    //Ajout de l'utilisateur (courriel + mot de passe)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        console.log(userCred.user)
        router.push('../accueil');
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

    return (
        <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 bg-light shadow">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">create an account ToDoList</h2>
              <form onSubmit={submitForm}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email" 
                    placeholder="Enter your email" 
                    required
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="password" 
                    placeholder="Enter your password" 
                    required
                  />
                </div>
                <br />
                <button type="submit" className="btn btn-danger btn-block">save</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}

export default Inscription;
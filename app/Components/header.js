"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import init from '../common/init'
import { signOut } from "firebase/auth"
import {getStorage, ref, listAll, getDownloadURL} from "firebase/storage"


function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const {auth} = init()
    const user = auth.currentUser;
    const router = useRouter();
    const [imageFiles, setImageFiles] = useState([])
    const storage = getStorage()
    useEffect(() => {
        if(!user){
            router.push('../login')
            return
        }
        const listRef = ref(storage, `${user.uid}/ProfilePicture`)
        listAll(listRef)
            .then(res => {
                const downloads = res.items.map((itemRef) => getDownloadURL(itemRef))
                Promise.all(downloads).then(setImageFiles)
            })
      }, [])
  //Appelé lorsqu'on envoie le formulaire
  function logOut(e){
    e.preventDefault()

    //Déconnexion
    signOut(auth)
      .then(() => {
        console.log("Logged out")
        router.push("../login")
      })
      .catch((error) => {
        console.log(error.message)
      })
  }


    return (
        <header>
            <div className="container-fluid">
                <nav className="row align-items-center navbar navbar-expand-lg navbar-dark">
                    <button 
                        className="col-6 navbar-toggler" 
                        type="button" 
                        onClick={() => setMenuOpen(!menuOpen)} // Inversion de l'état du menu
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`contenuLambda col-6 col-lg-9 align-items-center collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav ">
                        <ul className="navbar-nav  align-items-center col-lg-12 ">
                            <li className="nav-item col-lg-5">
                                <Link href="/accueil" className="nav-link mx-5" >My ToDoList</Link>
                            </li>
                            <li className="nav-item col-lg-5">
                                <Link className="nav-link mx-5" href="../addTask">➕Add a Task</Link>
                            </li>
                            <li className="nav-item col-lg-2 " >
                            <Link href={`../Profil/${user.uid}`} className="nav-link mx-5" >
                            {imageFiles.map((file,i) => 
                                    <img  key={i} src={file} alt="logoConnexion" id="logoConnexion" className='rounded-circle' width={70} height={70}/> )}
                            </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;

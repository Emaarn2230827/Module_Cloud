"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import init from '../common/init';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null); // Stocker l'utilisateur
    const router = useRouter();
    const [imageFiles, setImageFiles] = useState([]);
    const { auth } = init();
    const storage = getStorage();

    useEffect(() => {
        // Surveiller les changements d'état d'authentification
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchProfilePictures(currentUser);
            } else {
                // Rediriger si l'utilisateur n'est pas connecté
                router.push('../login');
            }
        });

        return () => unsubscribe(); // Nettoyage lors de la fin de l'utilisation
    }, [auth, router]);

    const fetchProfilePictures = async (currentUser) => {
        const listRef = ref(storage, `${currentUser.uid}/ProfilePicture`);

        try {
            const res = await listAll(listRef);
            if (res.items.length > 0) {
                // Récupère les métadonnées pour trier les fichiers par date de création
                const itemsWithMetadata = await Promise.all(
                    res.items.map(async (itemRef) => {
                        const metadata = await getMetadata(itemRef); // Utilisation correcte de getMetadata
                        return { itemRef, timeCreated: metadata.timeCreated };
                    })
                );

                // Trie les fichiers par date de création (le plus récent en premier)
                itemsWithMetadata.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));

                // Récupère l'URL de la dernière image ajoutée
                const lastImageUrl = await getDownloadURL(itemsWithMetadata[0].itemRef);

                // Met à jour l'état avec l'URL de la dernière image seulement
                setImageFiles([lastImageUrl]);
            } else {
                console.log("No profile pictures found.");
            }
        } catch (error) {
            console.error("Error fetching profile pictures:", error);
        }
    };

    useEffect(() => {
        // Déclencher un rafraîchissement de l'image toutes les 1 seconde
        if (user) {
            const interval = setInterval(() => {
                fetchProfilePictures(user);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [user]);

    // Appelé lorsqu'on envoie le formulaire
    function logOut(e) {
        e.preventDefault();

        // Déconnexion
        signOut(auth)
            .then(() => {
                console.log("Logged out");
                router.push("../login");
            })
            .catch((error) => {
                console.log(error.message);
            });
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
                        <ul className="navbar-nav align-items-center col-lg-12 ">
                            <li className="nav-item col-lg-5">
                                <Link href="/accueil" className="nav-link mx-5">My ToDoList📋</Link>
                            </li>
                            <li className="nav-item col-lg-5">
                                <Link className="nav-link mx-5" href="../addTask">➕Add a Task</Link>
                            </li>
                            <li className="nav-item col-lg-2">
                                {user && imageFiles.length > 0 && (
                                    <Link href={`../Profil/${user.uid}`} className="nav-link mx-5">
                                        <img src={imageFiles[0]} alt="logoConnexion" id="logoConnexion" className="rounded-circle" width={70} height={70} />
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;

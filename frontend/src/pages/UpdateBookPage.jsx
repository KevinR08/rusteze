import React, { useEffect, useState } from 'react'
// Se importan componentes y utilidades necesarios.

import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import UpdateBook from '../components/updateBook.jsx'
import { useParams } from 'react-router-dom'
import { useAuth } from '../utils/authContext.jsx'

import '../styles/index.css'


export default function UpdateBookPage() {
    const { carId } = useParams(); // Se obtiene el ID del libro desde los parámetros de la URL.
    const [book, setBook] = useState({}); // Estado para almacenar la información del libro a actualizar.
    const { authData } = useAuth(); // Se obtiene la información de autenticación del usuario.

    useEffect(() => {
        fetch(`http://localhost:3000/api/read/car/${carId}`)
            .then(response => response.json())
            .then(data => setBook(data))
    }, []);

    return (
        authData.isAuthorized ? (    
        <>
  
        <Navbar />
        {
            book.id ? (
                <UpdateBook book={book}/>
            ) : (
                <p>Cargando...</p>
            )
        }
        <Footer />
        </>
        ) : (
            <>
                {window.location.href = '/'}
            </>
        )
    );
}


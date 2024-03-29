import React from 'react'

import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Books from '../components/booksList.jsx'
import ProductDetail from '../components/productDetail.jsx'
import { useParams } from 'react-router-dom'
import '../styles/index.css'
import { useEffect, useState } from 'react'

export default function ProductDetailPage() {
    const { carId } = useParams();
    const [ book, setBook] = useState({});
    
    useEffect(() => {
        fetch(`http://localhost:3000/api/read/car/${carId}`)
            .then(response => response.json())
            .then(data => setBook(data))
    }, []);

    return (
        <>
  
        <Navbar />
        {
            book.id ? (
                <ProductDetail book={book}/>
            ) : (
                <p>Cargando..</p>
            )
        }
        <Books />
        <Footer />
        </>
    );
}


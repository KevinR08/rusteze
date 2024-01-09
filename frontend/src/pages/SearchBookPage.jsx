import React, { useEffect, useState } from 'react'

import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Book from '../components/micro-components/bookForSale.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

import { useNavigate, useLocation } from 'react-router-dom';

import '../styles/index.css'
import '../styles/searchBookPage.css'

export default function SearchBookPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [ books, setBooks] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/search/cars?brand=${queryParams.get('brand')}`)
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.log(error));
        
    }, []);

    return (
        <>

        <Navbar />
            {queryParams.get('titbrandle') && 
            <div className="filter-container">
            <div className="filter-applied">
                <label for="filter-applied">{queryParams.get('title')}
                    <a href='/search/cars?brand='><FontAwesomeIcon icon={faX} /></a>
                </label>
            </div>
            </div>
            }
        <section id="featured-services" className="featured-services">
            <div className="books-container">
                {books && books.length > 0 ? (
                    books.map((book, index) => (
                        <Book key={index} book={book} />
                    ))) : (
                    <p>No se encontraron libros.</p>
                )}
            </div>
        </section> 
        <Footer />
        </>
    );
}






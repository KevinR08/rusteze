import React from 'react'

import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Books from '../components/booksList.jsx'
import Slider from '../components/slider.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import '../styles/index.css'
import { useState, useEffect, useRef } from 'react'

export default function LandingPage() {
    const [showChat, setShowChat] = useState(false);
    const videoRef = useRef(null);

    const handleVideoClick = () => {
        if (videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.error('Error al reproducir el video:', error);
            });
        }
    };

    function handleSearch() {
        const searchInputValue = document.getElementById("navbar-search-input").value;
        window.location.href = `/search/cars?brand=${encodeURIComponent(searchInputValue)}`;
      }

    const openChat = () => {
        setShowChat(true);
    };

    const closeChat = () => {
        setShowChat(false);
    };
    return (
        <>
            
            <Navbar />
            <Slider />
            <div className="cardVideo">
                <video controls  className="video" ref={handleVideoClick}>
                    <source src="https://firebasestorage.googleapis.com/v0/b/carstore-69599.appspot.com/o/files%2FvideoLandingPage.mp4?alt=media&token=2109892e-fa4a-4da1-8ffb-26b4ee9154df" type="video/mp4" />
                    Tu navegador no soporta la etiqueta de video HTML5.
                </video>
                <div className="descripcion">
                    <h3>AutoStore: Automóviles de Calidad</h3>
                    <h4>En AutoStore, estamos comprometidos a brindarte una experiencia excepcional en la compra de automóviles. Nos enorgullecemos de ofrecer una amplia gama de vehículos de calidad que se adaptan a cada estilo de vida y necesidad.</h4>
                    <h4>Con años de experiencia en la industria automotriz, nuestro equipo experto está dedicado a ayudarte a encontrar el automóvil perfecto que se ajuste a tus preferencias y presupuesto. Desde elegantes sedanes hasta potentes SUVs y confiables autos compactos, en AutoStore, encontrarás una variedad de marcas y modelos.</h4>
                </div>
            </div>
            

            
            <Books />
            <Footer />
        </>
    );

}



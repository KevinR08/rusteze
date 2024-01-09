import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import '../styles/sellerProfileBox.css'

const SellerProfileBox = () => {
    return (
        <div className="row">
                <div className="main-box">
                    <div className="inner-box">
                        <h3>¿Desea vender un auto?</h3>
                        <p> Ahora tiene la posibilidad de comercializar libros educativos en diferentes
                            presentaciones, como libros de tapa blanda y libros de tapa dura.</p>   
                    </div>
                    <a href="/create" className="btn btn-primary"><FontAwesomeIcon className="faIcon" icon={faFile} /><a href="#"></a></a>

            </div>
        </div>
    );
};

export default SellerProfileBox;
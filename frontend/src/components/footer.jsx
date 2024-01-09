import "../styles/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons'



const Footer = () => {

    

    return (
        <footer className="footer">
          <div className="container">
           <div className="row">
             <div className="footer-col">
               <h4>Car Store</h4>
               <ul>
               <li><a href="#">Dirección: Av. 12 de octubre y Veintimilla</a></li>
               <li><a href="#">Teléfonos: 0984847767 - 0967485996</a></li>
               <li><a href="#">Horario de atención: 07:00-18:00</a></li>
               <li><a href="#">Atendemos de Lunes a Viernes</a></li>
               </ul>
             </div>
             <div className="footer-col">
               <h4>Nuestras Marcas</h4>
               <ul>
                 <li><a href="#">Mercedes Benz</a></li>
                 <li><a href="#">Audi</a></li>
                 <li><a href="#">Mitsubishi</a></li>
                 <li><a href="#">Mazda</a></li>
                 <li><a href="#">Nissan</a></li>
               </ul>
             </div>
             
             <div className="footer-col">
               <h4>Redes sociales</h4>
               <ul>
               <li><a href="#">Verifica nuestras redes sociales oficiales</a></li>
               </ul>
               <div className="social-links">
               <a href="#"><FontAwesomeIcon className="faIcon" icon={faFacebook} /></a>
                 <a href="#"><FontAwesomeIcon className="faIcon" icon={faTwitter}/></a>
                 <a href="#"><FontAwesomeIcon className="faIcon" icon={faInstagram} /></a>
                 
               </div>
             </div>
             <div className="footer-col">
              <h4>Copyright</h4>
              <ul>
                <li><a href="#">Kevin Rivadeneira</a></li>
                <li><a href="#">Marcela Montalvo</a></li>
                <li><a href="#">Pablo Vélez</a></li>
              </ul>
            </div>
           </div>
          </div>
       </footer>
    )
}

export default Footer
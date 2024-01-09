import Stars from './micro-components/stars.jsx'
import "../styles/bookSlider.css"

const BookSlider = ({book}) => {
    const urlImage = "https://firebasestorage.googleapis.com/v0/b/polibooksweb.appspot.com/o/polibooks%2FnotAvailableBook.png?alt=media&token=0b68b219-5e8a-4652-92d5-7b1ddcd2d129"
    function handleClick() {
        window.location.href = `/detail/${book.id}`;
    }

    return (
        <div className="testimonial-item" data-aos="zoom-in" data-aos-duration="1000">
               <img src={book.image.length > 0? book.image : urlImage} className="testimonial-img" alt="book for sale"></img>
       
        </div>
        
    );
};

export default BookSlider;
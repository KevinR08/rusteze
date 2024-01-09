import "../styles/createBook.css";
import BookItem from './micro-components/bookItem.jsx'
import BookItemImage from './micro-components/bookItemImage.jsx'
import { useEffect, useState } from "react";
import { saveBook } from "../utils/book";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorToast, successToast, infoToast } from '../utils/toast.jsx';
import { useAuth } from '../utils/authContext.jsx';

export default function CreateBook() {
  const { authData } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [checkboxChecked, setCheckbox] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [inputValidities, setInputValidities] = useState([
    false, false, false, false, false, false, false, false
  ]);
  const [images, setImages] = useState([]);

  function handleCheckboxChange() {
    setCheckbox(!checkboxChecked);
  }

  function onPublishButtonClick() {
    const userID = authData.userID;
    const tokenID = authData.idToken;
    const title = document.getElementById('create-book-title').value;
    const description = document.getElementById('create-book-description').value;
    const brand = document.getElementById('create-book-brand').value;
    const modelo = document.getElementById('create-book-modelo').value;
    const anio = parseInt(document.getElementById('create-book-anio').value);
    const km = document.getElementById('create-book-km').value;
    const price = parseFloat(document.getElementById('create-book-price').value);
    const contact = document.getElementById('create-book-contact').value;
    // Guardar el libro en la base de datos 
    const save = saveBook(userID, tokenID, title, description, brand, modelo, anio, images, km, price, contact);
    setIsSaved(save);
  };

  useEffect(() => {
    const formIsValid = inputValidities.reduce((acc, curr) => acc && curr, true);
    setIsFormValid(formIsValid && checkboxChecked);
  }, [inputValidities, checkboxChecked]);

  useEffect(() => {
    // Validamos que el checkbox esté seleccionado
    if (isFormValid) {
      document.getElementById("publish-button").disabled = false;
    } else {
      document.getElementById("publish-button").disabled = true;
    }
  }, [isFormValid]);

  useEffect(() => {
    if (isSaved) {
      successToast('El libro se publicó correctamente.');
      setTimeout(() => (window.location.href = '/seller'), 2000);
    }
  }, [isSaved]);

  // Función para actualizar la validez de una instancia específica
  function updateInputValidity(index, isValid) {
    const newValidities = [...inputValidities];
    newValidities[index] = isValid;
    setInputValidities(newValidities);
  };

  const updateImagesURLs = (images) => {
    setImages(images);
  };

  return (
    <div className="create-book">
      <ToastContainer />
      <h1>Información para la venta</h1>
      <div className="create-book-layout">
        <BookItem
          title="Titulo"
          description="Título llamativo para el auto"
          index={0}
          handleCallback={updateInputValidity}
          id="create-book-title"
        />

        <BookItem
          title="Descripción"
          description="Agregar información relevante del auto"
          index={1}
          handleCallback={updateInputValidity}
          id="create-book-description"
        />
        <BookItem
          title="Marca"
          description="Ingresar la marca del auto"
          index={2}
          handleCallback={updateInputValidity}
          id="create-book-brand"
        />
        <BookItem
          title="modelo"
          description="Escriba el modelo del auto"
          index={3}
          handleCallback={updateInputValidity}
          id="create-book-modelo"
        />
        <BookItem
          type="float"
          title="Año"
          description="Escriba el año de fabricación del auto"
          index={4}
          handleCallback={updateInputValidity}
          id="create-book-anio"
        />
        <BookItem
          title="Kilometraje"
          description="Escriba el kilometraje (Km) del auto"
          index={5}
          handleCallback={updateInputValidity}
          id="create-book-km"
        />
        <BookItem
          type="float"
          title="Precio"
          description="Escriba el valor de venta del auto"
          index={6}
          handleCallback={updateInputValidity}
          id="create-book-price"
        />
        <BookItem
          type="phone"
          title="Telefono"
          description="Escriba su número de contacto"
          index={7}
          handleCallback={updateInputValidity}
          id="create-book-contact"
        />


      </div>
      <div className="cargarImg"><BookItemImage
        title="Imagen"
        description="Cargar fotografías del auto"
        handleCallback={updateImagesURLs}
      /></div>
      <label className="checkbox-container">
        <input type="checkbox" id="accept-checkbox" onChange={handleCheckboxChange}></input>
        <span className="checkmark"></span>
        <span className="checkmark-text">Garantizo que la información publicada es verídica y Acepto los términos y condiciones de PoliBooks.</span>
      </label>
      <button id="publish-button" className="publish-button" onClick={onPublishButtonClick}>Publicar</button>
    </div>
  );

};

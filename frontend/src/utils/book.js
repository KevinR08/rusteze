async function saveBook(userID, tokenId, title, description, brand, modelo, anio, image, km, price, contact) {
  // Crear un objeto con la información del libro
  const bookData = {
    title: title,
    description: description,
    brand: brand, //marca
    modelo: modelo,
    anio: anio,
    image: image,
    km: km,
    price: price,
    contact: contact,
    userID: userID,
  };

  fetch('http://localhost:3000/api/create/car', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${tokenId}`,
    },
    body: JSON.stringify(bookData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Datos de la respuesta del servidor
      return true;
    })
    .catch((error) => {
      console.error('Error al hacer la solicitud:', error);
      return false;
    });
}

async function updateBookinDB(idCar, userID, tokenId, title, description, brand, modelo, anio, image, km, price, contact) {
  // Crear un objeto con la información del libro
  const bookData = {
    title: title,
    description: description,
    brand: brand,
    modelo: modelo,
    anio: anio,
    image: image,
    km: km,
    price: price,
    contact: contact,
    userID: userID,
  };

  fetch(`http://localhost:3000/api/update/car/${idCar}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${tokenId}`,
    },
    body: JSON.stringify(bookData),
  })
    .then((response) => {
      if (response.ok) {
        return true;
      }
    })
    .catch((error) => {
      console.error('Error al hacer la solicitud:', error);
      return false;
    });
}

export { saveBook, updateBookinDB };
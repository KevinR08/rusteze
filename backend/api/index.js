//Entranamiendo de las api
const express = require('express');
const { json } = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, updateDoc, collection, query, limit, getDocs, where, getDoc, addDoc, doc, deleteDoc } = require('firebase/firestore');
const { getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const multer = require('multer');
const { memoryStorage } = require('multer');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");
const isAuthenticated =require('../firebaseAuthentication')
const firebaseConfig =require('../firebaseConfig')
require('dotenv').config()
const { v4 } = require('uuid');


// Creación de una instancia en Express
const app = express()
app.use(express.json())
app.use(cors())

// Conexión a Firebase
const appFirebase = initializeApp(firebaseConfig)
const auth = getAuth(appFirebase)
const db = getFirestore(appFirebase)
const firebaseStorage = getStorage(appFirebase)
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

//Petición GET a API
app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`)
})

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params
  res.end(`Item: ${slug}`)
})

/* Ruas definidas de la API - carga de archivos hacia Firebase*/
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).send('No se ha proporcionado un archivo.');
    }
    const storageRef = ref(firebaseStorage, `/files/${file.originalname}`);
    const uploadTask = await uploadBytesResumable( storageRef, file.buffer );
    const downloadURL = await getDownloadURL(uploadTask.ref);
    console.log("downloadURL:", downloadURL);
    return res.status(200).send({url: downloadURL});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al subir el archivo.');
  }
});

// Mostrar los autos
app.get('/api/read/cars', async (req, res) => {
  try {
    const carsCol = collection(db, 'cars')
    const carSnapshot = await getDocs(carsCol)
    const carsList = []
    carSnapshot.forEach((doc) => {
      carsList.push({
        id: doc.id,
        ...doc.data()
      })
    })
    res.status(200).json(carsList)
  } catch (error) {
    console.error('No se pudieron obtener los autos', error)
    res.status(500).json({ error: 'Error al cargar los autos' })
  }
})

// Mostrar auto por ID
app.get('/api/read/car/:carId', async (req, res) => {
  try {
    const carId = req.params.carId; 
    const carsCol = doc(db, 'cars', carId)
    const carDoc = await getDoc(carsCol)
    if (carDoc.exists()) {
      const carData = {
        id: carDoc.id,
        ...carDoc.data()
      }
      res.status(200).json(carData)
    } else {
      res.status(404).json({ error: 'El auto no ha sido encontrado' })
    }
  } catch (error) {
    console.error('Error al mostrar auto', error)
    res.status(500).json({ error: 'Error al mostrar auto' })
  }
})

//Mostrar autos por límite
app.get('/api/read/cars/:limit', async (req, res) => {
  try {
    const limitParam = parseInt(req.params.limit, 10) || 5 
    const carsCol = collection(db, 'cars')
    const querySnapshot = await getDocs(query(carsCol, limit(limitParam)))
    const carsList = []
    querySnapshot.forEach((doc) => {
      carsList.push({
        id: doc.id,
        ...doc.data()
      })
    })
    res.status(200).json(carsList)
  } catch (error) {
    console.error('Error al cargar listado de autos', error)
    res.status(500).json({ error: 'Error al cargar listado de autos' })
  }
})

// Buscar autos por título
app.get('/api/search/cars', async (req, res) => {
  try {
    const searchText = req.query.brand.toLowerCase() 
    const carsCol = collection(db, 'cars')
    const querySnapshot = await getDocs(carsCol)
    const matchCars = []
    querySnapshot.forEach((doc) => {
      const title = doc.data().brand.toLowerCase()
      if (title.includes(searchText)) {
        // Agregar los autos que coinciden a la lista
        matchCars.push({ id: doc.id, ...doc.data() })
      }
    })
    res.status(200).json(matchCars)
  } catch (error) {
    console.error('No se ha encontrado el auto', error)
    res.status(500).json({ error: 'No se ha encontrado el auto', errorFire: error })
  }
})

// Autenticación
app.get('/api/isAuth', isAuthenticated, (req, res) => {
  const userId = req.user.uid
  res.json({ message: `Usuario autenticado con ID: ${userId}` })
})

//Mostrar autos cargados por el usuario
app.get('/api/read/car/auth/:userID', isAuthenticated, async (req, res) => {
  try {
    const userID = req.params.userID
    console.log(userID)
    const carsCol = collection(db, 'cars')
    const querySnapshot = await getDocs(query(carsCol, where('userID', '==', userID)))
    const carsList = []
    querySnapshot.forEach((doc) => {
      carsList.push({
        id: doc.id,
        ...doc.data()
      })
    })
    res.status(200).json(carsList)
  } catch (error) {
    console.error('Error al mostrar sus autos creados', error)
    res.status(500).json({ error: 'Error al mostrar sus autos creados' })
  }
})

// Ruta para el endpoint de registro de usuario
app.post('/api/register', async (req, res) => {
  const { email, password, phone, name } = req.body
  try {
    // Crear usuario con correo y contraseña en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid
    // Guardar información adicional en Firestore
    await addDoc(collection(db, 'users'), {
        uid: uid,
        phone: phone,
        name: name
      })
    res.status(200).json({ message: 'Registro exitoso' })
  } catch (error) {
    console.error('Error al registrarse:', error.message)
    res.status(500).json({ error: error.message })
  }
})
let userCredential=""
let user=""
// Ruta para el endpoint de inicio de sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  try {
      // Iniciar sesión con correo y contraseña
       userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log(await auth.currentUser.getIdToken())
       user = userCredential.user


      res.status(200).json({ isAuthorized: true, userID: user.uid , idToken: await auth.currentUser.getIdToken() })
    } catch (error) {
    console.error('Error al iniciar sesión:', error.message)
      res.status(500).json({ error: error.message })
  }
})

// Ruta para envío de correo de recuperación de contraseña
app.post('/api/user/reset-password', async (req, res) => {
  const { email } = req.body
  try {
    const resetPassword = await sendPasswordResetEmail(auth, email)
    console.log(resetPassword)
    res.status(200).json({message: "Correo enviado exitosamete"})
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento de contraseña:', error)
    res.status(500).json({ error: error.message })
  }
})

// Ruta para eliminar un auto
app.delete('/api/delete/car/:idCar' , isAuthenticated, async (req, res) => {
  try {
    const idCar = req.params.idCar
    // Verifica si el libro existe antes de eliminarlo
    const carsCol = doc(db, 'cars', idCar)
    const carDoc = await getDoc(carsCol
)
    if (!carDoc.exists()) {
      return res.status(404).json({ error: 'El auto no existe' })
    }
    await deleteDoc(carsCol
)
    res.status(200).json({ message: 'Auto eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar el auto:', error)
    res.status(500).json({ error: 'Error al eliminar el auto', errorFire: error })
  }
})

//Crear un auto
app.post('/api/create/car', isAuthenticated, async (req, res) => {
  try {
    const carData = req.body
    console.log(carData)
    const newcarsCol = await addDoc(collection(db,'cars'), carData)
    res.status(201).json({ message: 'Auto creado exitosamente', idCar: newcarsCol.id })
  } catch (error) {
    // No se pudo crear el libro
    console.error('Error al crear el auto:', error)
    res.status(500).json({ error: 'Eror al crear el auto',errorFire:error })
  }
})

// Ruta para actualizar un libro
app.put('/api/update/car/:idCar', isAuthenticated, async (req, res) => {
  try {
    const idCar = req.params.idCar
    const updatedData = req.body
    // Verifica si el libro existe antes de actualizarlo
    const carsCol = doc(db, 'cars', idCar)
    const carDoc = await getDoc(carsCol)
    if (!carDoc.exists()) {
      return res.status(404).json({ error: 'El auto no existe' })
    }
    // Actualiza los datos del libro en la base de datos
    await updateDoc(carsCol, updatedData) 
    res.status(200).json({ message: 'Auto actualizado exitosamente' })
  } catch (error) {
    console.error('Error al actualizar el auto:', error)
    res.status(500).json({ error: 'Error al actualizar el auto', errorFire: error })
  }
})



/******* */
const admin = require('firebase-admin');
async function getUserEmailFromID(userID) {
  try {
    const userRecord = await admin.auth().getUser(userID);
    const userEmail = userRecord.email;
    return userEmail;
  } catch (error) {
    console.error('Error al obtener el correo electrónico del usuario:', error);
    return null;
  }
}
/************ */
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const cookie = require('cookie');

wss.on('connection', async (ws, req) => {
  // Parsea las cookies del encabezado
  const cookies = cookie.parse(req.headers.cookie || '');
  const authData = cookies.authData ? JSON.parse(cookies.authData) : {};
  const userEmail = await getUserEmailFromID(authData.userID) ;
  ws.send(JSON.stringify({ user: userEmail }));

  ws.on('message', (message) => {
    // Combina el email del usuario y el mensaje recibido
    const messageWithUserEmail = `${userEmail}: ${message}`;

    console.log(messageWithUserEmail);

    // Envía el mensaje a todos los clientes conectados
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(messageWithUserEmail);
      }
    });
  });
});

app.use(express.static(path.join(__dirname, '.../frontend/src/pages/ChatApp.jsx')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, ".../frontend/src/pages",'ChatApp.jsx'));
});
server.listen(4000, () => {
    console.log('Servidor WebSocket en ejecución en el puerto 3000');
  });





// Inicio del servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`)
})



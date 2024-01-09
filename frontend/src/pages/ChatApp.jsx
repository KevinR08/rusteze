import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import '../styles/chatStyles.css'; // Importa los estilos CSS

const ChatApp = () => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');

    socket.addEventListener('open', (event) => {
      console.log('Conexión establecida con el servidor WebSocket');
    });

    socket.addEventListener('message', (event) => {
      const message = event.data;
      const item = document.createElement('li');
      item.textContent = message;
      item.classList.add('other-message'); // Establece la clase para mensajes del otro usuario
      messages.appendChild(item);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = input.value;
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
      const item = document.createElement('li');
      item.textContent = `Tú: ${message}`;
      item.classList.add('user-message'); // Establece la clase para mensajes del usuario
      messages.appendChild(item);
      input.value = '';
      input.focus();
    });

    return () => {
      socket.close();
    };
  }, [userEmail]);

  return (
    <>
      <Navbar />
      <section id="chat">
        <ul id="messages"></ul>
        <form id="form">
          <input type="text" className="inp"name="message" id="input" placeholder="Type a message" autoComplete="off" />
          <button type="submit" className='but'>Send</button>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default ChatApp;

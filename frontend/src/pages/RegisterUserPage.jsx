import React from 'react'
import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Books from '../components/booksList.jsx'
import RegisterUserBox from '../components/registerUserBox.jsx'
import PasswordField from '../components/micro-components/passwordField.jsx'

import '../styles/index.css'

export default function RegisterUserPage() {
    return (
        <>
     
        <Navbar />
        <RegisterUserBox/>
        <Footer />
        </>
    );
}


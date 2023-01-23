import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';



export const ContactUs = ({ user }) => {

    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('YOUR_SERVICE_ID', 'template_uhx98jb', form.current, 'zIDg_3hiYIJeIwqzI')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
    };

    return (


        <form className='contact-email' ref={form} onSubmit={sendEmail}>
            <div>
                <input type="text" name="user_name" defaultValue={user.uName} required placeholder='Nom' />
            </div>
            <div>
                <input type="email" name="user_email" defaultValue={user.uEmail} placeholder='Email' />
            </div>
            <div>
                <input type='text' name="subject" placeholder='Sujet' />
            </div>
            <div>
                <textarea name="message" placeholder='Tapez ici...' />
            </div>
            <input type="submit" value="Envoyer" className='cancel-email' />
        </form>

    );
};

export default ContactUs;
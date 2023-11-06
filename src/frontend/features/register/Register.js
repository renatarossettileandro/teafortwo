import React, { useState } from "react";
import './register.css';

export const Register = () => {
    const [ nome, setNome ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ senha, setSenha ] = useState('');
    const [ error, setError ] = useState('');
    const [ success, setSuccess ] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!nome || !email || !senha) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, email, senha })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful', data);
                setSuccess('Registration successful!');
                setError('');
                console.log('Registration successful', data);
            } else {
                const errorText = await response.text();
                setError('Error in registration');
                console.error('Error in registration', errorText);
            }
        } catch (error) {
            console.error('Error while registering:', error);
            setError('Error in registration');
        }
    };

    return (
        <div className="Register-container">
            <div className="Offer">
                <p>Exclusive Offer: Sign Up Today and Get 10% Off Your First Order + Free Delivery!</p>
            </div>
            <div className="Form-register">
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)} />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />

                    <input
                        type="password"
                        name="password"
                        placeholder="Type a password"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)} />

                    <button type="submit">Register</button>
                </form>
                {error && <p className="Error">{error}</p>}
                {success && <p className="Success">{success}</p>}
            </div>
        </div>
    );
};

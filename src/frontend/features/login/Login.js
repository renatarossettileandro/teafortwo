import React, { useState } from "react";
import './login.css';
import { useDispatch } from 'react-redux';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [ error, setError ] = useState('');
    const [ success, setSuccess ] = useState('');

    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful', data.user.id);
                setSuccess('You are in, have fun!');
                setError('');
               // Despacha a ação para atualizar o ID do usuário no Redux
                dispatch({ type: 'SET_USER_ID', payload: data.user.id });
            } else {
                const errorText = await response.text();
                console.error('Erro no login:', errorText);
                setError('Sorry, your email or password is not right!');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setError('Sorry, your email or password is not right!');
        }
    };
   

    return (
        <div className="Login-container">
            <div className="Form-register">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />

                    <button type="submit">Sign in</button>
                </form>
                {error && <p className="Error">{error}</p>}
                {success && <p className="Success">{success}</p>}
            </div>
        </div>
    );
};

export default Login;

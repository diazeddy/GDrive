import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { login } from '../api/api';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await login(username, password);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Login</button>
            </form>
            <NavLink to="/register">
                <button>Register</button>
            </NavLink>
        </>
    );
};

export default Login;

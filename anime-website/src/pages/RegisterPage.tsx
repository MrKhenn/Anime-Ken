import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    return (
        <body className="bg-dark text-light d-flex align-items-center justify-content-center vh-100">
            <div className="login-container">
                <div className="card bg-dark border-0 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                    <div className="card-body p-5">
                        <h3 className="text-center text-danger mb-4">Registro</h3>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label text-light">Nombre de usuario</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-danger text-white border-0"><i className="fas fa-user"></i></span>
                                    <input type="text" className="form-control bg-dark text-light border-0" id="username" placeholder="Elige un nombre de usuario" />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-light">Correo Electrónico</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-danger text-white border-0"><i className="fas fa-envelope"></i></span>
                                    <input type="email" className="form-control bg-dark text-light border-0" id="email" placeholder="usuario@ejemplo.com" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label text-light">Contraseña</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-danger text-white border-0"><i className="fas fa-lock"></i></span>
                                    <input type="password" placeholder="••••••••" className="form-control bg-dark text-light border-0" id="password" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-danger w-100">Registrarse</button>
                        </form>
                        <div className="text-center mt-3">
                            <Link to="/login" className="text-danger text-decoration-none">¿Ya tienes una cuenta? Inicia sesión</Link>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    );
};

export default RegisterPage;

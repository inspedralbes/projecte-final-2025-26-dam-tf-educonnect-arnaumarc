import React, { useState } from 'react';

interface RegisterProps {
    onRegisterSuccess: () => void;
    onNavigateToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        clase: '',
        tipo_horario: 'Mañana'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3005/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('¡Registro completado! Redirigiendo al login...');
                setTimeout(() => {
                    onNavigateToLogin();
                }, 2000);
            } else {
                setError(data.message || 'Error en el registro');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 border-8 border-black p-4">
            <div className="bg-white p-8 border-2 border-black w-full max-w-md shadow-lg">
                {/* Logo Simulation */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="flex space-x-1">
                            <div className="w-4 h-12 bg-black"></div>
                            <div className="w-4 h-8 mt-4 bg-black"></div>
                            <div className="w-4 h-10 mt-2 bg-black"></div>
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-cyan-500 leading-none">INS</h1>
                            <h1 className="text-3xl font-bold text-cyan-400 leading-none">PEDRALBES</h1>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-center mb-6 text-black uppercase tracking-widest">Registro</h2>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4 text-sm font-bold animate-pulse">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 mb-4 text-sm font-bold">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            className="w-full border-2 border-black p-2 font-semibold text-black focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="apellidos"
                            placeholder="Apellidos"
                            className="w-full border-2 border-black p-2 font-semibold text-black focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border-2 border-black p-2 font-semibold text-black focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        className="w-full border-2 border-black p-2 font-semibold text-black focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="clase"
                            placeholder="Clase (Ej: 2DAM)"
                            className="w-full border-2 border-black p-2 font-semibold text-black focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                            value={formData.clase}
                            onChange={handleChange}
                        />
                        <select
                            name="tipo_horario"
                            className="w-full border-2 border-black p-2 font-semibold text-black focus:outline-none focus:border-cyan-500 transition-colors bg-white"
                            value={formData.tipo_horario}
                            onChange={handleChange}
                        >
                            <option value="Mañana">Mañana</option>
                            <option value="Tarde">Tarde</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-black text-white p-3 font-bold hover:bg-gray-800 transition-colors uppercase tracking-widest mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                    <p className="text-gray-600 mb-2 font-medium">¿Ya tienes cuenta?</p>
                    <button
                        onClick={onNavigateToLogin}
                        className="text-cyan-500 font-bold hover:text-cyan-600 transition-colors uppercase tracking-wider"
                    >
                        Inicia sesión aquí
                    </button>
                </div>
            </div>
        </div>
    );
};

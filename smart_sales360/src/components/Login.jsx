import { useState } from 'react';

// Tu lógica de API sigue aquí
const API_URL = 'http://localhost:8000/api/auth'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Login exitoso:', data);
      } else {
        setError(data.detail || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fondo Crema: #FAF7F2
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FAF7F2]">
      
      {/* Título Superior */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#111827] tracking-tight">FICCT SIS</h1>
        <p className="text-gray-500 mt-2 text-lg">Sistema de Gestión Académica</p>
      </div>

      {/* Tarjeta de Login (Superficie: #FFFFFF) */}
      <div className="w-full max-w-md">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
          
          {/* Título de la tarjeta: #111827 */}
          <h2 className="text-xl font-semibold text-[#111827] mb-6">Iniciar Sesión</h2>

          {/* Mensaje de Error (usando colores de estado: error #DC2626) */}
          {error && (
            <div className="mb-6 bg-red-100 border-l-4 border-[#DC2626] p-4 text-sm text-red-700">
              <p className="font-medium">Ups, algo salió mal:</p>
              <ul className="mt-1.5 list-disc list-inside ml-2">
                <li>{error}</li>
              </ul>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input de Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-[#111827] mb-1.5"
              >
                Correo Institucional
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Estilo de input original de FICCT, con colores de la nueva paleta
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[#E5E7EB] text-[#111111]
                           focus:bg-white focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 
                           transition-all outline-none placeholder-gray-400"
                placeholder="admin@ficct.edu.bo" // Placeholder actualizado
                required
                autoFocus
              />
            </div>

            {/* Input de Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-[#111827]"
                >
                  Contraseña
                </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // Estilo de input original de FICCT, con colores de la nueva paleta
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[#E5E7EB] text-[#111111]
                           focus:bg-white focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 
                           transition-all outline-none placeholder-gray-400"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Opciones (Recordar / Olvidé) */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  id="remember_me" // ID para el checkbox
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  // Checkbox color Acento (malva): #8B5CF6
                  className="w-4 h-4 rounded border-gray-300 text-[#8B5CF6] focus:ring-[#8B5CF6]/50"
                />
                <span className="ml-2 block text-sm text-[#6B7280] cursor-pointer">
                  Recordar mi sesión
                </span>
              </label>
              <a 
                href="#" 
                // Link Secundario (dorado) #D4AF37 → hover #B78E1E
                className="text-sm font-medium text-[#D4AF37] hover:text-[#B78E1E]"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón de Submit (Dorado con texto oscuro) */}
            <button
              type="submit"
              disabled={loading}
              // Botón Dorado (#D4AF37) con texto oscuro (#111827)
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl font-semibold text-[#111827] bg-[#D4AF37] 
                         hover:bg-[#B78E1E] transition-all duration-200 
                         active:scale-[0.98] shadow-md hover:shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              {/* Icono de flecha */}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[#6B7280] mt-8">
          © {new Date().getFullYear()} FICCT UAGRM. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}

export default Login;
//```http://googleusercontent.com/image_generation_content/0
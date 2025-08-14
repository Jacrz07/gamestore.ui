const API_BASE_URL = 'https://gamestore-api-production.up.railway.app';
//const API_BASE_URL = 'http://localhost:8000';



const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const handleResponseSignUp = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    switch (response.status) {
      case 400:
        throw new Error('Este email ya está registrado. Intenta con otro email.');
      case 401:
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      case 403:
        throw new Error('No tienes permisos para realizar esta acción.');
      case 404:
        throw new Error('El recurso solicitado no fue encontrado.');
      case 409:
        throw new Error('El usuario ya existe en el sistema.');
      case 500:
        throw new Error('Error interno del servidor. Intenta nuevamente más tarde.');
      default:
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
};

const handleResponseLogin = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    switch (response.status) {
      case 400:
        throw new Error(errorData.message || 'Error al autenticar usuario.');
      case 401:
        throw new Error(errorData.message || 'Email o contraseña incorrectos.');
      case 403:
        throw new Error('Tu cuenta está bloqueada o no tienes permisos para acceder.');
      case 422:
        throw new Error('Verifique las credenciales enviadas');
      case 500:
        throw new Error('Error interno del servidor. Intenta nuevamente más tarde.');
      default:
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
};

const handleResponseCatalogs = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    switch (response.status) {
      case 400:
        throw new Error(errorData.message || 'Solicitud inválida. Revisa los datos enviados.');
      case 401:
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      case 403:
        throw new Error('No tienes permisos para realizar esta acción.');
      case 404:
        throw new Error('No introdujo cambios.');
      case 500:
        throw new Error('Error interno del servidor. Intenta nuevamente más tarde.');
      default:
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
};

const handleResponseInventary = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    switch (response.status) {
      case 400:
        throw new Error(errorData.message || 'Solicitud inválida. Revisa los datos enviados.');
      case 401:
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      case 403:
        throw new Error('No tienes permisos para realizar esta acción.');
      case 404:
        throw new Error('Inventario no encontrado');
      case 500:
        throw new Error('Error interno del servidor. Intenta nuevamente más tarde.');
      default:
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
};

export { API_BASE_URL, handleResponseSignUp, handleResponseLogin, handleResponseCatalogs, handleResponseInventary};




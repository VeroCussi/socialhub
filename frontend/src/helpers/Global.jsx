// export const Global = {
//     url: "http://localhost:3000/api/"
// }
//;

export const Global = {
    url: "http://localhost:3000/api/"
};

// Función para hacer peticiones HTTP con manejo automático de autenticación
export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token }),
        ...options.headers
    };

    const config = {
        ...options,
        headers: defaultHeaders
    };

    try {
        const response = await fetch(Global.url + endpoint, config);
        
        // Si el token ha expirado o es inválido
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('Error en petición API:', error);
        throw error;
    }
};

// Función para peticiones GET
export const apiGet = (endpoint) => {
    return apiRequest(endpoint, { method: 'GET' });
};

// Función para peticiones POST
export const apiPost = (endpoint, data) => {
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

// Función para peticiones PUT
export const apiPut = (endpoint, data) => {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
};

// Función para peticiones DELETE
export const apiDelete = (endpoint) => {
    return apiRequest(endpoint, { method: 'DELETE' });
};
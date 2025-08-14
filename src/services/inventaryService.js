import { API_BASE_URL, handleResponseInventary } from "./api";

export const inventaryService = {

    getAll: async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/inventary`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return await handleResponseInventary(response);
        } catch (error) {
            console.error('Error al obtener el inventario:', error);
            throw error;
        }
    },

    create: async (inventary) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/inventary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_catalog: inventary.id_catalog,
                    obtaining_date: inventary.obtaining_date,
                    initial_quantity: inventary.initial_quantity,
                    sold_quantity: inventary.sold_quantity,
                    active: inventary.active ?? true
                })
            });

            return await handleResponseInventary(response);
        } catch (error) {
            console.error('Error al crear inventario:', error);
            throw error;
        }
    },

    update: async (id, inventary) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/inventary/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_catalog: inventary.id_catalog,
                    obtaining_date: inventary.obtaining_date,
                    initial_quantity: inventary.initial_quantity,
                    sold_quantity: inventary.sold_quantity,
                    active: inventary.active ?? true
                })
            });

            return await handleResponseInventary(response);
        } catch (error) {
            console.error('Error al actualizar inventario:', error);
            throw error;
        }
    },

    deactivate: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/inventary/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return await handleResponseInventary(response);
        } catch (error) {
            console.error('Error al desactivar inventario:', error);
            throw error;
        }
    }
    

}
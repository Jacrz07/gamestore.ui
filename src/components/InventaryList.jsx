import { useState, useEffect } from 'react';
import { catalogService, inventaryService} from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import InventaryForm from './InventaryForm'

const InventaryList = () => {
    const [inventary, setInventary] = useState([]);
    const [catalogs, setCatalogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { validateToken } = useAuth();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (recentlyUpdated) {
            const timer = setTimeout(() => {
                setRecentlyUpdated(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [recentlyUpdated]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            // Cargamos el inventario (ya incluyen catalog_name)
            const inventaryData = await inventaryService.getAll();
            setInventary(Array.isArray(inventaryData) ? inventaryData : []);

            // Cargamos el catálogo para el formulario
            try {
                const catalogs = await catalogService.getAll();
                setCatalogs(Array.isArray(catalogs) ? catalogs : []);
            } catch (typeError) {
                console.warn('Error al cargar el catálogo', typeError);
                setCatalogs([]);
            }

        } catch (error) {
            console.error('Error al cargar inventario:', error);
            setError(error.message || 'Error al cargar el inventario');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        if (!validateToken()) {
            return;
        }

        const confirmed = window.confirm(
            `¿Estás seguro de desactivar el lote?\n\nEsta acción no se puede deshacer.`
        );

        if (confirmed) {
            try {
                setError('');
                await inventaryService.deactivate(item.id);
                
                await loadData();
                setSuccessMessage('inventario eliminado exitosamente');
            } catch (error) {
                console.error('Error al eliminar:', error);
                setError(error.message || 'Error al eliminar el lote');
            }
        }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadData();
        
        setRecentlyUpdated(savedItem.id);

        const message = isEdit ? 'Catálogo actualizado exitosamente' : 'Catálogo creado exitosamente';
        setSuccessMessage(message);
        
        setShowForm(false);
        setEditingItem(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-HN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Cargando inventario...</div>
            </div>
        );
    }
    
    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
                <button
                    onClick={handleCreate}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nuevo lote
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Juego
                            </th>
                            <th className="px-6 py-3 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider">
                                fecha de entrada
                            </th>
                            <th className="px-6 py-3 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider">
                                cantidad inicial
                            </th>
                            <th className="px-6 py-3 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider">
                                unidades vendidas
                            </th>
                            <th className="px-6 py-3 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inventary.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No hay lotes registrados
                                </td>
                            </tr>
                        ) : (
                            inventary.map((item) => (
                                <tr 
                                    key={item.id} 
                                    className={`hover:bg-gray-50 transition-colors ${
                                        recentlyUpdated === item.id 
                                            ? 'bg-green-50 border-l-4 border-green-400' 
                                            : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(item.obtaining_date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.initial_quantity}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.sold_quantity}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Editar
                                        </button>
                                        {item.active && (
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                desactivar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <InventaryForm
                    item={editingItem}
                    catalogs={catalogs}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </Layout>
    );
};

export default InventaryList;

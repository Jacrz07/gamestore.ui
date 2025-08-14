import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { inventaryService } from '../services';

const InventaryForm = ({ item, catalogs, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        id_catalog: item?.id_catalog || '',
        obtaining_date: item?.obtaining_date || '',
        initial_quantity: item?.initial_quantity || '',
        sold_quantity: item?.sold_quantity || '',
        active: item?.active ?? true
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!validateToken()) {
            return;
        }

        if (!formData.id_catalog.trim()) {
            setError('El catálogo es requerido');
            return;
        }

        if (!formData.obtaining_date.trim()) {
            setError('La descripción es requerida');
            return;
        }

        if (!formData.initial_quantity) {
            setError('la cantidad inicial es requerida');
            return;
        }

        if (parseFloat(formData.initial_quantity) <= 0) {
            setError('la cantidad inicial debe ser mayor a 0');
            return;
        }

        if (parseFloat(formData.sold_quantity) > formData.initial_quantity) {
            setError('la cantidad vendidada no puede ser mayor a la inicial');
            return;
        }


        setIsSubmitting(true);

        try {
            setError('');
            let savedItem;

            if (item) {
                savedItem = await inventaryService.update(item.id, formData);
                if (!savedItem) {
                    savedItem = { ...item, ...formData };
                }
                onSuccess(savedItem, true);
            } else {
                savedItem = await inventaryService.create(formData);
                if (!savedItem) {
                    savedItem = {
                        id: Date.now().toString(),
                        ...formData
                    };
                }
                onSuccess(savedItem, false);
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            setError(error.message || 'Error al guardar el inventario');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) {
            handleSubmit();
        }
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const activeCatalogs = catalogs.filter((type) => type.active);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {item ? 'Editar lote' : 'Nuevo lote'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            <div className="flex items-center">
                                <span className="mr-2">❌</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="id_catalog" className="block text-sm font-medium text-gray-700 mb-1">
                                catálogo *
                            </label>
                            <select
                                id="id_catalog"
                                name="id_catalog"
                                value={formData.id_catalog}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            >
                                <option value="">Seleccionar catálogo...</option>
                                {activeCatalogs.map((catalog) => (
                                    <option key={catalog.id} value={catalog.id}>
                                        {catalog.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="obtaining_date" className="block text-sm font-medium text-gray-700 mb-1">
                                fecha de entrada *
                            </label>
                            <input
                                type="date"
                                id="obtaining_date"
                                name="obtaining_date"
                                value={formatDate(formData.obtaining_date)}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength="100"
                                autoFocus={!item}
                            />
                        </div>

                        <div>
                            <label htmlFor="initial_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                cantidad inicial *
                            </label>
                            <input
                                type="number"
                                id="initial_quantity"
                                name="initial_quantity"
                                value={formData.initial_quantity}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="sold_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                unidades vendidas *
                            </label>
                            <textarea
                                type="number"
                                id="sold_quantity"
                                name="sold_quantity"
                                value={formData.sold_quantity}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                Activo
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventaryForm;


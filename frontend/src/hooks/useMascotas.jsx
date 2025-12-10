import { useState, useEffect } from 'react';
import api from '../api/client';

/**
 * Hook per gestionar mascotes des de l'API
 * 
 * @param {object} filters - Filtres opcionals (especie, genero, tamaño, busqueda)
 * @returns {object} { mascotas, loading, error, refetch }
 */
export default function useMascotas(filters = {}) {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMascotas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir query params
      const params = new URLSearchParams();
      if (filters.especie) params.append('especie', filters.especie.toUpperCase());
      if (filters.genero) params.append('genero', filters.genero.toUpperCase());
      if (filters.tamano) params.append('tamano', filters.tamano.toUpperCase());
      if (filters.tamaño) params.append('tamano', filters.tamaño.toUpperCase()); // Compatibilitat amb accent
      if (filters.busqueda) params.append('busqueda', filters.busqueda);
      
      const queryString = params.toString();
      const url = queryString ? `/mascota/?${queryString}` : '/mascota/';
      
      const res = await api.get(url);
      setMascotas(res.data);
    } catch (err) {
      console.error('Error carregant mascotes:', err);
      setError(err.response?.data?.detail || err.message || 'Error carregant mascotes');
      setMascotas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMascotas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { 
    mascotas, 
    loading, 
    error, 
    refetch: fetchMascotas 
  };
}

/**
 * Hook per obtenir mascotes d'una protectora específica
 */
export function useMyMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyMascotas = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/mascota/mis_mascotas/');
      setMascotas(res.data);
    } catch (err) {
      console.error('Error carregant les meves mascotes:', err);
      setError(err.response?.data?.detail || err.message || 'Error carregant mascotes');
      setMascotas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMascotas();
  }, []);

  return { 
    mascotas, 
    loading, 
    error, 
    refetch: fetchMyMascotas 
  };
}

/**
 * Hook per gestionar una mascota individual
 */
export function useMascota(id) {
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMascota = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/mascota/${id}/`);
      setMascota(res.data);
    } catch (err) {
      console.error('Error carregant mascota:', err);
      setError(err.response?.data?.detail || err.message || 'Error carregant mascota');
      setMascota(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMascota();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateMascota = async (data) => {
    try {
      const res = await api.patch(`/mascota/${id}/`, data);
      setMascota(res.data);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Error actualitzant mascota:', err);
      return { 
        success: false, 
        error: err.response?.data?.detail || err.message 
      };
    }
  };

  const deleteMascota = async () => {
    try {
      await api.delete(`/mascota/${id}/`);
      return { success: true };
    } catch (err) {
      console.error('Error eliminant mascota:', err);
      return { 
        success: false, 
        error: err.response?.data?.detail || err.message 
      };
    }
  };

  return { 
    mascota, 
    loading, 
    error, 
    refetch: fetchMascota,
    updateMascota,
    deleteMascota
  };
}

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function TinderPet() {
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    // Función que se encarga de cargar el siguiente animal
    const fetchNextAnimal = useCallback(() => {
        setLoading(true);
        setAnimal(null); // Limpiamos el animal anterior
        setMessage('');  // Limpiamos mensajes

        // Llama al endpoint de TinderPet Next
        axios.get('/api/tinderpet/next/')
            .then(response => {
                // Si la respuesta incluye un animal, lo mostramos
                if (response.data.id) {
                    setAnimal(response.data);
                } else {
                    // Si no hay más animales, mostramos el mensaje de "no quedan"
                    setAnimal({ message: response.data.message }); 
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al obtener el siguiente animal:", err);
                setError("Error al cargar. Verifique el servidor de Django.");
                setLoading(false);
            });
    }, []);

    // Se ejecuta al montar el componente
    useEffect(() => {
        fetchNextAnimal();
    }, [fetchNextAnimal]);


    // Función genérica para manejar las acciones (Like/Dislike)
    const handleAction = (actionType) => {
        if (!animal || animal.message) return; // No hacer nada si no hay animal

        const actionData = {
            animal_id: animal.id,
            action: actionType 
        };

        // Llama al endpoint de TinderPet Action (POST)
        axios.post('/api/tinderpet/action/', actionData)
            .then(response => {
                setMessage(`¡Acción ${actionType.toUpperCase()} registrada para ${animal.nombre}!`);
                // Después de la acción, cargamos el siguiente animal
                setTimeout(() => fetchNextAnimal(), 500); // Pequeño delay para el feedback visual
            })
            .catch(err => {
                console.error(`Error al registrar ${actionType}:`, err);
                setMessage(`Error: No se pudo registrar la acción.`);
            });
    };

    // --- Renderizado ---
    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px' }}>Buscando la siguiente mascota...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red', fontSize: '20px' }}>{error}</div>;

    // Si no quedan animales disponibles
    if (animal && animal.message) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '24px', color: '#6c757d' }}>
                {animal.message}
            </div>
        );
    }
    
    // Si hay un animal para mostrar
    const imagePlaceholder = animal.especie === 'Perro' ? '🐾' : '🐈';
    const cardColor = animal.especie === 'Perro' ? '#e6f7ff' : '#fff0f0'; 

    return (
        <div style={{ 
            maxWidth: '600px', 
            margin: '50px auto', 
            textAlign: 'center',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '15px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            backgroundColor: cardColor
        }}>
            <h1 style={{ color: '#007bff' }}>Mascota para TinderPet</h1>

            {/* Mensajes de feedback */}
            {message && (
                <div style={{ 
                    color: '#28a745', 
                    fontWeight: 'bold', 
                    marginBottom: '15px',
                    fontSize: '18px'
                }}>
                    {message}
                </div>
            )}

            {/* Ficha del Animal */}
            <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
                <div style={{ 
                    height: '200px', 
                    backgroundColor: '#ced4da', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    fontSize: '100px',
                    borderRadius: '8px',
                    marginBottom: '15px'
                }}>
                    {imagePlaceholder}
                </div>
                
                <h2 style={{ margin: '0 0 5px 0' }}>{animal.nombre}</h2>
                <p style={{ color: '#6c757d' }}>{animal.especie}, {animal.raza} | {animal.edad_años} año(s)</p>
                
                <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Historia Breve:</p>
                    <p style={{ margin: 0 }}>{animal.historia_breve}</p>
                </div>
            </div>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
                <button 
                    onClick={() => handleAction('dislike')}
                    style={{
                        padding: '15px 30px',
                        fontSize: '20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    ❌ No Me Gusta
                </button>
                <button 
                    onClick={() => handleAction('like')}
                    style={{
                        padding: '15px 30px',
                        fontSize: '20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    ✅ Me Gusta
                </button>
            </div>
        </div>
    );
}

export default TinderPet;
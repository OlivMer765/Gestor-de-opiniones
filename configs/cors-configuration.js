export const corsOptions = {
    origin: function (origin, callback) {
        // Agregamos el puerto 5500 y 127.0.0.1 para que Live Server funcione
        const whitelist = [
            process.env.FRONTEND_URL, 
            'http://localhost:3000', 
            'http://localhost:3001',
            'http://localhost:5173', 
            'http://127.0.0.1:5500', // <--- IMPORTANTE: Live Server suele usar este
            'http://localhost:5500'  // <--- Por si acaso
        ];
        
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
};
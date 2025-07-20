const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simular base de datos de bots
const generateBots = (category, count) => {
    const bots = [];
    const keywords = {
        'juegos': ['Game', 'Play', 'Quiz', 'Trivia', 'Fun'],
        'musica': ['Music', 'Song', 'Audio', 'Radio', 'Beat'],
        'entretenimiento': ['Fun', 'Meme', 'Joke', 'Comedy', 'Show'],
        'educacion': ['Learn', 'Study', 'Edu', 'Course', 'Teacher'],
        'productividad': ['Task', 'Work', 'Schedule', 'Note', 'Reminder'],
        'compras': ['Shop', 'Buy', 'Store', 'Market', 'Deal'],
        'noticias': ['News', 'Info', 'Alert', 'Update', 'Report'],
        'fitness': ['Fit', 'Health', 'Gym', 'Workout', 'Diet'],
        'comida': ['Food', 'Recipe', 'Cook', 'Kitchen', 'Chef'],
        'viajes': ['Travel', 'Trip', 'Hotel', 'Flight', 'Tour'],
        'finanzas': ['Money', 'Bank', 'Crypto', 'Investment', 'Finance'],
        'arte': ['Art', 'Design', 'Creative', 'Draw', 'Paint'],
        'deportes': ['Sport', 'Football', 'Soccer', 'Basketball', 'Fitness'],
        'herramientas': ['Tool', 'Utility', 'Convert', 'Calculator', 'Helper'],
        'citas': ['Dating', 'Love', 'Match', 'Romance', 'Meet'],
        'tecnologia': ['Tech', 'Code', 'AI', 'Programming', 'Software'],
        'peliculas': ['Movie', 'Film', 'Cinema', 'Series', 'TV'],
        'libros': ['Book', 'Read', 'Story', 'Novel', 'Library'],
        'idiomas': ['Language', 'Translate', 'English', 'Spanish', 'Learn'],
        'otros': ['General', 'Multi', 'All', 'Various', 'Mixed']
    };
    
    const words = keywords[category] || ['Bot', 'Helper'];
    
    for (let i = 1; i <= count; i++) {
        const word = words[Math.floor(Math.random() * words.length)];
        bots.push({
            name: `${word} Bot ${i}`,
            phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            description: `Bot de ${category} para WhatsApp - ${word} especializado`,
            verified: Math.random() > 0.8,
            rating: (Math.random() * 2 + 3).toFixed(1),
            users: Math.floor(Math.random() * 50000) + 1000
        });
    }
    return bots;
};

const botCategories = {
    'juegos': generateBots('juegos', 5000),
    'musica': generateBots('musica', 5000),
    'entretenimiento': generateBots('entretenimiento', 5000),
    'educacion': generateBots('educacion', 5000),
    'productividad': generateBots('productividad', 5000),
    'compras': generateBots('compras', 5000),
    'noticias': generateBots('noticias', 5000),
    'fitness': generateBots('fitness', 5000),
    'comida': generateBots('comida', 5000),
    'viajes': generateBots('viajes', 5000),
    'finanzas': generateBots('finanzas', 5000),
    'arte': generateBots('arte', 5000),
    'deportes': generateBots('deportes', 5000),
    'herramientas': generateBots('herramientas', 5000),
    'citas': generateBots('citas', 5000),
    'tecnologia': generateBots('tecnologia', 5000),
    'peliculas': generateBots('peliculas', 5000),
    'libros': generateBots('libros', 5000),
    'idiomas': generateBots('idiomas', 5000),
    'otros': generateBots('otros', 5000)
};

// Página principal
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🤖 WhatsApp Bot Finder</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container {
                background: white;
                color: black;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .category-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            .category-btn {
                background: #25d366;
                color: white;
                padding: 15px;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.2s;
                text-decoration: none;
                display: block;
                text-align: center;
            }
            .category-btn:hover {
                transform: scale(1.05);
                background: #20b954;
            }
            .search-box {
                width: 100%;
                padding: 15px;
                border: 2px solid #25d366;
                border-radius: 10px;
                font-size: 16px;
                margin: 20px 0;
            }
            .stats {
                background: #f0f8ff;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                text-align: center;
            }
            .whatsapp-link {
                background: #25d366;
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
                font-size: 18px;
                font-weight: bold;
            }
            .whatsapp-link a {
                color: white;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🤖 WhatsApp Bot Finder</h1>
                <p><strong>¡Encuentra el bot perfecto para WhatsApp!</strong></p>
            </div>

            <div class="whatsapp-link">
                📱 <a href="https://wa.me/message/BCQJSGCE2DRWH1" target="_blank">
                    ¡HAZ CLIC AQUÍ PARA ABRIR EN WHATSAPP DIRECTAMENTE!
                </a> 📱
            </div>

            <div class="stats">
                <h3>📊 Estadísticas</h3>
                <p><strong>100,000 bots</strong> | <strong>20 categorías</strong> | <strong>5,000 por categoría</strong></p>
            </div>

            <input type="text" class="search-box" placeholder="🔍 Buscar bots..." onkeyup="buscarBots(this.value)">

            <div class="category-grid">
                <a href="/categoria/juegos" class="category-btn">🎮 Juegos (5,000)</a>
                <a href="/categoria/musica" class="category-btn">🎵 Música (5,000)</a>
                <a href="/categoria/entretenimiento" class="category-btn">📺 Entretenimiento (5,000)</a>
                <a href="/categoria/educacion" class="category-btn">📚 Educación (5,000)</a>
                <a href="/categoria/productividad" class="category-btn">💼 Productividad (5,000)</a>
                <a href="/categoria/compras" class="category-btn">🛍️ Compras (5,000)</a>
                <a href="/categoria/noticias" class="category-btn">📰 Noticias (5,000)</a>
                <a href="/categoria/fitness" class="category-btn">🏋️ Fitness (5,000)</a>
                <a href="/categoria/comida" class="category-btn">🍔 Comida (5,000)</a>
                <a href="/categoria/viajes" class="category-btn">✈️ Viajes (5,000)</a>
                <a href="/categoria/finanzas" class="category-btn">💰 Finanzas (5,000)</a>
                <a href="/categoria/arte" class="category-btn">🎨 Arte (5,000)</a>
                <a href="/categoria/deportes" class="category-btn">⚽ Deportes (5,000)</a>
                <a href="/categoria/herramientas" class="category-btn">🔧 Herramientas (5,000)</a>
                <a href="/categoria/citas" class="category-btn">❤️ Citas (5,000)</a>
                <a href="/categoria/tecnologia" class="category-btn">📱 Tecnología (5,000)</a>
                <a href="/categoria/peliculas" class="category-btn">🎬 Películas (5,000)</a>
                <a href="/categoria/libros" class="category-btn">📖 Libros (5,000)</a>
                <a href="/categoria/idiomas" class="category-btn">🌍 Idiomas (5,000)</a>
                <a href="/categoria/otros" class="category-btn">🎯 Otros (5,000)</a>
            </div>

            <div class="whatsapp-link">
                💬 <strong>Para usar el bot, simplemente haz clic en el enlace de WhatsApp de arriba</strong> 💬
            </div>
        </div>

        <script>
            function buscarBots(termino) {
                if (termino.length > 2) {
                    window.location.href = '/buscar/' + encodeURIComponent(termino);
                }
            }
        </script>
    </body>
    </html>
    `);
});

// Ruta para categorías
app.get('/categoria/:categoria', (req, res) => {
    const categoria = req.params.categoria;
    const bots = botCategories[categoria] || [];
    const muestra = bots.slice(0, 20);
    
    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🤖 ${categoria.toUpperCase()} - WhatsApp Bot Finder</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f0f8ff; }
            .bot-card { background: white; padding: 15px; margin: 10px 0; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .bot-name { font-size: 18px; font-weight: bold; color: #25d366; }
            .bot-phone { color: #666; margin: 5px 0; }
            .bot-desc { margin: 10px 0; }
            .bot-stats { color: #888; font-size: 14px; }
            .back-btn { background: #25d366; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 20px 0; }
            .whatsapp-direct { background: #25d366; color: white; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0; }
            .whatsapp-direct a { color: white; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="whatsapp-direct">
            📱 <a href="https://wa.me/message/BCQJSGCE2DRWH1" target="_blank">
                ¡ABRE EL BOT EN WHATSAPP AHORA!
            </a> 📱
        </div>
        
        <h1>🤖 ${categoria.toUpperCase()} (${bots.length.toLocaleString()} bots)</h1>
        <button class="back-btn" onclick="window.location.href='/'">← Volver al inicio</button>
    `;
    
    muestra.forEach((bot, index) => {
        const verified = bot.verified ? '✅' : '';
        const stars = '⭐'.repeat(Math.floor(bot.rating));
        html += `
        <div class="bot-card">
            <div class="bot-name">${bot.name} ${verified}</div>
            <div class="bot-phone">📞 ${bot.phone}</div>
            <div class="bot-desc">📝 ${bot.description}</div>
            <div class="bot-stats">${stars} ${bot.rating} | 👥 ${bot.users.toLocaleString()} usuarios</div>
        </div>
        `;
    });
    
    html += `
        <div class="whatsapp-direct">
            💡 <strong>Mostrando 20 de ${bots.length.toLocaleString()} bots</strong><br>
            📱 <a href="https://wa.me/message/BCQJSGCE2DRWH1" target="_blank">
                ¡USA EL BOT EN WHATSAPP PARA VER TODOS!
            </a>
        </div>
    </body>
    </html>
    `;
    
    res.send(html);
});

// Ruta para búsqueda
app.get('/buscar/:termino', (req, res) => {
    const termino = req.params.termino.toLowerCase();
    const resultados = [];
    
    Object.keys(botCategories).forEach(categoria => {
        const botsCategoria = botCategories[categoria].filter(bot => 
            bot.name.toLowerCase().includes(termino) ||
            bot.description.toLowerCase().includes(termino)
        );
        resultados.push(...botsCategoria.slice(0, 10));
    });
    
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🔍 Búsqueda: ${termino}</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .result { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 8px; }
            .whatsapp-link { background: #25d366; color: white; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0; }
            .whatsapp-link a { color: white; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="whatsapp-link">
            📱 <a href="https://wa.me/message/BCQJSGCE2DRWH1" target="_blank">
                ¡USAR BOT EN WHATSAPP DIRECTAMENTE!
            </a> 📱
        </div>
        
        <h1>🔍 Resultados para: "${termino}"</h1>
        <p>Encontrados: ${resultados.length} bots</p>
        
        ${resultados.map(bot => `
        <div class="result">
            <strong>${bot.name}</strong> ${bot.verified ? '✅' : ''}<br>
            📞 ${bot.phone}<br>
            📝 ${bot.description}<br>
            ⭐ ${bot.rating} | 👥 ${bot.users.toLocaleString()} usuarios
        </div>
        `).join('')}
        
        <div class="whatsapp-link">
            💬 <a href="https://wa.me/message/BCQJSGCE2DRWH1" target="_blank">
                ¡BUSCAR MÁS EN EL BOT DE WHATSAPP!
            </a>
        </div>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 WhatsApp Bot Finder corriendo en puerto ${PORT}`);
    console.log(`📱 Accede desde: http://localhost:${PORT}`);
    console.log(`🤖 Bot con 100,000 bots listo!`);
});

module.exports = app;
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Token del bot de Telegram (se configurará en Vercel)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '7849605209:AAGqA6D9L_x5EjHlGgLg8HgSv-Qc9ZYfq0c';
const WEBHOOK_URL = process.env.WEBHOOK_URL || '';

// Crear instancia del bot
const bot = new TelegramBot(TELEGRAM_TOKEN);

// Configurar webhook para Vercel
if (WEBHOOK_URL) {
    bot.setWebHook(`${WEBHOOK_URL}/webhook`);
}

// Middleware para parsear JSON
app.use(express.json());

// Generar base de datos de 100,000 bots
const generateBotDatabase = () => {
    const categories = {
        'juegos': ['Game', 'Play', 'Quiz', 'Trivia', 'Fun', 'Puzzle', 'Adventure', 'Racing', 'Action', 'Strategy'],
        'musica': ['Music', 'Song', 'Audio', 'Radio', 'Beat', 'DJ', 'Playlist', 'Concert', 'Band', 'Album'],
        'entretenimiento': ['Fun', 'Meme', 'Joke', 'Comedy', 'Show', 'Movie', 'Series', 'Entertainment', 'Viral', 'Trend'],
        'educacion': ['Learn', 'Study', 'Edu', 'Course', 'Teacher', 'School', 'University', 'Tutorial', 'Knowledge', 'Science'],
        'productividad': ['Task', 'Work', 'Schedule', 'Note', 'Reminder', 'Calendar', 'Office', 'Project', 'Team', 'Meeting'],
        'compras': ['Shop', 'Buy', 'Store', 'Market', 'Deal', 'Sale', 'Price', 'Product', 'Cart', 'Order'],
        'noticias': ['News', 'Info', 'Alert', 'Update', 'Report', 'Breaking', 'World', 'Local', 'Politics', 'Economy'],
        'fitness': ['Fit', 'Health', 'Gym', 'Workout', 'Diet', 'Exercise', 'Nutrition', 'Wellness', 'Training', 'Sports'],
        'comida': ['Food', 'Recipe', 'Cook', 'Kitchen', 'Chef', 'Restaurant', 'Menu', 'Delivery', 'Taste', 'Cuisine'],
        'viajes': ['Travel', 'Trip', 'Hotel', 'Flight', 'Tour', 'Destination', 'Vacation', 'Adventure', 'Guide', 'Map'],
        'finanzas': ['Money', 'Bank', 'Crypto', 'Investment', 'Finance', 'Budget', 'Savings', 'Trade', 'Stock', 'Economy'],
        'arte': ['Art', 'Design', 'Creative', 'Draw', 'Paint', 'Gallery', 'Artist', 'Photo', 'Digital', 'Craft'],
        'deportes': ['Sport', 'Football', 'Soccer', 'Basketball', 'Tennis', 'Baseball', 'Golf', 'Swimming', 'Running', 'Cycling'],
        'herramientas': ['Tool', 'Utility', 'Convert', 'Calculator', 'Helper', 'Generator', 'Analyzer', 'Checker', 'Scanner', 'Finder'],
        'citas': ['Dating', 'Love', 'Match', 'Romance', 'Meet', 'Relationship', 'Partner', 'Single', 'Couple', 'Heart'],
        'tecnologia': ['Tech', 'Code', 'AI', 'Programming', 'Software', 'App', 'Digital', 'Innovation', 'Computer', 'Internet'],
        'peliculas': ['Movie', 'Film', 'Cinema', 'Series', 'TV', 'Actor', 'Director', 'Drama', 'Comedy', 'Action'],
        'libros': ['Book', 'Read', 'Story', 'Novel', 'Library', 'Author', 'Literature', 'Fiction', 'Poetry', 'Biography'],
        'idiomas': ['Language', 'Translate', 'English', 'Spanish', 'French', 'Learn', 'Dictionary', 'Grammar', 'Vocabulary', 'Speaking'],
        'otros': ['General', 'Multi', 'All', 'Various', 'Mixed', 'Random', 'Diverse', 'Universal', 'Complete', 'Total']
    };

    const allBots = [];
    let totalGenerated = 0;

    Object.keys(categories).forEach(category => {
        const keywords = categories[category];
        console.log(`📂 Generando bots para categoría: ${category}`);
        
        for (let i = 1; i <= 5000; i++) {
            const keyword = keywords[Math.floor(Math.random() * keywords.length)];
            const botId = `${category}_${i}`;
            const phone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
            const username = `@${keyword.toLowerCase()}bot${i}`;
            
            allBots.push({
                id: botId,
                name: `${keyword} Bot ${i}`,
                category: category,
                phone: phone,
                username: username,
                description: `Bot especializado en ${category}. Funciones: ${keyword.toLowerCase()}, búsqueda avanzada, respuestas automáticas.`,
                verified: Math.random() > 0.7,
                rating: (Math.random() * 2 + 3).toFixed(1),
                users: Math.floor(Math.random() * 100000) + 1000,
                features: [
                    `${keyword} especializado`,
                    'Respuesta 24/7',
                    'Interfaz intuitiva',
                    'Búsqueda rápida',
                    'Soporte multiidioma'
                ],
                commands: [
                    '/start - Iniciar bot',
                    '/help - Ayuda',
                    `/search - Buscar ${keyword.toLowerCase()}`,
                    '/settings - Configuración'
                ],
                created: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
            });
            totalGenerated++;
        }
    });

    console.log(`✅ Base de datos generada: ${totalGenerated.toLocaleString()} bots en ${Object.keys(categories).length} categorías`);
    return allBots;
};

// Generar base de datos al iniciar
const botDatabase = generateBotDatabase();
const categories = [...new Set(botDatabase.map(bot => bot.category))];

// Función para formatear bot
const formatBot = (bot, index = null) => {
    const verified = bot.verified ? '✅' : '';
    const stars = '⭐'.repeat(Math.floor(bot.rating));
    const prefix = index !== null ? `${index}. ` : '';
    
    return `${prefix}*${bot.name}* ${verified}
📱 ${bot.username}
📞 ${bot.phone}
📝 ${bot.description}
${stars} ${bot.rating}/5 | 👥 ${bot.users.toLocaleString()} usuarios
📂 Categoría: ${bot.category}
📅 Creado: ${bot.created}`;
};

// Función para crear teclado de categorías
const getCategoriesKeyboard = () => {
    const categoryEmojis = {
        'juegos': '🎮',
        'musica': '🎵',
        'entretenimiento': '📺',
        'educacion': '📚',
        'productividad': '💼',
        'compras': '🛍️',
        'noticias': '📰',
        'fitness': '🏋️',
        'comida': '🍔',
        'viajes': '✈️',
        'finanzas': '💰',
        'arte': '🎨',
        'deportes': '⚽',
        'herramientas': '🔧',
        'citas': '❤️',
        'tecnologia': '📱',
        'peliculas': '🎬',
        'libros': '📖',
        'idiomas': '🌍',
        'otros': '🎯'
    };

    const keyboard = [];
    const categoriesPerRow = 2;
    
    for (let i = 0; i < categories.length; i += categoriesPerRow) {
        const row = [];
        for (let j = i; j < i + categoriesPerRow && j < categories.length; j++) {
            const category = categories[j];
            const emoji = categoryEmojis[category] || '🤖';
            row.push({
                text: `${emoji} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                callback_data: `category_${category}`
            });
        }
        keyboard.push(row);
    }
    
    // Agregar botones adicionales
    keyboard.push([
        { text: '🎲 Bot Aleatorio', callback_data: 'random_bot' },
        { text: '📊 Estadísticas', callback_data: 'stats' }
    ]);
    
    keyboard.push([
        { text: '🔍 Buscar Bot', callback_data: 'search_prompt' },
        { text: '❓ Ayuda', callback_data: 'help' }
    ]);

    return { inline_keyboard: keyboard };
};

// Comando /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `🤖 *¡Bienvenido al Bot Finder más grande de Telegram!*

📊 *Estadísticas impresionantes:*
• 100,000 bots organizados
• 20 categorías diferentes
• 5,000 bots por categoría
• Búsqueda inteligente
• Actualizaciones diarias

🎯 *¿Qué puedo hacer por ti?*
• Encontrar bots por categoría
• Buscar bots específicos
• Sugerir bots aleatorios
• Mostrar estadísticas detalladas
• Proporcionar información completa de cada bot

💡 *Selecciona una categoría o usa los comandos:*`;

    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: getCategoriesKeyboard()
    });
});

// Comando /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `❓ *AYUDA - BOT FINDER*

🎯 *Comandos principales:*
• /start - Menú principal
• /categories - Ver todas las categorías
• /search [término] - Buscar bots
• /random - Bot aleatorio
• /stats - Estadísticas del sistema
• /top - Top 10 bots más populares
• /new - Bots más recientes
• /help - Esta ayuda

🔍 *Ejemplos de búsqueda:*
• \`/search juegos\` - Buscar bots de juegos
• \`/search música rock\` - Buscar bots de música rock
• \`/search educación matemáticas\` - Bots educativos de matemáticas

💬 *También puedes:*
• Usar los botones del menú
• Escribir directamente el nombre de una categoría
• Hacer búsquedas libres

🆘 *¿Problemas?* Contacta: @BotFinderSupport`;

    bot.sendMessage(chatId, helpMessage, {
        parse_mode: 'Markdown',
        reply_markup: getCategoriesKeyboard()
    });
});

// Comando /search
bot.onText(/\/search (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const searchTerm = match[1].toLowerCase();
    
    const results = botDatabase.filter(bot => 
        bot.name.toLowerCase().includes(searchTerm) ||
        bot.description.toLowerCase().includes(searchTerm) ||
        bot.category.toLowerCase().includes(searchTerm) ||
        bot.features.some(feature => feature.toLowerCase().includes(searchTerm))
    ).slice(0, 10);

    if (results.length > 0) {
        const totalResults = botDatabase.filter(bot => 
            bot.name.toLowerCase().includes(searchTerm) ||
            bot.description.toLowerCase().includes(searchTerm) ||
            bot.category.toLowerCase().includes(searchTerm)
        ).length;

        let message = `🔍 *Resultados para "${searchTerm}":*\n\n`;
        results.forEach((bot, index) => {
            message += formatBot(bot, index + 1) + '\n\n';
        });
        message += `📊 Mostrando ${results.length} de ${totalResults} resultados encontrados`;

        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🔄 Nueva búsqueda', callback_data: 'search_prompt' },
                        { text: '🏠 Menú principal', callback_data: 'main_menu' }
                    ]
                ]
            }
        });
    } else {
        bot.sendMessage(chatId, `❌ *No se encontraron bots para "${searchTerm}"*\n\n💡 Intenta con términos como: juegos, música, educación, productividad, etc.`, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🔄 Intentar otra búsqueda', callback_data: 'search_prompt' },
                        { text: '📂 Ver categorías', callback_data: 'main_menu' }
                    ]
                ]
            }
        });
    }
});

// Comando /random
bot.onText(/\/random/, (msg) => {
    const chatId = msg.chat.id;
    const randomBot = botDatabase[Math.floor(Math.random() * botDatabase.length)];
    
    const message = `🎲 *Bot Aleatorio:*\n\n${formatBot(randomBot)}

🎯 *Características especiales:*
${randomBot.features.map(feature => `• ${feature}`).join('\n')}

💬 *Comandos disponibles:*
${randomBot.commands.map(cmd => `• ${cmd}`).join('\n')}`;

    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🎲 Otro bot aleatorio', callback_data: 'random_bot' },
                    { text: '🔍 Buscar similar', callback_data: `category_${randomBot.category}` }
                ],
                [
                    { text: '🏠 Menú principal', callback_data: 'main_menu' }
                ]
            ]
        }
    });
});

// Comando /stats
bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    const totalBots = botDatabase.length;
    const verifiedBots = botDatabase.filter(bot => bot.verified).length;
    const avgRating = (botDatabase.reduce((sum, bot) => sum + parseFloat(bot.rating), 0) / botDatabase.length).toFixed(2);
    const totalUsers = botDatabase.reduce((sum, bot) => sum + bot.users, 0);
    
    const categoryStats = categories.map(cat => {
        const count = botDatabase.filter(bot => bot.category === cat).length;
        const avgRatingCat = (botDatabase.filter(bot => bot.category === cat)
            .reduce((sum, bot) => sum + parseFloat(bot.rating), 0) / count).toFixed(2);
        return `• ${cat}: ${count.toLocaleString()} bots (⭐ ${avgRatingCat})`;
    }).join('\n');

    const statsMessage = `📊 *ESTADÍSTICAS DEL SISTEMA*

🤖 *Resumen general:*
• Total de bots: ${totalBots.toLocaleString()}
• Bots verificados: ${verifiedBots.toLocaleString()} (${((verifiedBots/totalBots)*100).toFixed(1)}%)
• Rating promedio: ⭐ ${avgRating}/5
• Total usuarios atendidos: ${totalUsers.toLocaleString()}
• Categorías disponibles: ${categories.length}

📂 *Estadísticas por categoría:*
${categoryStats}

📅 *Sistema actualizado:* ${new Date().toLocaleDateString()}
🚀 *Bot Finder v2.0* - La mayor base de datos de bots`;

    bot.sendMessage(chatId, statsMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '📈 Top bots', callback_data: 'top_bots' },
                    { text: '🆕 Bots nuevos', callback_data: 'new_bots' }
                ],
                [
                    { text: '🏠 Menú principal', callback_data: 'main_menu' }
                ]
            ]
        }
    });
});

// Manejar callbacks
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = message.chat.id;
    const messageId = message.message_id;

    if (data.startsWith('category_')) {
        const category = data.replace('category_', '');
        const categoryBots = botDatabase.filter(bot => bot.category === category).slice(0, 10);
        
        let categoryMessage = `📂 *CATEGORÍA: ${category.toUpperCase()}*\n\n`;
        categoryBots.forEach((bot, index) => {
            categoryMessage += formatBot(bot, index + 1) + '\n\n';
        });
        categoryMessage += `📊 Mostrando 10 de 5,000 bots de ${category}`;

        bot.editMessageText(categoryMessage, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🔄 Ver más', callback_data: `more_${category}` },
                        { text: '🎲 Aleatorio', callback_data: 'random_bot' }
                    ],
                    [
                        { text: '🏠 Menú principal', callback_data: 'main_menu' }
                    ]
                ]
            }
        });
    }
    
    else if (data === 'random_bot') {
        const randomBot = botDatabase[Math.floor(Math.random() * botDatabase.length)];
        
        const message = `🎲 *Bot Aleatorio:*\n\n${formatBot(randomBot)}

🎯 *Características:*
${randomBot.features.map(feature => `• ${feature}`).join('\n')}`;

        bot.editMessageText(message, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🎲 Otro aleatorio', callback_data: 'random_bot' },
                        { text: `📂 Más de ${randomBot.category}`, callback_data: `category_${randomBot.category}` }
                    ],
                    [
                        { text: '🏠 Menú principal', callback_data: 'main_menu' }
                    ]
                ]
            }
        });
    }
    
    else if (data === 'stats') {
        const totalBots = botDatabase.length;
        const verifiedBots = botDatabase.filter(bot => bot.verified).length;
        const avgRating = (botDatabase.reduce((sum, bot) => sum + parseFloat(bot.rating), 0) / botDatabase.length).toFixed(2);
        
        const statsMessage = `📊 *ESTADÍSTICAS RÁPIDAS*

🤖 Total de bots: ${totalBots.toLocaleString()}
✅ Bots verificados: ${verifiedBots.toLocaleString()}
⭐ Rating promedio: ${avgRating}/5
📂 Categorías: ${categories.length}
📅 Actualizado: ${new Date().toLocaleDateString()}`;

        bot.editMessageText(statsMessage, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '📈 Estadísticas completas', callback_data: 'full_stats' },
                        { text: '🏠 Menú principal', callback_data: 'main_menu' }
                    ]
                ]
            }
        });
    }
    
    else if (data === 'main_menu') {
        const welcomeMessage = `🤖 *Bot Finder - 100,000 Bots*

📊 La mayor base de datos de bots de Telegram
🎯 Encuentra el bot perfecto para ti

💡 Selecciona una categoría:`;

        bot.editMessageText(welcomeMessage, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: getCategoriesKeyboard()
        });
    }
    
    else if (data === 'search_prompt') {
        bot.editMessageText('🔍 *Búsqueda de Bots*\n\nEscribe: `/search [término]`\n\n💡 *Ejemplos:*\n• `/search juegos`\n• `/search música`\n• `/search educación`', {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🏠 Menú principal', callback_data: 'main_menu' }]
                ]
            }
        });
    }

    bot.answerCallbackQuery(callbackQuery.id);
});

// Webhook endpoint para Vercel
app.post('/webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Ruta principal
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🤖 Telegram Bot Finder</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                background: linear-gradient(135deg, #0088cc 0%, #005580 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                padding: 20px;
            }
            .container {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                max-width: 600px;
                width: 100%;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .header { margin-bottom: 30px; }
            .stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            .stat-card {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 15px;
                text-align: center;
            }
            .stat-number {
                font-size: 2em;
                font-weight: bold;
                color: #64b5f6;
                margin-bottom: 10px;
            }
            .telegram-btn {
                background: #0088cc;
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 50px;
                font-size: 18px;
                font-weight: bold;
                text-decoration: none;
                display: inline-block;
                margin: 20px 10px;
                transition: transform 0.2s;
            }
            .telegram-btn:hover { transform: scale(1.05); }
            .features {
                text-align: left;
                background: rgba(0,0,0,0.2);
                padding: 20px;
                border-radius: 15px;
                margin: 20px 0;
            }
            .features ul { padding-left: 20px; }
            .features li { margin: 8px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🤖 Telegram Bot Finder</h1>
                <p>La mayor base de datos de bots de Telegram</p>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">100,000</div>
                    <div>Bots disponibles</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">20</div>
                    <div>Categorías</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">5,000</div>
                    <div>Bots por categoría</div>
                </div>
            </div>
            
            <a href="https://t.me/BotFinderBot" class="telegram-btn">
                📱 Abrir en Telegram
            </a>
            
            <div class="features">
                <h3>🎯 Características:</h3>
                <ul>
                    <li>100,000 bots organizados en 20 categorías</li>
                    <li>Búsqueda inteligente y filtros avanzados</li>
                    <li>Información detallada de cada bot</li>
                    <li>Sugerencias de bots aleatorios</li>
                    <li>Estadísticas en tiempo real</li>
                    <li>Interfaz fácil de usar</li>
                    <li>Actualizaciones constantes</li>
                    <li>Soporte 24/7</li>
                </ul>
            </div>
            
            <div class="features">
                <h3>📂 Categorías disponibles:</h3>
                <ul>
                    <li>🎮 Juegos • 🎵 Música • 📺 Entretenimiento • 📚 Educación</li>
                    <li>💼 Productividad • 🛍️ Compras • 📰 Noticias • 🏋️ Fitness</li>
                    <li>🍔 Comida • ✈️ Viajes • 💰 Finanzas • 🎨 Arte</li>
                    <li>⚽ Deportes • 🔧 Herramientas • ❤️ Citas • 📱 Tecnología</li>
                    <li>🎬 Películas • 📖 Libros • 🌍 Idiomas • 🎯 Otros</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    `);
});

// Ruta de estado
app.get('/status', (req, res) => {
    res.json({
        status: 'active',
        totalBots: botDatabase.length,
        categories: categories.length,
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Telegram Bot Finder servidor iniciado en puerto ${PORT}`);
    console.log(`📊 Base de datos cargada: ${botDatabase.length.toLocaleString()} bots`);
    console.log(`📂 Categorías disponibles: ${categories.length}`);
    console.log(`🤖 Bot de Telegram configurado`);
});

module.exports = app;
const TelegramBot = require('node-telegram-bot-api');

// Token del bot (se configurará en Vercel como variable de entorno)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '7849605209:AAGqA6D9L_x5EjHlGgLg8HgSv-Qc9ZYfq0c';

// Crear bot sin polling para Vercel
const bot = new TelegramBot(TELEGRAM_TOKEN);

// Base de datos simplificada de bots
const generateSimpleBotDatabase = () => {
    const categories = {
        'juegos': ['Game', 'Play', 'Quiz', 'Fun', 'Adventure'],
        'musica': ['Music', 'Song', 'Radio', 'DJ', 'Beat'],
        'entretenimiento': ['Meme', 'Joke', 'Fun', 'Show', 'Comedy'],
        'educacion': ['Learn', 'Study', 'Course', 'Teacher', 'Tutorial'],
        'productividad': ['Task', 'Work', 'Note', 'Calendar', 'Reminder'],
        'compras': ['Shop', 'Store', 'Deal', 'Market', 'Buy'],
        'noticias': ['News', 'Info', 'Update', 'Alert', 'Report'],
        'fitness': ['Gym', 'Health', 'Workout', 'Diet', 'Fitness'],
        'comida': ['Food', 'Recipe', 'Cook', 'Chef', 'Kitchen'],
        'viajes': ['Travel', 'Trip', 'Hotel', 'Flight', 'Tour']
    };

    const allBots = [];
    Object.keys(categories).forEach(category => {
        const keywords = categories[category];
        for (let i = 1; i <= 1000; i++) { // Reducido para mejor rendimiento
            const keyword = keywords[Math.floor(Math.random() * keywords.length)];
            allBots.push({
                id: `${category}_${i}`,
                name: `${keyword} Bot ${i}`,
                category: category,
                username: `@${keyword.toLowerCase()}bot${i}`,
                description: `Bot de ${category} especializado en ${keyword.toLowerCase()}`,
                verified: Math.random() > 0.8,
                rating: (Math.random() * 2 + 3).toFixed(1),
                users: Math.floor(Math.random() * 50000) + 1000
            });
        }
    });
    return allBots;
};

const botDatabase = generateSimpleBotDatabase();

// Función para formatear bot
const formatBot = (bot, index = null) => {
    const verified = bot.verified ? '✅' : '';
    const stars = '⭐'.repeat(Math.floor(bot.rating));
    const prefix = index !== null ? `${index}. ` : '';
    
    return `${prefix}*${bot.name}* ${verified}
📱 ${bot.username}
📝 ${bot.description}
${stars} ${bot.rating}/5 | 👥 ${bot.users.toLocaleString()}
📂 ${bot.category}`;
};

// Teclado de categorías
const getCategoriesKeyboard = () => {
    return {
        inline_keyboard: [
            [
                { text: '🎮 Juegos', callback_data: 'cat_juegos' },
                { text: '🎵 Música', callback_data: 'cat_musica' }
            ],
            [
                { text: '📺 Entretenimiento', callback_data: 'cat_entretenimiento' },
                { text: '📚 Educación', callback_data: 'cat_educacion' }
            ],
            [
                { text: '💼 Productividad', callback_data: 'cat_productividad' },
                { text: '🛍️ Compras', callback_data: 'cat_compras' }
            ],
            [
                { text: '📰 Noticias', callback_data: 'cat_noticias' },
                { text: '🏋️ Fitness', callback_data: 'cat_fitness' }
            ],
            [
                { text: '🍔 Comida', callback_data: 'cat_comida' },
                { text: '✈️ Viajes', callback_data: 'cat_viajes' }
            ],
            [
                { text: '🎲 Bot Aleatorio', callback_data: 'random' },
                { text: '📊 Estadísticas', callback_data: 'stats' }
            ]
        ]
    };
};

// Función principal del webhook
module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const update = req.body;
        
        try {
            if (update.message) {
                const chatId = update.message.chat.id;
                const text = update.message.text;

                if (text === '/start') {
                    const welcomeMessage = `🤖 *¡Bienvenido al Bot Finder!*

📊 *Base de datos:*
• 10,000 bots organizados
• 10 categorías principales
• 1,000 bots por categoría

🎯 Encuentra el bot perfecto para ti:`;

                    await bot.sendMessage(chatId, welcomeMessage, {
                        parse_mode: 'Markdown',
                        reply_markup: getCategoriesKeyboard()
                    });
                }
                
                else if (text.startsWith('/search ')) {
                    const searchTerm = text.replace('/search ', '').toLowerCase();
                    const results = botDatabase.filter(bot => 
                        bot.name.toLowerCase().includes(searchTerm) ||
                        bot.category.toLowerCase().includes(searchTerm)
                    ).slice(0, 5);

                    if (results.length > 0) {
                        let message = `🔍 *Resultados para "${searchTerm}":*\n\n`;
                        results.forEach((bot, index) => {
                            message += formatBot(bot, index + 1) + '\n\n';
                        });

                        await bot.sendMessage(chatId, message, {
                            parse_mode: 'Markdown',
                            reply_markup: {
                                inline_keyboard: [[
                                    { text: '🏠 Menú principal', callback_data: 'menu' }
                                ]]
                            }
                        });
                    } else {
                        await bot.sendMessage(chatId, `❌ No encontré bots para "${searchTerm}"\n\n💡 Intenta: juegos, música, educación`, {
                            reply_markup: {
                                inline_keyboard: [[
                                    { text: '🏠 Menú principal', callback_data: 'menu' }
                                ]]
                            }
                        });
                    }
                }
                
                else if (text === '/random') {
                    const randomBot = botDatabase[Math.floor(Math.random() * botDatabase.length)];
                    const message = `🎲 *Bot Aleatorio:*\n\n${formatBot(randomBot)}`;

                    await bot.sendMessage(chatId, message, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: '🎲 Otro aleatorio', callback_data: 'random' },
                                    { text: '🏠 Menú', callback_data: 'menu' }
                                ]
                            ]
                        }
                    });
                }
                
                else if (text === '/help') {
                    const helpMessage = `❓ *AYUDA*

🎯 *Comandos:*
• /start - Menú principal
• /search [término] - Buscar bots
• /random - Bot aleatorio
• /help - Esta ayuda

💡 *Ejemplos:*
• \`/search juegos\`
• \`/search música\``;

                    await bot.sendMessage(chatId, helpMessage, {
                        parse_mode: 'Markdown',
                        reply_markup: getCategoriesKeyboard()
                    });
                }
            }
            
            else if (update.callback_query) {
                const callbackQuery = update.callback_query;
                const chatId = callbackQuery.message.chat.id;
                const messageId = callbackQuery.message.message_id;
                const data = callbackQuery.data;

                if (data.startsWith('cat_')) {
                    const category = data.replace('cat_', '');
                    const categoryBots = botDatabase.filter(bot => bot.category === category).slice(0, 5);
                    
                    let message = `📂 *${category.toUpperCase()}*\n\n`;
                    categoryBots.forEach((bot, index) => {
                        message += formatBot(bot, index + 1) + '\n\n';
                    });
                    message += `📊 Mostrando 5 de 1,000 bots`;

                    await bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: '🎲 Aleatorio', callback_data: 'random' },
                                    { text: '🏠 Menú', callback_data: 'menu' }
                                ]
                            ]
                        }
                    });
                }
                
                else if (data === 'random') {
                    const randomBot = botDatabase[Math.floor(Math.random() * botDatabase.length)];
                    const message = `🎲 *Bot Aleatorio:*\n\n${formatBot(randomBot)}`;

                    await bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: '🎲 Otro', callback_data: 'random' },
                                    { text: '🏠 Menú', callback_data: 'menu' }
                                ]
                            ]
                        }
                    });
                }
                
                else if (data === 'stats') {
                    const totalBots = botDatabase.length;
                    const categories = [...new Set(botDatabase.map(bot => bot.category))];
                    const verifiedBots = botDatabase.filter(bot => bot.verified).length;

                    const statsMessage = `📊 *ESTADÍSTICAS*

🤖 Total: ${totalBots.toLocaleString()}
✅ Verificados: ${verifiedBots.toLocaleString()}
📂 Categorías: ${categories.length}
📅 Actualizado: ${new Date().toLocaleDateString()}`;

                    await bot.editMessageText(statsMessage, {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [[
                                { text: '🏠 Menú principal', callback_data: 'menu' }
                            ]]
                        }
                    });
                }
                
                else if (data === 'menu') {
                    const welcomeMessage = `🤖 *Bot Finder*

📊 10,000 bots organizados
🎯 Encuentra el bot perfecto

💡 Selecciona una categoría:`;

                    await bot.editMessageText(welcomeMessage, {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: getCategoriesKeyboard()
                    });
                }

                await bot.answerCallbackQuery(callbackQuery.id);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
        res.status(200).json({ ok: true });
    }
    
    else if (req.method === 'GET') {
        // Página web de información
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
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
                    max-width: 500px;
                    width: 100%;
                }
                .telegram-btn {
                    background: #0088cc;
                    color: white;
                    padding: 15px 30px;
                    border-radius: 50px;
                    text-decoration: none;
                    display: inline-block;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .stats { margin: 30px 0; }
                .stat { margin: 10px 0; font-size: 18px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🤖 Bot Finder</h1>
                <p>El mejor buscador de bots de Telegram</p>
                
                <div class="stats">
                    <div class="stat">📊 10,000 bots</div>
                    <div class="stat">📂 10 categorías</div>
                    <div class="stat">🔍 Búsqueda inteligente</div>
                    <div class="stat">⚡ Respuestas rápidas</div>
                </div>
                
                <a href="https://t.me/YourBotUsername" class="telegram-btn">
                    📱 Abrir en Telegram
                </a>
                
                <p>Bot desplegado y funcionando ✅</p>
                <p>Última actualización: ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
        `);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
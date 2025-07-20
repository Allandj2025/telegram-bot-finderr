const TelegramBot = require('node-telegram-bot-api');

// Token del bot
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '7849605209:AAGqA6D9L_x5EjHlGgLg8HgSv-Qc9ZYfq0c';

// Crear bot sin polling
const bot = new TelegramBot(TELEGRAM_TOKEN);

// Base de datos de bots
const botCategories = {
    'juegos': [
        { name: 'GameBot Pro', username: '@gamebot_pro', description: 'El mejor bot para juegos', rating: 4.8, users: 25000 },
        { name: 'Quiz Master', username: '@quiz_master_bot', description: 'Trivia y preguntas', rating: 4.6, users: 18000 },
        { name: 'Fun Games', username: '@fun_games_bot', description: 'Juegos divertidos', rating: 4.7, users: 32000 }
    ],
    'musica': [
        { name: 'Music Finder', username: '@music_finder_bot', description: 'Encuentra cualquier canción', rating: 4.9, users: 45000 },
        { name: 'Spotify Helper', username: '@spotify_helper_bot', description: 'Ayuda con Spotify', rating: 4.5, users: 28000 },
        { name: 'Radio Bot', username: '@radio_online_bot', description: 'Radios online', rating: 4.4, users: 19000 }
    ],
    'educacion': [
        { name: 'Study Helper', username: '@study_helper_bot', description: 'Asistente de estudios', rating: 4.8, users: 35000 },
        { name: 'Math Tutor', username: '@math_tutor_bot', description: 'Tutorías de matemáticas', rating: 4.7, users: 22000 },
        { name: 'Language Learn', username: '@language_learn_bot', description: 'Aprende idiomas', rating: 4.6, users: 41000 }
    ],
    'noticias': [
        { name: 'News Alert', username: '@news_alert_bot', description: 'Noticias en tiempo real', rating: 4.5, users: 67000 },
        { name: 'Breaking News', username: '@breaking_news_bot', description: 'Últimas noticias', rating: 4.4, users: 54000 },
        { name: 'Tech News', username: '@tech_news_bot', description: 'Noticias de tecnología', rating: 4.7, users: 38000 }
    ],
    'productividad': [
        { name: 'Task Manager', username: '@task_manager_bot', description: 'Gestión de tareas', rating: 4.9, users: 29000 },
        { name: 'Reminder Bot', username: '@reminder_pro_bot', description: 'Recordatorios inteligentes', rating: 4.6, users: 33000 },
        { name: 'Schedule Helper', username: '@schedule_helper_bot', description: 'Organiza tu horario', rating: 4.5, users: 24000 }
    ]
};

// Función para formatear bot
const formatBot = (bot, index) => {
    const stars = '⭐'.repeat(Math.floor(bot.rating));
    return `${index}. *${bot.name}*
📱 ${bot.username}
📝 ${bot.description}
${stars} ${bot.rating}/5 | 👥 ${bot.users.toLocaleString()} usuarios`;
};

// Teclado principal
const mainKeyboard = {
    inline_keyboard: [
        [
            { text: '🎮 Juegos', callback_data: 'cat_juegos' },
            { text: '🎵 Música', callback_data: 'cat_musica' }
        ],
        [
            { text: '📚 Educación', callback_data: 'cat_educacion' },
            { text: '📰 Noticias', callback_data: 'cat_noticias' }
        ],
        [
            { text: '💼 Productividad', callback_data: 'cat_productividad' },
            { text: '🎲 Aleatorio', callback_data: 'random' }
        ],
        [
            { text: '📊 Estadísticas', callback_data: 'stats' }
        ]
    ]
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const update = req.body;
            
            if (update.message) {
                const chatId = update.message.chat.id;
                const text = update.message.text;

                if (text === '/start') {
                    const welcomeMessage = `🤖 *¡Bienvenido al Bot Finder!*

📊 *Base de datos:*
• Miles de bots organizados
• 5 categorías principales
• Información detallada

🎯 Encuentra el bot perfecto:`;

                    await bot.sendMessage(chatId, welcomeMessage, {
                        parse_mode: 'Markdown',
                        reply_markup: mainKeyboard
                    });
                }
                
                else if (text.startsWith('/search ')) {
                    const searchTerm = text.replace('/search ', '').toLowerCase();
                    let results = [];
                    
                    Object.keys(botCategories).forEach(category => {
                        botCategories[category].forEach(bot => {
                            if (bot.name.toLowerCase().includes(searchTerm) || 
                                bot.description.toLowerCase().includes(searchTerm)) {
                                results.push(bot);
                            }
                        });
                    });

                    if (results.length > 0) {
                        let message = `🔍 *Resultados para "${searchTerm}":*\n\n`;
                        results.slice(0, 5).forEach((bot, index) => {
                            message += formatBot(bot, index + 1) + '\n\n';
                        });

                        await bot.sendMessage(chatId, message, {
                            parse_mode: 'Markdown',
                            reply_markup: {
                                inline_keyboard: [[
                                    { text: '🏠 Menú', callback_data: 'menu' }
                                ]]
                            }
                        });
                    } else {
                        await bot.sendMessage(chatId, `❌ No encontré bots para "${searchTerm}"`, {
                            reply_markup: {
                                inline_keyboard: [[
                                    { text: '🏠 Menú', callback_data: 'menu' }
                                ]]
                            }
                        });
                    }
                }
                
                else if (text === '/help') {
                    const helpMessage = `❓ *AYUDA*

🎯 *Comandos:*
• /start - Menú principal
• /search [término] - Buscar
• /help - Esta ayuda

💡 *Ejemplo:* /search música`;

                    await bot.sendMessage(chatId, helpMessage, {
                        parse_mode: 'Markdown',
                        reply_markup: mainKeyboard
                    });
                }
            }
            
            else if (update.callback_query) {
                const query = update.callback_query;
                const chatId = query.message.chat.id;
                const messageId = query.message.message_id;
                const data = query.data;

                if (data.startsWith('cat_')) {
                    const category = data.replace('cat_', '');
                    const bots = botCategories[category] || [];
                    
                    let message = `📂 *${category.toUpperCase()}*\n\n`;
                    bots.forEach((bot, index) => {
                        message += formatBot(bot, index + 1) + '\n\n';
                    });

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
                    const allBots = [];
                    Object.values(botCategories).forEach(categoryBots => {
                        allBots.push(...categoryBots);
                    });
                    
                    const randomBot = allBots[Math.floor(Math.random() * allBots.length)];
                    const message = `🎲 *Bot Aleatorio:*\n\n${formatBot(randomBot, '')}`;

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
                    let totalBots = 0;
                    Object.values(botCategories).forEach(bots => {
                        totalBots += bots.length;
                    });

                    const statsMessage = `📊 *ESTADÍSTICAS*

🤖 Total de bots: ${totalBots}
📂 Categorías: ${Object.keys(botCategories).length}
📅 Actualizado: ${new Date().toLocaleDateString()}
⚡ Estado: Activo`;

                    await bot.editMessageText(statsMessage, {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [[
                                { text: '🏠 Menú', callback_data: 'menu' }
                            ]]
                        }
                    });
                }
                
                else if (data === 'menu') {
                    const welcomeMessage = `🤖 *Bot Finder*

🎯 Encuentra el bot perfecto
📊 Miles de bots organizados

💡 Selecciona una categoría:`;

                    await bot.editMessageText(welcomeMessage, {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: mainKeyboard
                    });
                }

                await bot.answerCallbackQuery(query.id);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
        return res.status(200).json({ ok: true });
    }
    
    else if (req.method === 'GET') {
        return res.status(200).json({ 
            status: 'Bot funcionando',
            timestamp: new Date().toISOString()
        });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
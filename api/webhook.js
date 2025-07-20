const TelegramBot = require('node-telegram-bot-api');

// Token del bot
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8024809640:AAHYb79o5FAatz_r8eSevsZAXjZVHVcEG8o';

// Crear bot sin polling
const bot = new TelegramBot(TELEGRAM_TOKEN);

// Base de datos simplificada de bots
const botCategories = {
    'juegos': [
        { name: 'Gamee Bot', username: '@gameebot', description: 'Juegos HTML5 en Telegram', rating: 4.8, users: 15000000 },
        { name: 'Trivia Bot', username: '@triviabot', description: 'Preguntas de trivia divertidas', rating: 4.6, users: 8200000 },
        { name: 'Quiz Bot', username: '@quizbot', description: 'Quiz interactivos y educativos', rating: 4.5, users: 6400000 },
        { name: 'Word Game Bot', username: '@wordgamebot', description: 'Juegos de palabras y vocabulario', rating: 4.4, users: 3200000 },
        { name: 'Puzzle Bot', username: '@puzzlebot', description: 'Rompecabezas y acertijos', rating: 4.3, users: 2800000 }
    ],
    'musica': [
        { name: 'Spotify Bot', username: '@spotifybot', description: 'Integración con Spotify', rating: 4.9, users: 25000000 },
        { name: 'YouTube Music Bot', username: '@youtubemusicbot', description: 'Música de YouTube', rating: 4.7, users: 18000000 },
        { name: 'Lyrics Bot', username: '@lyricsbot', description: 'Letras de canciones', rating: 4.6, users: 12000000 },
        { name: 'Music Downloader Bot', username: '@musicdownloaderbot', description: 'Descarga música', rating: 4.5, users: 9800000 },
        { name: 'Radio Bot', username: '@radiobot', description: 'Estaciones de radio online', rating: 4.4, users: 6200000 }
    ],
    'educacion': [
        { name: 'Translator Bot', username: '@translatorbot', description: 'Traductor multiidioma', rating: 4.8, users: 22000000 },
        { name: 'Math Bot', username: '@mathbot', description: 'Resolver problemas matemáticos', rating: 4.7, users: 8900000 },
        { name: 'Dictionary Bot', username: '@dictionarybot', description: 'Definiciones y sinónimos', rating: 4.6, users: 6700000 },
        { name: 'Learn English Bot', username: '@learnenglishbot', description: 'Aprender inglés interactivo', rating: 4.5, users: 5400000 },
        { name: 'Calculator Bot', username: '@calculatorbot', description: 'Calculadora científica', rating: 4.4, users: 4200000 }
    ],
    'noticias': [
        { name: 'News Bot', username: '@newsbot', description: 'Noticias internacionales', rating: 4.7, users: 16000000 },
        { name: 'Weather Bot', username: '@weatherbot', description: 'Pronóstico del tiempo', rating: 4.8, users: 19000000 },
        { name: 'Crypto Bot', username: '@cryptobot', description: 'Precios de criptomonedas', rating: 4.6, users: 11000000 },
        { name: 'Breaking News Bot', username: '@breakingnewsbot', description: 'Noticias de último momento', rating: 4.5, users: 7800000 },
        { name: 'Sports News Bot', username: '@sportsnewsbot', description: 'Noticias deportivas', rating: 4.4, users: 5600000 }
    ],
    'productividad': [
        { name: 'Todo Bot', username: '@todobot', description: 'Lista de tareas inteligente', rating: 4.8, users: 12000000 },
        { name: 'Reminder Bot', username: '@reminderbot', description: 'Recordatorios personalizados', rating: 4.7, users: 9500000 },
        { name: 'Note Bot', username: '@notebot', description: 'Tomar y organizar notas', rating: 4.6, users: 7200000 },
        { name: 'Calendar Bot', username: '@calendarbot', description: 'Gestión de calendario', rating: 4.5, users: 6100000 },
        { name: 'Timer Bot', username: '@timerbot', description: 'Temporizadores y cronómetros', rating: 4.4, users: 4800000 }
    ]
};

// Configuración de idiomas simplificada
const languages = {
    'es': {
        welcome: '🤖 *¡Bienvenido al Buscador de Bots!*\n\n👋 Hola, soy tu asistente para encontrar bots de Telegram.\n\n🎮 *Categorías disponibles:*\n• 🎮 Juegos - {juegos} bots\n• 🎵 Música - {musica} bots\n• 📚 Educación - {educacion} bots\n• 📰 Noticias - {noticias} bots\n• 💼 Productividad - {productividad} bots\n\n💡 *Comandos:*\n• /start - Menú principal\n• /search [término] - Buscar bots\n• /help - Ayuda',
        searchResults: '🔍 *Resultados para "{query}":*\n\nEncontrados {count} bots:',
        noResults: '❌ *No se encontraron bots para "{query}"*\n\nIntenta con otros términos.',
        categories: {
            juegos: '🎮 Juegos',
            musica: '🎵 Música',
            educacion: '📚 Educación',
            noticias: '📰 Noticias',
            productividad: '💼 Productividad'
        }
    }
};

// Almacenamiento simple de idiomas de usuario
const userLanguages = {};

function getUserLanguage(userId) {
    return userLanguages[userId] || 'es';
}

function setUserLanguage(userId, lang) {
    userLanguages[userId] = lang;
}

// Rate limiting simple
const userLastMessage = {};

function checkRateLimit(userId) {
    const now = Date.now();
    const lastMessage = userLastMessage[userId] || 0;
    
    if (now - lastMessage < 1000) { // 1 segundo entre mensajes
        return false;
    }
    
    userLastMessage[userId] = now;
    return true;
}

// Función de búsqueda simple
function searchBots(query, userLang = 'es') {
    if (!query || query.trim().length < 2) return [];
    
    const searchTerm = query.toLowerCase().trim();
    const results = [];
    
    // Buscar en todas las categorías
    Object.keys(botCategories).forEach(category => {
        const bots = botCategories[category] || [];
        
        bots.forEach(bot => {
            let score = 0;
            const name = bot.name.toLowerCase();
            const username = bot.username.toLowerCase();
            const description = bot.description.toLowerCase();
            
            // Búsqueda simple
            if (username.includes(searchTerm)) score += 10;
            if (name.includes(searchTerm)) score += 8;
            if (description.includes(searchTerm)) score += 5;
            
            // Búsquedas por categoría
            if (category === 'musica' && (searchTerm.includes('music') || searchTerm.includes('música') || searchTerm.includes('song') || searchTerm.includes('audio'))) score += 7;
            if (category === 'juegos' && (searchTerm.includes('game') || searchTerm.includes('juego') || searchTerm.includes('play'))) score += 7;
            if (category === 'noticias' && (searchTerm.includes('news') || searchTerm.includes('noticias') || searchTerm.includes('weather'))) score += 7;
            if (category === 'educacion' && (searchTerm.includes('education') || searchTerm.includes('educacion') || searchTerm.includes('learn'))) score += 7;
            if (category === 'productividad' && (searchTerm.includes('productivity') || searchTerm.includes('productividad') || searchTerm.includes('todo'))) score += 7;
            
            if (score > 0) {
                results.push({ ...bot, category, score });
            }
        });
    });
    
    return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

// Función para formatear bot
function formatBot(bot, index) {
    const stars = '⭐'.repeat(Math.floor(bot.rating));
    const users = bot.users >= 1000000 ? 
        `${(bot.users / 1000000).toFixed(1)}M` : 
        `${(bot.users / 1000).toFixed(0)}K`;
    
    return `${index}. **${bot.name}**\n   ${bot.username}\n   📝 ${bot.description}\n   ${stars} ${bot.rating} • 👥 ${users} usuarios`;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const update = req.body;
            
            if (!update || (!update.message && !update.callback_query)) {
                return res.status(200).json({ ok: true });
            }
            
            if (update.message) {
                const chatId = update.message.chat.id;
                const userId = update.message.from.id;
                const text = update.message.text;

                if (!checkRateLimit(userId)) {
                    return res.status(200).json({ ok: true });
                }

                if (!text || typeof text !== 'string') {
                    return res.status(200).json({ ok: true });
                }

                if (text === '/start') {
                    const userLang = getUserLanguage(userId);
                    const totalBots = Object.values(botCategories).reduce((sum, bots) => sum + bots.length, 0);
                    
                    const welcomeMessage = languages[userLang].welcome
                        .replace('{juegos}', botCategories.juegos.length)
                        .replace('{musica}', botCategories.musica.length)
                        .replace('{educacion}', botCategories.educacion.length)
                        .replace('{noticias}', botCategories.noticias.length)
                        .replace('{productividad}', botCategories.productividad.length);

                    const keyboard = {
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
                                { text: '💼 Productividad', callback_data: 'cat_productividad' }
                            ]
                        ]
                    };

                    await bot.sendMessage(chatId, welcomeMessage, {
                        parse_mode: 'Markdown',
                        reply_markup: keyboard
                    });
                }
                
                else if (text === '/help') {
                    const helpMessage = '❓ *AYUDA*\n\n🤖 Soy un buscador de bots de Telegram.\n\n🎯 *Comandos:*\n• /start - Menú principal\n• /search [término] - Buscar bots\n• /help - Esta ayuda\n\n🔍 *Ejemplos:*\n• `/search música`\n• `/search juegos`\n• `/search weather`';
                    
                    await bot.sendMessage(chatId, helpMessage, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [[
                                { text: '🏠 Menu', callback_data: 'menu' }
                            ]]
                        }
                    });
                }
                
                else if (text.startsWith('/search ')) {
                    const searchTerm = text.replace('/search ', '').trim();
                    const userLang = getUserLanguage(userId);
                    
                    if (!searchTerm || searchTerm.length < 2) {
                        await bot.sendMessage(chatId, '❌ Por favor ingresa un término de búsqueda válido.\n\n💡 Ejemplo: /search música', {
                            reply_markup: {
                                inline_keyboard: [[
                                    { text: '🏠 Menu', callback_data: 'menu' }
                                ]]
                            }
                        });
                        return;
                    }
                    
                    const results = searchBots(searchTerm, userLang);

                    if (results.length > 0) {
                        const message = `🔍 *Resultados para "${searchTerm}":*\n\nEncontrados ${results.length} bots:\n\n` +
                            results.map((bot, index) => formatBot(bot, index + 1)).join('\n\n');

                        await bot.sendMessage(chatId, message, {
                            parse_mode: 'Markdown',
                            reply_markup: {
                                inline_keyboard: [[
                                    { text: '🏠 Menu', callback_data: 'menu' }
                                ]]
                            }
                        });
                    } else {
                        await bot.sendMessage(chatId, `❌ *No se encontraron bots para "${searchTerm}"*\n\nIntenta con otros términos.`, {
                            parse_mode: 'Markdown',
                            reply_markup: {
                                inline_keyboard: [[
                                    { text: '🏠 Menu', callback_data: 'menu' }
                                ]]
                            }
                        });
                    }
                }
            }
            
            if (update.callback_query) {
                const query = update.callback_query;
                const chatId = query.message.chat.id;
                const messageId = query.message.message_id;
                const data = query.data;
                const userId = query.from.id;

                if (data === 'menu') {
                    const userLang = getUserLanguage(userId);
                    const welcomeMessage = languages[userLang].welcome
                        .replace('{juegos}', botCategories.juegos.length)
                        .replace('{musica}', botCategories.musica.length)
                        .replace('{educacion}', botCategories.educacion.length)
                        .replace('{noticias}', botCategories.noticias.length)
                        .replace('{productividad}', botCategories.productividad.length);

                    const keyboard = {
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
                                { text: '💼 Productividad', callback_data: 'cat_productividad' }
                            ]
                        ]
                    };

                    await bot.editMessageText(welcomeMessage, {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: keyboard
                    });
                }
                
                else if (data.startsWith('cat_')) {
                    const category = data.replace('cat_', '');
                    const bots = botCategories[category] || [];
                    
                    if (bots.length > 0) {
                        const categoryNames = {
                            'juegos': '🎮 Juegos',
                            'musica': '🎵 Música',
                            'educacion': '📚 Educación',
                            'noticias': '📰 Noticias',
                            'productividad': '💼 Productividad'
                        };
                        
                        const message = `${categoryNames[category] || category}\n\nTop bots de esta categoría:\n\n` +
                            bots.slice(0, 5).map((bot, index) => formatBot(bot, index + 1)).join('\n\n');

                        await bot.editMessageText(message, {
                            chat_id: chatId,
                            message_id: messageId,
                            parse_mode: 'Markdown',
                            reply_markup: {
                                inline_keyboard: [[
                                    { text: '🏠 Menu', callback_data: 'menu' }
                                ]]
                            }
                        });
                    }
                }

                await bot.answerCallbackQuery(query.id);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    return res.status(200).json({ ok: true });
}
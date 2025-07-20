#!/usr/bin/env node

const https = require('https');

// Configuración
const BOT_TOKEN = '8024809640:AAHYb79o5FAatz_r8eSevsZAXjZVHVcEG8o';

// Comandos del bot
const commands = [
    {
        command: 'start',
        description: '🏠 Mostrar menú principal'
    },
    {
        command: 'search',
        description: '🔍 Buscar bots específicos'
    },
    {
        command: 'help',
        description: '❓ Ver ayuda completa'
    }
];

// Función para hacer petición HTTP
function makeRequest(url, data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = https.request(url, options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        });
        
        req.on('error', (err) => {
            reject(err);
        });
        
        req.write(postData);
        req.end();
    });
}

async function setupCommands() {
    console.log('🤖 Configurando comandos del bot...\n');
    
    try {
        const result = await makeRequest(
            `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`,
            { commands: commands }
        );
        
        if (result.ok) {
            console.log('✅ ¡Comandos configurados exitosamente!');
            console.log('\n📋 Comandos establecidos:');
            commands.forEach(cmd => {
                console.log(`• /${cmd.command} - ${cmd.description}`);
            });
            
            console.log('\n🎉 Los usuarios ahora verán estos comandos en el menú de Telegram');
            console.log('💡 Los comandos aparecerán cuando escriban "/" en el chat');
        } else {
            console.log(`❌ Error: ${result.description}`);
        }
    } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
    }
}

async function getCommands() {
    console.log('📋 Obteniendo comandos actuales...\n');
    
    try {
        const result = await makeRequest(
            `https://api.telegram.org/bot${BOT_TOKEN}/getMyCommands`,
            {}
        );
        
        if (result.ok) {
            if (result.result.length > 0) {
                console.log('📋 Comandos actuales:');
                result.result.forEach(cmd => {
                    console.log(`• /${cmd.command} - ${cmd.description}`);
                });
            } else {
                console.log('❌ No hay comandos configurados');
            }
        } else {
            console.log(`❌ Error: ${result.description}`);
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}

async function deleteCommands() {
    console.log('🗑️ Eliminando comandos...\n');
    
    try {
        const result = await makeRequest(
            `https://api.telegram.org/bot${BOT_TOKEN}/deleteMyCommands`,
            {}
        );
        
        if (result.ok) {
            console.log('✅ Comandos eliminados exitosamente');
        } else {
            console.log(`❌ Error: ${result.description}`);
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'get':
        getCommands();
        break;
    case 'delete':
        deleteCommands();
        break;
    case 'setup':
    default:
        setupCommands();
        break;
}
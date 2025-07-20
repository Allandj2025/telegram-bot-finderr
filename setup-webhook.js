#!/usr/bin/env node

const https = require('https');

// Configuración
const BOT_TOKEN = '7849605209:AAGqA6D9L_x5EjHlGgLg8HgSv-Qc9ZYfq0c';

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

async function setupWebhook() {
    console.log('🤖 Configurando webhook para Telegram Bot...\n');
    
    // URLs posibles de Vercel
    const possibleUrls = [
        'https://telegram-bot-finder.vercel.app/api/webhook',
        'https://telegram-bot-finderr.vercel.app/api/webhook',
        'https://bot-finder-telegram.vercel.app/api/webhook',
        'https://whatsapp-bot.vercel.app/api/webhook'
    ];
    
    console.log('📋 URLs posibles detectadas:');
    possibleUrls.forEach((url, index) => {
        console.log(`${index + 1}. ${url}`);
    });
    
    console.log('\n🔄 Probando configuración de webhook...\n');
    
    for (const webhookUrl of possibleUrls) {
        try {
            console.log(`⏳ Intentando con: ${webhookUrl}`);
            
            const result = await makeRequest(
                `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
                {
                    url: webhookUrl,
                    drop_pending_updates: true
                }
            );
            
            if (result.ok) {
                console.log(`✅ ¡Webhook configurado exitosamente!`);
                console.log(`🔗 URL: ${webhookUrl}`);
                console.log(`📝 Descripción: ${result.description || 'Webhook establecido'}`);
                
                // Verificar webhook
                const info = await makeRequest(
                    `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`,
                    {}
                );
                
                if (info.ok) {
                    console.log('\n📊 Información del webhook:');
                    console.log(`• URL: ${info.result.url}`);
                    console.log(`• Actualizaciones pendientes: ${info.result.pending_update_count}`);
                    console.log(`• Conexiones máximas: ${info.result.max_connections}`);
                    if (info.result.last_error_message) {
                        console.log(`• Último error: ${info.result.last_error_message}`);
                    }
                }
                
                console.log('\n🎉 ¡Tu bot está ahora funcionando 24/7!');
                console.log('💬 Prueba enviando /start a tu bot en Telegram');
                return;
            } else {
                console.log(`❌ Error: ${result.description}`);
            }
        } catch (error) {
            console.log(`❌ Error de conexión: ${error.message}`);
        }
    }
    
    console.log('\n❗ No se pudo configurar el webhook automáticamente');
    console.log('\n📝 Configuración manual:');
    console.log('1. Ve a tu proyecto en Vercel');
    console.log('2. Copia la URL de tu despliegue');
    console.log('3. Usa este comando:');
    console.log(`\ncurl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \\`);
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"url": "https://TU-URL.vercel.app/api/webhook", "drop_pending_updates": true}\'');
    
    console.log('\n🔍 También puedes verificar el estado con:');
    console.log(`curl "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"`);
}

// Función para limpiar webhook
async function clearWebhook() {
    console.log('🧹 Limpiando webhook...');
    
    try {
        const result = await makeRequest(
            `https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`,
            { drop_pending_updates: true }
        );
        
        if (result.ok) {
            console.log('✅ Webhook eliminado exitosamente');
        } else {
            console.log(`❌ Error: ${result.description}`);
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}

// Función para obtener información del webhook
async function getWebhookInfo() {
    console.log('📊 Obteniendo información del webhook...');
    
    try {
        const result = await makeRequest(
            `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`,
            {}
        );
        
        if (result.ok) {
            console.log('\n📋 Información del webhook:');
            const info = result.result;
            console.log(`• URL: ${info.url || 'No configurada'}`);
            console.log(`• Actualizaciones pendientes: ${info.pending_update_count}`);
            console.log(`• Conexiones máximas: ${info.max_connections}`);
            
            if (info.last_error_message) {
                console.log(`• Último error: ${info.last_error_message}`);
                console.log(`• Fecha del error: ${new Date(info.last_error_date * 1000).toLocaleString()}`);
            }
            
            if (info.url) {
                console.log('\n✅ El webhook está configurado y funcionando');
            } else {
                console.log('\n❌ No hay webhook configurado');
            }
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
    case 'clear':
        clearWebhook();
        break;
    case 'info':
        getWebhookInfo();
        break;
    case 'setup':
    default:
        setupWebhook();
        break;
}
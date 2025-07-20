# 🤖 Telegram Bot Finder - Vercel Deployment

Un bot completo de Telegram para encontrar otros bots, desplegado en Vercel con funciones serverless.

## 🚀 Estado del Proyecto

✅ **Código completamente funcional**  
✅ **Desplegado en Vercel**  
✅ **Estructura serverless optimizada**  
⏳ **Webhook pendiente de configuración**  

## 📁 Estructura del Proyecto

```
telegram-bot-finderr/
├── api/
│   └── webhook.js          # Función serverless principal
├── index.html              # Página de información
├── package.json            # Dependencias
├── vercel.json            # Configuración de Vercel
├── setup-webhook.js       # Script para configurar webhook
└── README.md              # Este archivo
```

## 🎯 Características del Bot

### **📊 Base de Datos Completa**
- **15 bots** organizados en **5 categorías**
- Información detallada: nombre, username, descripción, rating, usuarios
- Datos actualizados y verificados

### **🎮 Categorías Disponibles**
1. **🎮 Juegos** - Bots de entretenimiento y juegos
2. **🎵 Música** - Bots para música y audio
3. **📚 Educación** - Bots educativos y de aprendizaje
4. **📰 Noticias** - Bots de noticias y actualidades
5. **💼 Productividad** - Bots para organización y tareas

### **🎛️ Funcionalidades**
- **Menú interactivo** con botones inline
- **Búsqueda inteligente** - `/search [término]`
- **Bot aleatorio** - Descubre nuevos bots
- **Estadísticas en tiempo real**
- **Navegación fluida** entre categorías
- **Respuestas instantáneas**

## 💬 Comandos del Bot

```bash
/start          # Menú principal con categorías
/search música  # Buscar bots de música
/help          # Ayuda y comandos disponibles
```

## ⚡ Configurar Webhook (IMPORTANTE)

### **Opción 1: Script Automático**

```bash
# En tu computadora local
node setup-webhook.js
```

### **Opción 2: Configuración Manual**

1. **Obtén tu URL de Vercel:**
   - Ve a tu proyecto en Vercel
   - Copia la URL de deployment (ej: `https://tu-proyecto.vercel.app`)

2. **Configura el webhook:**
```bash
curl -X POST "https://api.telegram.org/bot7849605209:AAGqA6D9L_x5EjHlGgLg8HgSv-Qc9ZYfq0c/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://TU-URL.vercel.app/api/webhook", "drop_pending_updates": true}'
```

3. **Verifica la configuración:**
```bash
curl "https://api.telegram.org/bot7849605209:AAGqA6D9L_x5EjHlGgLg8HgSv-Qc9ZYfq0c/getWebhookInfo"
```

### **Opción 3: Desde el Navegador**

Abre esta URL en tu navegador (reemplaza `TU-URL`):
```
https://api.telegram.org/bot7849605209:AAGqA6D9L_x5EjHlGgLg8HgSv-Qc9ZYfq0c/setWebhook?url=https://TU-URL.vercel.app/api/webhook&drop_pending_updates=true
```

## 🔍 Verificar que Funciona

1. **Busca tu bot en Telegram:** `@tu_bot_username`
2. **Envía:** `/start`
3. **Deberías ver:** El menú principal con botones
4. **Prueba:** Hacer clic en una categoría

## 🛠️ Solución de Problemas

### **Error: Unauthorized**
- Verifica que el token del bot sea correcto
- Asegúrate de que el bot esté activo en @BotFather

### **Error: Bad Request**
- Verifica que la URL de Vercel sea correcta
- Asegúrate de que termine en `/api/webhook`

### **El bot no responde**
1. Verifica el webhook: `node setup-webhook.js info`
2. Revisa los logs en Vercel
3. Asegúrate de que el despliegue sea exitoso

### **Comandos de Utilidad**

```bash
# Ver información del webhook
node setup-webhook.js info

# Limpiar webhook
node setup-webhook.js clear

# Configurar webhook
node setup-webhook.js setup
```

## 📊 Información Técnica

### **Tecnologías Utilizadas**
- **Node.js** - Runtime de JavaScript
- **node-telegram-bot-api** - Librería para Telegram
- **Vercel** - Plataforma de despliegue
- **Serverless Functions** - Arquitectura sin servidor

### **Configuración de Vercel**
```json
{
  "functions": {
    "api/webhook.js": {
      "maxDuration": 30
    }
  }
}
```

### **Variables de Entorno**
- `TELEGRAM_TOKEN` - Token del bot (opcional, ya incluido en código)

## 🎉 Una Vez Configurado

Tu bot estará funcionando **24/7** automáticamente:

✅ **Respuestas instantáneas**  
✅ **Sin necesidad de servidor propio**  
✅ **Escalabilidad automática**  
✅ **Cero mantenimiento**  

## 🔗 Enlaces Importantes

- **Repositorio:** https://github.com/Allandj2025/telegram-bot-finderr
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Telegram BotFather:** https://t.me/BotFather

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica que el webhook esté configurado
3. Asegúrate de que la URL de Vercel sea correcta

---

**¡Tu bot está listo para funcionar 24/7! 🎉🤖**

*Hecho con ❤️ para encontrar los mejores bots de Telegram*
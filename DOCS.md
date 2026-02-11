# Configuración de WhatsApp (Twilio Sandbox & Producción)

## 1. Sandbox (Pruebas)

1.  Ve a tu consola de Twilio > Messaging > Try it out > Send a WhatsApp message.
2.  Sigue las instrucciones para unir tu número personal al Sandbox (e.g., enviar `join something-something` al número de Twilio).
3.  En "Sandbox Settings", configura el **"When a message comes in"** Webhook:
    *   **URL**: `https://<tu-dominio-vercel>.vercel.app/api/webhooks/twilio`
    *   **Method**: `POST`
4.  ¡Listo! Envía "Hola" a tu número de Sandbox para probar el bot.

## 2. Producción (Número Real)

1.  Compra un número o habilita un "WhatsApp Sender" en Twilio.
2.  Ve a "Messaging Services" o a la configuración del número.
3.  En la sección "Integration" > "Incoming Webhook":
    *   **URL**: `https://<tu-dominio-produccion>.com/api/webhooks/twilio`
    *   **Method**: `POST`
4.  **Importante**: Para máxima seguridad, define las siguientes variables de entorno en Vercel:
    *   `TWILIO_AUTH_TOKEN`: Tu token de autenticación de Twilio.
    *   `NEXT_PUBLIC_APP_URL`: La URL exacta de tu webhook (e.g. `https://turnero-pro.com/api/webhooks/twilio`).

## 3. Características "Pro" Incluidas

*   **Deduplicación**: El sistema ignora mensajes duplicados (`MessageSid`) automáticamente usando Redis (o memoria en local).
*   **Gestión de Sesiones**: El estado del usuario (Menú, Eligiendo Servicio, Confirmando) se guarda en Redis.
*   **Concurrencia**: Si dos usuarios intentan reservar el mismo turno al mismo tiempo, el segundo recibirá un aviso de que ya fue ocupado.
*   **Validación de Firma**: En producción, el webhook verifica que la petición venga realmente de Twilio.

## 4. Endpoints

*   `POST /api/webhooks/twilio`: Webhook principal.
*   `GET /api/webhooks/twilio`: Health check (devuelve 200 OK).

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FACEBOOK_PIXEL_ID = process.env.FACEBOOK_PIXEL_ID;
const FB_API_URL = `https://graph.facebook.com/v18.0/${FACEBOOK_PIXEL_ID}/events`;

// Rota GET para testar se o backend está rodando
app.get('/', (req, res) => {
    res.send('API de Conversões do Facebook está rodando! 🚀');
});

// Rota GET para evitar erro 404 em /send-event (mas só aceita POST)
app.get('/send-event', (req, res) => {
    res.status(405).send('Método não permitido. Use POST para enviar eventos.');
});

// Rota POST para enviar eventos ao Facebook
app.post('/send-event', async (req, res) => {
    const { event_name, client_ip, client_user_agent, email, phone, fbc, fbp } = req.body;

    if (!event_name) {
        return res.status(400).json({ error: 'O nome do evento é obrigatório.' });
    }

    try {
        const eventData = {
            event_name: event_name,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            user_data: {
                client_ip_address: client_ip || req.ip,
                client_user_agent: client_user_agent || req.headers['user-agent'],
                em: email ? hashData(email) : undefined,
                ph: phone ? hashData(phone) : undefined,
                fbc: fbc || undefined,
                fbp: fbp || undefined
            }
        };

        // Remove valores undefined
        eventData.user_data = Object.fromEntries(Object.entries(eventData.user_data).filter(([_, v]) => v !== undefined));

        const response = await axios.post(FB_API_URL, {
            data: [eventData],
            access_token: FACEBOOK_ACCESS_TOKEN
        });

        res.json({ success: true, response: response.data });
    } catch (error) {
        console.error("Erro ao enviar evento:", error.response?.data || error.message);
        res.status(500).json({ error: "Erro ao enviar evento para o Facebook" });
    }
});

// Função para aplicar hash SHA-256 no e-mail e telefone
const crypto = require('crypto');
function hashData(data) {
    return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

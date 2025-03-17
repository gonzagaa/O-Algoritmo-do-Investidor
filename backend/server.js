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

// Rota raiz para verificar se o backend está rodando corretamente
app.get('/', (req, res) => {
    res.send('API de Conversões do Facebook está rodando!');
});

// Rota para enviar eventos para o Facebook
app.post('/send-event', async (req, res) => {
    const { event_name, client_ip, client_user_agent } = req.body;

    if (!event_name) {
        return res.status(400).json({ error: 'O nome do evento é obrigatório.' });
    }

    try {
        const response = await axios.post(FB_API_URL, {
            data: [
                {
                    event_name: event_name,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    user_data: {
                        client_ip_address: client_ip,
                        client_user_agent: client_user_agent,
                    }
                }
            ],
            access_token: FACEBOOK_ACCESS_TOKEN
        });

        res.json({ success: true, response: response.data });
    } catch (error) {
        console.error("Erro ao enviar evento:", error.response?.data || error.message);
        res.status(500).json({ error: "Erro ao enviar evento para o Facebook" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

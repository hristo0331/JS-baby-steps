const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.get('/ping', (req, res) => {
    res.json({ status: 'up' });
});

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.post('/fetch-jira-info', async (req, res) => {
    const { ticketKey, authToken } = req.body;

    try {
        const response = await axios.get(`https://jira.softwaregroup.com/rest/api/2/issue/${ticketKey}`, {
            headers: {
                'Authorization': 'Basic ' + authToken
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Jira info' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

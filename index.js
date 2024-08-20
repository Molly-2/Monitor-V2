const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Replace with your UptimeRobot API key
const UPTIME_ROBOT_API_KEY = 'u2642916-46be8b462f578b0d109db8a0';
const UPTIME_ROBOT_CREATE_URL = 'https://api.uptimerobot.com/v2/newMonitor';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Endpoint to create a monitor for a given URL
app.get('/create-monitor', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('Please provide a URL as a query parameter');
    }

    try {
        // Create a monitor for the given URL
        const response = await axios.post(UPTIME_ROBOT_CREATE_URL, {
            api_key: UPTIME_ROBOT_API_KEY,
            format: 'json',
            type: 1,  // HTTP(s) Monitor
            url: url,
            friendly_name: `Monitor for ${url}`
        });

        if (response.data.stat === 'ok') {
            res.json({
                message: 'Monitor created successfully',
                monitor_id: response.data.monitor.id,
                url: url
            });
        } else {
            res.status(400).json({
                message: 'Failed to create monitor',
                error: response.data.error
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error creating monitor');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

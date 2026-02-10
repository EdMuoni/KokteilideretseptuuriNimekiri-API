require('dotenv').config();
const port = process.env.PORT || 8080;
const host = 'localhost';
const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');

const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDocument = yamljs.load('./docs/swagger.yaml');
const {sync, sessionStore} = require('./db');

app.use(cors({
    //Frontend URL must be explicitly allowed when using credentials (cookies/sessions)
    origin: ['http://localhost:8081', 'http://172.23.51.143:8081'],
    // CRITICAL: Allow cookies/sessions to be sent in CORS requests  
    credentials: true,                 
    // Allow the following request methods
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // Allow the following headers in requests
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "dev",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7*24*60*60*1000, // 7 days
    }
}))

sessionStore.sync(); //Sünkroniseeri tabel

require("./routes/crRoutes.js")(app);
//require("./routes/authRoutes.js")(app);

app.listen(port, async () => {
    if (process.env.SYNC === 'true')    
    try {
        {await sync();}}
    catch (error) {
        console.error('Sünkroniseerimisel tekkis viga:', error);
    }
    console.log(`API on aadressil http://${host}:${port}`);
});

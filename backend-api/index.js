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
//const swaggerDocument = require('./docs/swagger.json');


const {sync, sessionStore} = require('./db');

// app.get('/cocktails', (req, res) => {
//     res.send(["Margarita", "Corpse Reviver", "Mojito", "Queen Mary", "Mint Julep", "Pina Colada"]);
// })

app.use(cors());
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
        maxAge: 1000 * 60 * 60 * 2, // 2 hours 
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

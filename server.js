const express = require('express');
const app = express();
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

//Connect to DataBase
connectDB();

// Init Middleware
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('YOUR API IS RUNNING!!'));

// Define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));

app.listen(port, () => console.log(`Hey Jeff your server started on port ${port}!`));

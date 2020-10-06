const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('YOUR API IS RUNNING!!'));


app.listen(port, () => console.log(`Hey Jeff your server stated on port ${port}!`));

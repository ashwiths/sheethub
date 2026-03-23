const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('ok'));
const server = app.listen(5000, () => {
  console.log('Test server listening on 5000');
});
server.on('error', (e) => {
  console.error('Server error:', e);
});

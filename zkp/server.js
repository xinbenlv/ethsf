const express = require('express');
const app = express();
const port = 3000;
const zkp = require('./zkp.js');
app.get('/', async (req, res) => {
    let sol = req.query.sol;
    let id = req.query.id;
    let data = await zkp.computeProof(sol, id);
    let spliterIndex = data.indexOf(',');
    let proof = data.substring(0, spliterIndex);
    let publicSignals = JSON.parse(data.substring(spliterIndex+1));
    res.send({proof, publicSignals});
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))

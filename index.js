const express = require('express');
const parser = require('body-parser');
const port = process.env.PORT || 3232;
const app = express();

app.use(express.static('public'));


app.post('/form', express.json(), parser({ extended: true }), (req, res) => {
    /*
    Do something here
    */
    console.log('Form data submitted.');
    console.log('body: ', req.body);
    console.log('params: ', req.params);
    console.log('query: ', req.query);


    res.status(200);
});

app.listen(port, (err) => {
    if (err) {
        console.error('Error launching server! ', err);
    }
    console.log(`Server listening on port ${port}`);
});

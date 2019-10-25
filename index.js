const express = require('express');
const parser = require('body-parser');
const port = process.env.PORT || 3232;
const app = express();

function logger(req, res, next) {
    const date = new Date();
    console.log(`${date.toLocaleString()}   Requested Path: ${req.originalUrl}`);
    next();
}

function otherMethods(req, res, next) {
    res.showError = function showError(message, _code, _content) {
        const code = _code || 400;
        const content = _content || {};
        const header = {
            'Content-Type': 'application/json; charset=utf-8'
        };
        let dataIns = content;
        if (_content instanceof Error) {
            dataIns = _content.message;
        }
        const errResult = {
            code: code,
            message: message,
            data: dataIns
        };
        console.error(`SERVER STILL RUNNING... ${message} ${content}`);
        const sendResult = JSON.stringify(errResult, null, '\t');
        if (!res.headersSent) {
            res.writeHead(code, header);
        }
        res.end(sendResult);
    }
    next();
}
app.use(logger);
app.use(otherMethods);
app.use(express.static('public'));


app.post('/form', express.json(), (req, res) => {
    // Check for valid data
    if (typeof req.body.name !== 'string' || req.body.name === '') {
        const oops = new Error('You must provide a name!');
        return res.showError('You must provide a name.', 403, oops);
    }
    // Set Header
    res.set({
        'Content-Type': 'application/json'
    });
    // Decide what to send
    const body = {
        thanks: `Thank you, ${req.body.name}`,
    }
    switch (req.body.favColor) {
        case 'red':
            body.color = "#990000";
            break;
        case 'blue':
            body.color = "#000099";
            break;
        case 'green':
            body.color = "#009900";
            break;
        default:
            body.color = '#FFFFFF';
            break;
    }
    res.send(JSON.stringify(body));


    res.status(200).end();
});

app.listen(port, (err) => {
    if (err) {
        console.error('Error launching server! ', err);
    }
    console.log(`Server listening on port ${port}`);
});

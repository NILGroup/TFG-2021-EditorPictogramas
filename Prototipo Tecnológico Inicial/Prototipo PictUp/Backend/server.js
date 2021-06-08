const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const PORT = 5000;
const app = express();

app.use(cors());
const corsOptions = {
    origin: "http://localhost:3000"
};

app.use(express.json());

const requestEndpoint = "http://hypatia.fdi.ucm.es:5223/PICTAR/traducir/hola buenos dias a todos";
const tradPicto = "https://holstein.fdi.ucm.es/nil-ws-api/v1/texto/pictogramas"
// This function runs if the http://localhost:5000/getData endpoint
// is requested with a GET request
app.get('/getData', cors(corsOptions), async (req, res) => {
    const fetchOptions = {
        method: 'GET'
    }
    const response = await fetch(requestEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

app.post('/frase2picto', cors(corsOptions), async (req, res) => {
	// console.log(req.body.texto)
	// console.log(":(")

	const fetchOptions = {
		method: "post",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			texto: req.body.texto
		})
	}

	const response = await fetch(tradPicto, fetchOptions);
	const jsonResponse = await response.json();

	console.log(jsonResponse)

	res.json(jsonResponse);
});


app.listen(PORT, () => {
    console.log('Example app listening at http://localhost:${PORT}');
});
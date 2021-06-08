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

app.post('/frase2picto', cors(corsOptions), async (req, res) => {
	console.log(req.body.texto)
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
    console.log('App listening at http://localhost:5000');
});
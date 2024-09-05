import { createServer } from "node:http";
import { remove, update, create, index } from "./functions/api/todos.js";
import { NotFoundError } from "./functions/errors.js";
import { createReadStream } from "node:fs";

createServer(async (req, res) => {
	try {
		res.setHeader("Content-Type", "application/json");

		const url = new URL(req.url, "http://${req.headers.host");
		// endpoint sert a avoir un element "GET:/todos" ou "POST:/todos"
		const endpoint = `${req.method}:${url.pathname}`;
		let results;
		switch (endpoint) {
			// Ce premier endpoint est un exmple pour envoyer une page HTML sur l'url racine
			case "GET:/":
				res.setHeader("content-Type", "text/html");
				createReadStream("index.html").pipe(res);
			case "GET:/todos":
				results = await index(req, res);
				break;
			case "POST:/todos":
				results = await create(req, res);
				break;
			case "PUT:/todos":
				results = await update(req, res, url);
				break;
			case "DELETE:/todos":
				results = await remove(req, res, url);
				break;
			default:
				res.writeHead(404);
		}
		if (results) {
			res.write(JSON.stringify(results));
		}
	} catch (currentError) {
		if (currentError instanceof NotFoundError) {
			res.writeHead(404);
		} else {
			// Pour le moement je ne sais pas traiter cette erreur donc je la re throw car je prèfére que le serveur plante.
			throw currentError;
		}
	}
	res.end();
}).listen("8888");

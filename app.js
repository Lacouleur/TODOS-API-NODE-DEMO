import { createServer } from "http";

createServer((req, res) => {
	res.write("bonjour");
	res.end();
}).listen("8888");

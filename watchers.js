import { spawn } from "node:child_process";
import { watch } from "node:fs/promises";

const [node, _, file] = process.argv;

// Parfois quand le watcher quitte, le port 8888 reste ouvert et on ne peut pas relancer le serveur
// un quick ficx est de taper dans le terminal "sudo lsof -i :8888"

//COMMAND   PID  USER     FD   TYPE DEVICE    SIZE/OFF  NODE NAME
// node    21345 jaune   19u  IPv6   327824      0t0   TCP *:8888 (LISTEN)

// ensuite on prend le PID (ici 21345)
// et on tape "kill -9 21345" (kill -9 <PID>)

function spawnNode() {
	const pr = spawn(node, [file]);
	pr.stdout.pipe(process.stdout);
	pr.stderr.pipe(process.stderr);

	pr.on("close", (code) => {
		if (code !== null) {
			console.log("PROCESS CLOSED");
			process.exit(code);
		}
	});

	return pr;
}

let childNodeProcess = spawnNode();

const watcher = watch("./", { recursive: true });

for await (const event of watcher) {
	console.warn(event);
	if (event.filename.endsWith(".js")) {
		childNodeProcess.kill("SIGKILL");
		childNodeProcess = spawnNode();
	}
}

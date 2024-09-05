import { spawn } from "node:child_process";
import { watch } from "node:fs/promises";

const [node, _, file] = process.argv;

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
		n;
		childNodeProcess.kill("SIGKILL");
		childNodeProcess = spawnNode();
	}
}

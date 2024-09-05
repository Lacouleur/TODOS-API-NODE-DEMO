import {
	findTodos,
	createTodo,
	deleteTodo,
	updateTodo,
} from "../todos_storage.js";
import { json } from "node:stream/consumers";

// to GET
export async function index(req, res) {
	return findTodos();
}

// to CREATE
export async function create(req, res) {
	return createTodo(await json(req));
}

// to DELETE
export async function remove(req, res, url) {
	// recuère l'id et le convertis en entier base 10 pour avoir un <number>
	const id = parseInt(url.searchParams.get("id"), 10);
	await deleteTodo(id);
	// 204 signifie qu'il n'y a pas de réponse a donner, comme c'est le cas pour une supression
	res.writeHead(204);
}

// to UPDATE
export async function update(req, res, url) {
	const id = parseInt(url.searchParams.get("id"), 10);
	return updateTodo(id, await json(req));
}

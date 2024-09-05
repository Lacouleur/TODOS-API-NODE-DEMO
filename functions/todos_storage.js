import { readFile, writeFile } from "node:fs/promises";
import { NotFoundError } from "../functions/errors.js";
// Dans les ligne ci-dessous on définit le typage d'une todo
// On prend l'habitude d'utiliser le typage, c'est une bonne pratique de travai

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */

/// FIND TODO VVV

/**
 * @return {Promise<Todo[]>}
 */

const path = "storage/todos.json";

export async function findTodos() {
	// Ici on veut lire le fichier todos.json, on pourrait utiliser le stream mais comme on a besoin de l'intégralité du fichier pour pouvoir le parsé, on va utiliser readFile du module fs/promise
	const data = await readFile(path, "utf8");
	return JSON.parse(data);
}

/// CREATE VVV
/**
 * @param {string} title
 * @param {boolean} completed
 * retourne une promise avec la todo décrite au dessus.
 * @return {Promise<Todo>}
 */

export async function createTodo({ title, completed = false }) {
	const todo = { title, completed, id: Date.now() };
	const todoslist = await findTodos();
	const todos = [todo, ...(await findTodos())];
	await writeFile(path, JSON.stringify(todos, null, 2));
	return todo;
}

// JSON.stringify(todos, null, 2)
// On peut formater le retour JSON
// En second param on met null car il sert normalement à remplacer, mais on ne s'en sert pas
// et 2, spécifie 2 espaces pour le format du fichier (voir dans todos.json)

/// DELETE VVV

/**
 * @param {string} id
 * @return {Promise}
 */

export async function deleteTodo(id) {
	const todos = await findTodos();
	const newTodo = todos.findIndex((todo) => todo.id === id);
	if (newTodo === -1) {
		throw new NotFoundError();
	}
	await writeFile(path, JSON.stringify(newTodo));
}

// UPDATE VVV

/**
 * @param {number} id
 * @param {{completed?: boolean, title?: string}} partialTodo
 * @return {Promise<Todo>}
 */

export async function updateTodo(id, partialTodo) {
	const todos = await findTodos();
	const todo = todos.find((todo) => todo.id === id);
	if (todo === undefined) {
		throw new NotFoundError();
	}
	// L'utilisation d'un partialTodo c'est simplement un object qui peur avoir soit (dans notre cas) Completed, soit title, soit les deux.
	Object.assign(todo, partialTodo);
	await writeFile(path, JSON.stringify(todos, null, 2, null, 2));
	return todo;
}

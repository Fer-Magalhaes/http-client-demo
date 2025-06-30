import { listTodos } from '../api/todos';
import type { Interface } from 'node:readline/promises';

export async function optionTodos(rl: Interface) {
  const res = await listTodos();
  console.log(`→ Received ${res.data.length} TODOS (status ${res.status})`);

  const answer = (await rl.question('Show full list? (y/N): '))
                   .trim().toLowerCase();

  if (answer === 'y' || answer === 'yes') {
    console.dir(res.data, { depth: null, colors: true });
  }
}

import { listPosts } from '../api/posts';
import type { Interface } from 'node:readline/promises';

export async function optionPosts(rl: Interface) {
  const res = await listPosts();
  console.log(`→ Received ${res.data.length} POSTS (status ${res.status})`);

  const answer = (await rl.question('Show full list? (y/N): '))
                   .trim().toLowerCase();

  if (answer === 'y' || answer === 'yes') {
    console.dir(res.data, { depth: null, colors: true });
  }
}

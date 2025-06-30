import '../utils/env';
import { API_BASE_URL } from '../utils/env';
import { createHttp } from '../core/http';
import { newReadline } from '../utils/readline';
import { optionTodos } from './optionTodos';
import { optionPosts } from './optionPosts';

export const http = createHttp({
  baseURL: API_BASE_URL,
  auth: { strategy: 'none' },
  timeout: 7000,
});

async function main() {
  const rl = newReadline();        
  let choice: string | null = null;

  while (choice !== '0') {
    console.log('\n=== MENU ===');
    console.log('1 - List TODOS');
    console.log('2 - List POSTS');
    console.log('0 - Exit');
    choice = (await rl.question('Choice: ')).trim();

    try {
      switch (choice) {
        case '1': await optionTodos(rl); break;   
        case '2': await optionPosts(rl); break;  
        case '0': console.log('Exiting…'); break;
        default : console.log('Invalid option.');
      }
    } catch (e: any) {
      console.error(`❌ Error [${e.status ?? '???'}]:`, e.message ?? e);
    }
  }

  rl.close();                    
}

main().catch(console.error);

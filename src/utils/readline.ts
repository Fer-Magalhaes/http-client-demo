import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export const newReadline = () => createInterface({ input, output });

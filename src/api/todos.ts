import { http } from '../cli/menu';
import { Todo } from '../interfaces/Todo';
import { ROUTES } from '../utils/constants';

export const listTodos  = () => http.get<Todo[]>(ROUTES.TODOS);

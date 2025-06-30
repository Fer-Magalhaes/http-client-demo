import { http } from '../cli/menu';
import { Post } from '../interfaces/Post';
import { ROUTES } from '../utils/constants';

export const listPosts = () => http.get<Post[]>(ROUTES.POSTS);

import axios from 'axios';
import { BASE_URL } from './shared/const';

const instance = axios.create({
   baseURL: BASE_URL
});

export default instance;
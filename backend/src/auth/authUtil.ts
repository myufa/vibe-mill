import querystring from 'querystring';
import KEYS from '../config/keys'
import qs from 'qs'

const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const API_DOMAIN = 'http://localhost:8080'

export const generateRandomString = (length: number) => {
    var text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
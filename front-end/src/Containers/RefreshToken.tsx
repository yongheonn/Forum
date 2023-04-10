import { AjaxPostOption } from '../Modules/api_option';
import { apiUrl } from '../Modules/api_url';

const url = apiUrl + '/ajax/auth/refresh';

const option: AjaxPostOption = {
  method: 'POST',
  body: '',
  'Access-Control-Expose-Headers': '*, Authorization',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: '',
  },
  xhrFields: {
    withCredentials: true,
  },
};

export const refreshAccessToken = async (redoFunc: () => Promise<void>) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) option.headers.Authorization = accessToken;
  const response = await fetch(url, option);

  if (response.status === 200) {
    const accessToken = response.headers.get('Authorization');
    if (typeof accessToken === 'string') localStorage.setItem('access_token', accessToken);
    redoFunc()
      .then(() => null)
      .catch(() => null);
  } else if (response.status === 401) {
    localStorage.removeItem('access_token');
  }
};

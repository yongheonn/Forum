export type AjaxPostOption = {
  method: string;
  body: string;
  credentials: RequestCredentials | undefined;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
};

export type AjaxGetOption = {
  method: string;
  credentials: RequestCredentials | undefined;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
};

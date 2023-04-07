export type AjaxPostOption = {
  method: string;
  body: string;
  'Access-Control-Expose-Headers': string;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
};

export type AjaxGetOption = {
  method: string;
  'Access-Control-Expose-Headers': string;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
};

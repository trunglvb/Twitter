type IRegisterRequestBody = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
};

type ITokenPayload = {
  user_id: string;
  token_type: number;
  iat: number;
  exp: number;
};

export { IRegisterRequestBody, ITokenPayload };

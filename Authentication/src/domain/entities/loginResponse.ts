export class LoginResponse {
  constructor(
    public message: string,
    public idToken: string,
    public accessToken: string,
    public refreshToken: string,
    public expiresIn: number
  ) {}
}
import fetch from 'node-fetch';
import { IUser } from '../types';
import UserModel from '../models/user.model';
import { ConflictError } from '../errors';

export class Untappd {
  private accessToken: string;

  public async oauthAndCreateUser(code: string): Promise<IUser> {
    this.accessToken = await this.getAccessToken(code);
    const userResponse = await this.getUserInfo();
    const data = await this.translateUserResponse(userResponse);
    return await this.createUser(data);
  }

  private async getAccessToken(code: string): Promise<string> {
    const url = this.getAuthorizeUrl(code);
    return await fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log('getAccessToken: ', res.response.access_token);
        return res.response.access_token;
      });
  }

  private async getUserInfo(): Promise<any> {
    return await fetch(
      `https://api.untappd.com/v4/user/info?access_token=${this.accessToken}`
    )
      .then((res: any) => res.json())
      .then((res) => {
        console.log('getUserInfo: ', res.response);
        return res.response;
      });
  }

  private getAuthorizeUrl(code: string): string {
    return `https://untappd.com/oauth/authorize/?code=${code}&redirect_url=${
      process.env.UNTAPPD_CALLBACK_URL
    }&client_id=${process.env.UNTAPPD_CLIENT_ID}&client_secret=${
      process.env.UNTAPPD_CLIENT_SECRET
    }&response_type=code`;
  }

  private async translateUserResponse(response: any): Promise<IUser> {
    console.log('translateUserResponse: ', response);
    const user: IUser = {
      email: response.user.settings.email_address,
      username: response.user.user_name,
      firstName: response.user.first_name,
      lastName: response.user.last_name
    };
    return user;
  }

  private async createUser(data: IUser): Promise<IUser> {
    console.log('createUser: ', data);
    const exists = await UserModel.find({
      email: data.email
    });
    if (exists !== null) {
      throw new ConflictError('User Already Exists');
    }
    const created = new UserModel(data);
    await created.save();
    return created;
  }
}

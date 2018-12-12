import fetch from 'node-fetch';
import { IUser } from '../types';
import UserModel, { IUserModel } from '../models/user.model';

export class Untappd {
  private accessToken: string;

  public async oauthAndCreateUser(code: string): Promise<IUserModel> {
    this.accessToken = await this.getAccessToken(code);
    const userResponse = await this.getUserInfo();
    const data = await this.translateUserResponse(userResponse);
    const user = await this.findOrCreateUser(data);
    return user;
  }

  private async getAccessToken(code: string): Promise<string> {
    const url = this.getAuthorizeUrl(code);
    return await fetch(url)
      .then((res) => res.json())
      .then((res) => {
        return res.response.access_token;
      });
  }

  private async getUserInfo(): Promise<any> {
    return await fetch(
      `https://api.untappd.com/v4/user/info?access_token=${this.accessToken}`
    )
      .then((res: any) => res.json())
      .then((res) => {
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

  private async translateUserResponse(response: any): Promise<any> {
    const user = {
      email: response.user.settings.email_address,
      username: response.user.user_name,
      firstName: response.user.first_name,
      lastName: response.user.last_name
    };
    return user;
  }

  private async findOrCreateUser(data: IUser): Promise<IUserModel> {
    const exists: IUserModel = await UserModel.findOne({
      email: data.email
    });
    if (exists !== null) {
      return exists;
    }
    const created: IUserModel = new UserModel(data);
    await created.save();
    return created;
  }
}

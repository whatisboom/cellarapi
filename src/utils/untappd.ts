import fetch from 'node-fetch';
import { IUser } from '../types';
import UserModel, { IUserModel } from '../models/user.model';

export class Untappd {
  private accessToken: string;
  private apiHost: string = 'https://api.untappd.com';

  constructor(private apiKey: string = '') {}

  public async oauthAndCreateUser(code: string): Promise<IUserModel> {
    this.accessToken = await this.getAccessToken(code);
    const userResponse = await this.getUserInfo();
    const data = await this.translateUntappdUserInfoResponse(userResponse);
    data.untappdApiKey = this.accessToken;
    const user = await this.findOrCreateUser(data);
    return user;
  }

  public async searchBeer(q: string) {
    const url = `${this.apiHost}/v4/search/beer?q=${q}`;
    return this.request(url);
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

  private async translateUntappdUserInfoResponse(response: any): Promise<any> {
    const user = {
      email: response.user.settings.email_address,
      username: response.user.user_name,
      firstName: response.user.first_name,
      lastName: response.user.last_name,
      oauth: {
        untappd: response.user.uid
      }
    };
    return user;
  }

  private async findOrCreateUser(data: IUser): Promise<IUserModel> {
    const exists: IUserModel = await UserModel.findOne({
      'oauth.untappd': data.oauth.untappd
    });
    if (exists !== null) {
      return exists;
    }
    const created: IUserModel = new UserModel(data);
    const user = await created.save();
    return user;
  }

  private async request(url: string) {
    const withToken = `${url}&access_token=${this.apiKey}`;
    return fetch(withToken).then((res) => res.json());
  }
}

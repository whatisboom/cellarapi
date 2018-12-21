import fetch from 'node-fetch';
import { IUser, IBeer } from '../types';
import UserModel, { IUserModel } from '../models/user.model';
import { IBreweryModel } from '../models/brewery.model';

export class Untappd {
  private accessToken: string;
  private apiHost: string = 'https://api.untappd.com';

  constructor(private apiKey: string = '') {}

  public async oauthAndCreateUser(code: string): Promise<IUserModel> {
    this.accessToken = await this.getAccessToken(code);
    const userResponse = await this.getUserInfo();
    const data = this.translateUserInfoResponse(userResponse);
    data.untappdApiKey = this.accessToken;
    const user = await this.findOrCreateUser(data);
    return user;
  }

  public async searchBeer(q: string) {
    const url = `/v4/search/beer?q=${q}`;
    return this.request(url).then((res) => ({
      beers: res.response.beers.items.map(
        (item: { beer: any; brewery: any }) => {
          const translated = this.translateBeerResponse(item.beer);
          translated.brewery = this.translateBreweryResponse(item.brewery);
          return translated;
        }
      )
    }));
  }

  public async getBeerInfo(uid: number): Promise<IBeer> {
    const url = `/v4/beer/info/${uid}`;
    return this.request(url).then((res) => {
      const translated = this.translateBeerResponse(res.response.beer);
      translated.brewery = this.translateBreweryResponse(
        res.response.beer.brewery
      );
      return translated;
    });
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

  private translateUserInfoResponse(response: any): any {
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

  private translateBeerResponse(beer: any): IBeer {
    const { bid, beer_name, beer_abv, beer_style, beer_slug } = beer;
    const translated = {
      name: beer_name,
      abv: beer_abv,
      style: beer_style,
      slug: beer_slug,
      untappdId: bid
    };
    return <IBeer>(<unknown>translated);
  }

  private translateBreweryResponse(brewery: any): IBreweryModel {
    const {
      brewery_id,
      brewery_name,
      brewery_slug,
      location,
      country_name
    } = brewery;
    const translated = {
      name: brewery_name,
      slug: brewery_slug,
      untappdId: brewery_id,
      city: location.brewery_city,
      state: location.brewery_state,
      country: country_name
    };
    return <IBreweryModel>(<unknown>translated);
  }

  private async findOrCreateUser(data: IUser): Promise<IUserModel> {
    try {
      const exists: IUserModel = await UserModel.findOne({
        'oauth.untappd': data.oauth.untappd
      });
      if (exists !== null) {
        exists.untappdApiKey = this.accessToken;
        return await exists.save();
      }
      const created: IUserModel = new UserModel(data);
      const user = await created.save();
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  private async request(url: string): Promise<any> {
    const withToken =
      url.indexOf('?') > -1
        ? `${url}&access_token=${this.apiKey}`
        : `${url}?access_token=${this.apiKey}`;
    return fetch(`${this.apiHost}${withToken}`).then((res) => res.json());
  }
}

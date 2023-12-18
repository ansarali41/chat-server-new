import { Injectable } from '@nestjs/common';
import axios, { Method } from 'axios';

@Injectable()
export class AclService {
  baseURL = 'http://localhost:3004/api';

  async request(
    method: Method,
    url: string,
    data: object = {},
    cookie = '',
  ): Promise<any> {
    let headers = {};

    if (cookie != '') {
      headers = {
        authorization: cookie,
      };
    }

    try {
      const response = await axios.request({
        method,
        url,
        baseURL: this.baseURL,
        headers,
        data,
      });

      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async post(url: string, data: any, cookie = '') {
    return this.request('post', url, data, cookie);
  }

  async put(url: string, data: any, cookie = '') {
    return this.request('put', url, data, cookie);
  }

  async get(url: string, cookie = '') {
    return this.request('GET', url, {}, cookie);
  }
}

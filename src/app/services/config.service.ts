import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ConfigService {

  settings: any;

  constructor(
    public http: Http
  ){ 

  }

  load(): Promise<boolean> {
    
    return new Promise((resolve, reject) => {

      this.http.get('assets/data/config.json')
        .map(res => res.json()).subscribe(data => {
          resolve(true);
      }, error => {
        reject(error);
      });

    });

  }

  get(setting) {
    return this.settings[setting];
  }

}

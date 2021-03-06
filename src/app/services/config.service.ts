import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ConfigService {

  settings: any;

  constructor(
    public http: Http
  ){ 
  
  }

  // Load config from json file when start application
  load(): Promise<boolean> {
    
    return new Promise((resolve, reject) => {

      this.http.get('assets/data/config.json')
        .map(res => res.json()).subscribe(data => {
          this.settings = data;
          resolve(true);
      }, error => {
        reject(error);
      });

    });

  }

  // Get config where key of object
  get(setting) {
    return this.settings[setting];
  }

}

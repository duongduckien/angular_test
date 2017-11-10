import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    public apiService: ApiService,
    public configService: ConfigService
  ){
    this.loadConfig();
  }

  loadConfig() {

    this.configService.load().then(() => {

      this.apiService.apiBase = this.configService.get('apiBase');

    });

  }
}

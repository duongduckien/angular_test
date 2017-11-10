import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { NgRedux, NgReduxModule } from 'ng2-redux';
import { rootReducer, INITIAL_STATE } from './store';
import { DatePipe } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

// Services
import { ApiService } from './services/api.service';
import { HelperService } from './services/helper.service';
import { ConfigService } from './services/config.service';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { SearchProjectByNamePipe } from './pipes/search-project-by-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchProjectByNamePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    CalendarModule.forRoot(),
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    DragAndDropModule,
    FormsModule,
    HttpModule,
    NgReduxModule
  ],
  providers: [
    ApiService,
    HelperService,
    DatePipe,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<any>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}

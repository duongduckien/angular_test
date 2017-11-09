import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

// Services
import { ApiService } from './services/api.service';
import { HelperService } from './services/helper.service';

// Pages
import { HomeComponent } from './pages/home/home.component';

// Components
import { CalendarComponent } from './components/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CalendarComponent
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
    HttpModule
  ],
  providers: [
    ApiService,
    HelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

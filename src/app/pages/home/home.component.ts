import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { addDays, differenceInDays, startOfDay } from 'date-fns';
import { colors } from '../../common/colors';
import { ApiService } from '../../services/api.service';
import { HelperService } from '../../services/helper.service';
import { DatePipe } from '@angular/common';
import { WeekDay } from 'calendar-utils';

import { NgRedux, select } from 'ng2-redux';
import { SUBMIT_TIMESHEET } from '../../actions';

@Component({
  selector: 'mwl-demo-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  @select('timesheet') timesheet;

  keyName: any;
  keyCode: any;

  projects: any;
  tasks: any;
  reasons: any;

  time = 0;
  comment = '';

  projectId: any;

  project_data: any;
  task_data: any;
  reason_data: any;

  clickedDate: Date;

  selected_date = null;

  selectedDay: WeekDay;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    // console.log(event);
    this.keyName = event.key;
    this.keyCode = event.keyCode;
  }

  constructor(
    public apiService: ApiService,
    public helperService: HelperService,
    private ngRedux: NgRedux<any>,
    public datepipe: DatePipe
  ){
    this.getReason().then(data => {
      this.reasons = data;
    });
  }

  ngOnInit() {
  
    this.helperService.getAllDataFromStore()
      .then(data => {
        console.log(data);
        this.externalEvents = data;
      });

    this.getAllProject()
      .then(data => {
        this.projects = data;
      });

  }

  getReason(): Promise<any> {
    return new Promise(resolve => {
      this.apiService.getReason()
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  getAllProject(): Promise<any> {
    return new Promise(resolve => {
      this.apiService.getProject()
        .subscribe(data => {
          resolve(data);
        }, err => {
          resolve(err);
        });
    })
  }

  changeProject(project) {
    this.task_data = null;
    this.apiService.getTask(project.value)
      .subscribe(data => {
        this.tasks = data;
        this.time = 0;
        this.comment = '';
      },err => {
        console.log(err);
      });
  }

  changeTask(task) {
    console.log(task.value);
  }

  clickDate(event) {

    if (this.selectedDay) {
      delete this.selectedDay.cssClass;
    }
    event.cssClass = 'cal-day-selected';
    this.selectedDay = event;

    this.project_data = null;
    this.task_data = null;
    this.time = 0;
    this.comment = '';
    this.selected_date = event.date;

    this.helperService.getAllDataFromStore()
      .then(data => {
        console.log(data);
      });

    this.helperService.getWhereDate(event.date)
      .then(data => {
        this.externalEvents = data;
      });
    
  }

  beforeViewRender({header}: {header: WeekDay[]}): void {
    header.forEach((day) => {
      if (this.selectedDay && day.date.getTime() === this.selectedDay.date.getTime()) {
        day.cssClass = 'cal-day-selected';
        this.selectedDay = day;
      }
    });
  }

  submitTimeSheet(f: NgForm) {

    this.helperService.getAllDataFromStore()
      .then(data => {
        console.log(data);
      });

    console.log(f.value);

    console.log(f.value.time);

    this.projects.forEach(item => {
      if (item.id == parseInt(f.value.project)) {

        this.apiService.getTask(item.id)
          .subscribe(data => {
            
            data.forEach(value => {
              if (value.id == parseInt(f.value.task)) {
                console.log(item);
                console.log(value);

                let data_new = {
                  id: Math.floor(1000 + Math.random() * 9000),
                  projectId: parseInt(f.value.project),
                  taskId: parseInt(f.value.task),
                  project: item.name,
                  task: value.name,
                  comment: f.value.comment,
                  time: f.value.time,
                  color: colors.blue,
                  start: this.selected_date == null ? new Date() : this.selected_date,
                  draggable: true
                };

                this.helperService.getAllDataFromStore()
                  .then(result => {
                    console.log(result);
                    result.push(data_new);
                    this.helperService.saveToStore(result);

                    this.helperService.getWhereDate(this.selected_date)
                      .then(data => {
                        this.externalEvents = data;
                      });
                  });

              }
            });

          }, err => {
            console.log(err);
          });
      }
    });
    
  
  }

  view: string = 'week';
  viewDate: Date = new Date();

  externalEvents: CalendarEvent[] = [];
  
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;
  refresh: Subject<any> = new Subject();
  
  eventDropped({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex: number = this.externalEvents.indexOf(event);

    this.helperService.getAllDataFromStore()
      .then(data => {
        console.log(data);
      });

    if (this.keyCode == 17 || this.keyName == 'Control') {
      // this.helperService.updateData(event);
    }

    this.helperService.getWhereDate(this.viewDate)
      .then(data => {
        this.externalEvents = data;
      });

    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    // this.viewDate = newStart;
    this.activeDayIsOpen = true;
    this.keyCode = null;
    this.keyName = null;
    
  }

}

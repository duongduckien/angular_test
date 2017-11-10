import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { addDays, differenceInDays, startOfDay } from 'date-fns';
import { colors } from '../../common/colors';
import { ApiService } from '../../services/api.service';
import { HelperService } from '../../services/helper.service';
import { ConfigService } from '../../services/config.service';
import { DatePipe } from '@angular/common';
import { WeekDay } from 'calendar-utils';
import { NgRedux, select } from 'ng2-redux';
import { SUBMIT_TIMESHEET } from '../../actions';
import { log } from 'util';

@Component({
  selector: 'app-mwl-demo-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  @select('timesheet') timesheet;

  keyName: string;
  keyCode: number;

  projects: any;
  tasks: any;
  reasons: any;

  time = 0;
  comment = '';

  projectId: any;

  projectName: any;
  taskName: any;
  currentProjectId: number;
  currentTaskId: number;
  isShowListProject = false;
  isShowListTask = false;
  reasonData: any;

  clickedDate: Date;

  view = 'week';
  viewDate: Date = new Date();

  externalEvents: CalendarEvent[] = [];

  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  refresh: Subject<any> = new Subject();

  currentDate = null;
  selectedDay: WeekDay;

  minTime: number;

  // Listen keyboard
  @HostListener('window:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    this.keyName = event.key;
    this.keyCode = event.keyCode;
  }

  constructor(
    public apiService: ApiService,
    public helperService: HelperService,
    public configService: ConfigService,
    private ngRedux: NgRedux<any>,
    public datepipe: DatePipe
  ){
    this.getReason().then(data => {
      this.reasons = data;
    });

    this.minTime = this.configService.get('minTimeShowReason');
    this.currentDate = new Date();
  }

  ngOnInit() {
    this.helperService.getAllDataFromStore()
      .then(data => {
        this.externalEvents = data;
      });

    this.getAllProject().then(data => {
      console.log(data);
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
      this.apiService.getProject().subscribe(data => {
        resolve(data);
      });
    });

  }

  onProjectName() {
    this.isShowListProject = true;
  }

  chooseProject(project) {
    this.isShowListProject = false;
    this.taskName = '';
    this.isShowListTask = true;
    this.currentProjectId = project.id;
    this.apiService.getTask(project.id).subscribe(data => {
      this.tasks = data;
    });
    this.projectName = project.name;
  }

  changeProject($event) {
    this.taskName = null;
    this.apiService.getTask(this.currentProjectId).subscribe(data => {
      this.tasks = data;
      this.time = 0;
      this.comment = '';
    });
  }

  changeTask(task) {
    console.log(task.value);
  }

  onTaskName() {
    this.isShowListTask = true;
  }

  chooseTask(task) {
    this.isShowListTask = false;
    this.currentTaskId = task.id;
    this.taskName = task.name;
  }

  // When click date on calendar
  clickDate(event) {

    if (this.selectedDay) {
      delete this.selectedDay.cssClass;
    }
    event.cssClass = 'cal-day-selected';
    this.selectedDay = event;

    this.projectName = null;
    this.taskName = null;
    this.time = 0;
    this.comment = '';
    this.currentDate = event.date;

    this.helperService.getAllDataFromStore()
      .then(data => {
        console.log(data);
      });

    this.helperService.getWhereDate(event.date)
      .then(data => {
        this.externalEvents = data;
      });
  }

  // When submit timesheet
  submitTimeSheet(f: NgForm) {

    this.helperService.getAllDataFromStore()
      .then(data => {
        console.log(data);
      });

    let data_new = {
      id: Math.floor(1000 + Math.random() * 9000),
      projectId: this.currentProjectId,
      taskId: this.currentTaskId,
      project: f.value.project,
      task: f.value.task,
      comment: f.value.comment,
      time: f.value.time,
      color: colors.blue,
      start: this.currentDate == null ? new Date() : this.currentDate,
      draggable: true
    };

    this.helperService.getAllDataFromStore()
      .then(result => {
        console.log(result);
        result.push(data_new);
        this.helperService.saveToStore(result);

        this.helperService.getWhereDate(this.currentDate)
          .then(data => {
            this.externalEvents = data;
          });
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

  // When dropped events
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
      
    }

    if (this.currentDate !== null) {
      this.viewDate = this.currentDate;
    }

    this.helperService.getWhereDate(this.viewDate)
      .then(data => {
        this.externalEvents = data;
      });

    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }

    this.activeDayIsOpen = true;
    this.keyCode = null;
    this.keyName = null;
    
  }

}
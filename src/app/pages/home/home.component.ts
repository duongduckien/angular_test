import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { addDays, differenceInDays, startOfDay } from 'date-fns';
import { colors } from '../../common/colors';
import { ApiService } from '../../services/api.service';
import { HelperService } from '../../services/helper.service';
import { DatePipe } from '@angular/common';

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

  key_name: any;
  key_code: any;

  projects: any;
  tasks: any;
  reasons: any;

  time = 0;
  comment = '';

  projectId: any;

  project_name: any;
  task_name: any;
  current_project_id: number;
  isShowListProject = false;
  isShowListTask = false;
  task_data: any;
  reason_data: any;

  clickedDate: Date;

  view = 'month';
  viewDate: Date = new Date();

  externalEvents: CalendarEvent[] = [];

  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  refresh: Subject<any> = new Subject();

  @HostListener('window:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);
    this.key_name = event.key;
    this.key_code = event.keyCode;
  }

  constructor(
    public apiService: ApiService,
    public helperService: HelperService,
    private ngRedux: NgRedux<any>,
    public datepipe: DatePipe
  ) {

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

    this.apiService.getReason().subscribe(data => {
      this.reasons = data;
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
    this.task_name = '';
    this.isShowListTask = true;
    this.apiService.getTask(project.id).subscribe(data => {
      this.tasks = data;
    });
    this.project_name = project.name;
  }

  changeProject($event) {
    this.task_data = null;
    this.apiService.getTask(this.current_project_id).subscribe(data => {
      this.tasks = data;
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
    this.task_name = task.name;
  }

  clickDate(event) {

    this.helperService.getAllDataFromStore()
      .then(data => {
        console.log(data);
      });

    this.helperService.getWhereDate(event)
      .then(data => {
        this.externalEvents = data;
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
      if (item.id === parseInt(f.value.project)) {

        this.apiService.getTask(item.id)
          .subscribe(data => {

            data.forEach(value => {
              if (value.id === parseInt(f.value.task)) {
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
                  start: new Date(),
                  draggable: true
                };

                this.helperService.getAllDataFromStore()
                  .then(result => {
                    console.log(result);
                    result.push(data_new);
                    this.helperService.saveToStore(result);
                  });

              }
            });

          });
      }
    });


  }

  eventDropped({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex: number = this.externalEvents.indexOf(event);

    console.log(this.key_code);
    console.log(this.key_name);
    console.log(event);

    if (this.key_code === 17 || this.key_name === 'Control') {
      // this.helperService.updateData(event);
    }

    // if (externalIndex > -1) {
    //   this.externalEvents.splice(externalIndex, 1);
    //   this.events.push(event);
    // }

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
    this.key_code = null;
    this.key_name = null;

  }
}
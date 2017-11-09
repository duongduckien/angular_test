import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { addDays, differenceInDays, startOfDay } from 'date-fns';
import { colors } from '../../common/colors';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'mwl-demo-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  key_name: any;
  key_code: any;

  projects: any;
  tasks: any;

  projectId: any;

  project_data: any;
  task_data: any;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    // console.log(event);
    this.key_name = event.key;
    this.key_code = event.keyCode;
  }

  constructor(
    public apiService: ApiService
  ){
    
  }

  ngOnInit() {

    this.getAllProject()
      .then(data => {
        this.projects = data;

        // Get task of first project
        this.apiService.getTask(data[0].id)
          .subscribe(data => {
            this.tasks = data;
          });
      });

  }

  getAllProject(): Promise<any> {
    return new Promise(resolve => {
      this.apiService.getProject()
        .subscribe(data => {
          resolve(data);
        });
    })
  }

  changeProject(project) {
    this.apiService.getTask(project.value)
      .subscribe(data => {
        this.tasks = data;
      });
  }

  changeTask(task) {
    console.log(task.value);
  }

  submitTimeSheet(f: NgForm) {
    console.log(f.value);
  }

  view: string = 'month';
  viewDate: Date = new Date();
  
  externalEvents: CalendarEvent[] = [
    {
      title: 'Event 1',
      color: colors.yellow,
      start: new Date(),
      draggable: true
    },
    {
      title: 'Event 2',
      color: colors.blue,
      start: new Date(),
      draggable: true
    }
  ];
  
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;
  refresh: Subject<any> = new Subject();
  
  eventDropped({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex: number = this.externalEvents.indexOf(event);
    if (externalIndex > -1) {
      this.externalEvents.splice(externalIndex, 1);
      this.events.push(event);
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    this.viewDate = newStart;
    this.activeDayIsOpen = true;

    console.log(event);
    
  }

}

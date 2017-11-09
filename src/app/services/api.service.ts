import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiService {

  apiBase: string;

  constructor(
    public http: Http
  ){
    this.apiBase = 'http://qa01.oneit.com.au:16080/oneit/ws';
  }

  // Project
  getProject = () => {
    return this.http.get(this.apiBase + '/projects.jsp')
      .map(res => res.json());
  }

  // Task
  getTask = (projectId: number) => {
    return this.http.get(this.apiBase + '/tasksInProject.jsp?projectid=' + projectId)
      .map(res => res.json());
  }

  // Write of reason
  getReason = () => {
    return this.http.get(this.apiBase + '/writeoff.jsp')
      .map(res => res.json());
  }











  // // Directories

  // getDirectories() {
    
  //       return this.http.get(this.apiBase + '/directories')
  //         .map(res => res.json());
    
  //     }
    
  //     // Categories
    
  //     getCategories(params: any) {    
    
  //       if (params.dir_id) {
    
  //         return this.http.get(this.apiBase + '/directories/' + params.dir_id + '/categories')
  //           .map(res => res.json());
    
  //       } else {
    
  //         return this.http.get(this.apiBase + '/categories/' + params.cat_id)
  //           .map(res => res.json());
    
  //       }
    
  //     }

}
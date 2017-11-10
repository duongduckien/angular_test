import { Injectable } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { SUBMIT_TIMESHEET } from '../actions';

@Injectable()
export class HelperService {

  @select('timesheet') timesheet;

  constructor(
    private ngRedux: NgRedux<any>
  ){

  }

  saveToStore(data) {
    this.ngRedux.dispatch({
      type: SUBMIT_TIMESHEET,
      payload: data
    });
  }

  getAllDataFromStore(): Promise<any> {
    return new Promise(resolve => {
      this.timesheet.subscribe(data => {
        resolve(data);
      });
    })
  }

  getWhereDate(date): Promise<any> {
    return new Promise(resolve => {

      let data_arr = [];
      
      this.getAllDataFromStore().then(data => {
        for (let i=0; i<data.length; i++) {
          if (data[i].start.getDate() == date.getDate() && data[i].start.getMonth() == date.getMonth()) {
            data_arr.push(data[i]);
          }
        }
        resolve(data_arr);
      })

    });
  }

  updateData(data_update) {
    this.getAllDataFromStore().then(data => {

      data.push(data_update);
      this.ngRedux.dispatch({
        type: SUBMIT_TIMESHEET,
        payload: data
      });

    })
  }
  

}

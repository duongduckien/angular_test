import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchProjectByName'
})
export class SearchProjectByNamePipe implements PipeTransform {

  transform(arr: any, args: string): any {
    if (arr) {
      const tmp_array = [];
      arr.forEach(val => {
        if (val.name.toLowerCase().indexOf(args.toLowerCase()) > -1) {
          tmp_array.push(val);
        }
      });
      return tmp_array;
    }
  }

}

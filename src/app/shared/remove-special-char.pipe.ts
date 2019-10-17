import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpecialCharPipe'
})
export class RemoveSpecialCharPipe implements PipeTransform {

  transform(value: any, character: any[]): any {
    return value.replace(character,'');
  }

}

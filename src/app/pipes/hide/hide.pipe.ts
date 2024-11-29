import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hide',
  standalone: false
})
export class HidePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.toLowerCase().replace(/^(.{3}).*?(?=@)/, (match, p1) => `${p1}${'*'.repeat(match.length - p1.length)}`).replace(/@(.{2}).*?\./, (match, p1) => `@${p1}${'*'.repeat(match.length - p1.length - 1)}.`);
  }

}

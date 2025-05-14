import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@src/enviroments/enviroment';

@Pipe({
  name: 'appCmsMedia'
})
export class CmsMediaPipe implements PipeTransform {

  transform(url: string): string {
    if (!url) return '';

    return environment.cms.apiUrl + url;
  }
}

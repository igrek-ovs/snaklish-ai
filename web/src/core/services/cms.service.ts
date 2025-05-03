import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private cmsApiUrl: string = environment.cms.apiUrl;

  constructor(private readonly http: HttpClient) { }

  public getOverviewPageContent() {
    return this.http.get(`${this.cmsApiUrl}/api/overview-page?populate[Faq][populate]=faqList`).pipe(
      tap(console.log),
      map((res: any) => res.data.Faq)
    )
  }

  public getLocaleList() {
    return this.http.get<any>(`${this.cmsApiUrl}/api/locales`);
  }

  // public getLocaleMap() {
  //   return (
  //     this.http
  //       .get(`${this.cmsApiUrl}/translation-map`)
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       .pipe(map((res: any) => res.data.translationMap))
  //   );
  // }
}

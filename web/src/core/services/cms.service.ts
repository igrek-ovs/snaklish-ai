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
    return this.http.get(`${this.cmsApiUrl}/api/overview-page?` +
         `populate[Faq][populate]=faqList&` +
         `populate[linkWidget][populate]=linkList`).pipe(
      map((res: any) => res.data)
    )
  }

  public getLocaleList() {
    return this.http.get<any>(`${this.cmsApiUrl}/api/locales`);
  }

  public getLocaleMap() {
    return (
      this.http
        .get(`${this.cmsApiUrl}/api/translation-map`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pipe(map((res: any) => res.data.translationMap))
    );
  }

  public getHeaderLogo() {
    return this.http.get(`${this.cmsApiUrl}/api/header-logo?populate=*`).pipe(
      map((res: any) => res.data)
    )
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private apiUrl: string = environment.cms.apiUrl;

  constructor(private readonly httpClient: HttpClient) { }

  public getOverviewPageContent() {
    return this.httpClient.get(`${this.apiUrl}/api/overview-page?populate[Faq][populate]=faqList`).pipe(
      map((res: any) => res.data.Faq)
    )
  }
}

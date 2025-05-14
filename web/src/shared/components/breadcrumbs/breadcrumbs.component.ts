import { CommonModule } from '@angular/common';
import {
  signal,
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit {
  public breadcrumbs = signal<Breadcrumb[]>([]);

  constructor(private readonly router: Router) {}

  ngOnInit() {
    this.updateBreadcrumbs(this.router.routerState.snapshot.url);

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        tap((e: NavigationEnd) => {
          this.updateBreadcrumbs(e.urlAfterRedirects);
        })
      )
      .subscribe();
  }

  private updateBreadcrumbs(fullUrl: string) {
    const path = this.stripQueryParams(fullUrl);
    this.breadcrumbs.set(this.buildBreadcrumbs(path));
  }

  private buildBreadcrumbs(path: string): Breadcrumb[] {
    const crumbs: Breadcrumb[] = [];
    let accumulated = '';
    path
      .split('/')
      .filter(Boolean)
      .forEach((segment) => {
        accumulated += `/${segment}`;
        crumbs.push({
          label: /^\d+$/.test(segment) ? 'Details' : this.capitalize(segment),
          url: accumulated,
        });
      });
    return crumbs;
  }

  private stripQueryParams(url: string): string {
    const tree = this.router.parseUrl(url);
    return (
      tree.root.children['primary']?.segments
        .map((s) => s.path)
        .join('/') || ''
    );
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/[-_]/g, ' ');
  }

  public trackByUrl(_i: number, bc: Breadcrumb): string {
    return bc.url;
  }
}

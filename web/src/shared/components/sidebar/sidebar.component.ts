import {
  OnInit,
  Component,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppRoutes } from '@core/enums/app-routes.enum';
import { TranslatePipe } from "../../../core/pipes/translate.pipe";

export type SidebarItem = {
  title: string;
  icon?: string;
  href?: string;
  isAvailable?: () => boolean;
  children?: SidebarItem[];
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgIcon,
    NgIf,
    CdkAccordion,
    CdkAccordionItem,
    NgClass,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    AsyncPipe
],

  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @ViewChildren(CdkAccordionItem) items: QueryList<CdkAccordionItem> =
    new QueryList<CdkAccordionItem>();

    public readonly sidebarItems: SidebarItem[] = [
      {
        title: 'components.sidebar.overview',
        icon: 'tablerListNumbers',
        href: AppRoutes.Overview,
      },
      {
        title: 'components.sidebar.home',
        icon: 'tablerHome',
        href: '',
      },
      {
        title: 'components.sidebar.learnWord',
        icon: 'tablerBook',
        href: 'learn-word',
      },
      {
        title: 'components.sidebar.account',
        icon: 'tablerUser',
        href: 'account',
      },
      {
        title: 'components.sidebar.categories',
        icon: 'tablerGridDots',
        href: 'categories',
      },
      {
        title: 'components.sidebar.chat',
        icon: 'tablerMessageCircle',
        href: 'chat',
      },
      {
        title: 'components.sidebar.manageDictionary',
        icon: 'tablerBook',
        href: 'dictionary-list',
      },
    ];

  constructor(
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.sidebarItems
      .filter((e) => !!e.children?.length)
      .forEach((item) => {
        const subRoutes = item.children!.map((child) => child.href);
        if (subRoutes.some((route) => this.router.url.includes(route!))) {
          const group = this.items.find((e) => e.id === item.title);
          if (group) {
            group.expanded = true;
          }
        }
      });
  }

  public isAvailable(item: SidebarItem) {
    return item.isAvailable ? item.isAvailable() : true;
  }
}
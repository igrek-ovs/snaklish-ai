import {
  OnInit,
  Component,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { NgClass, NgIf } from '@angular/common';
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '@core/services';
// import { UserRight } from '@/core/enums';

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
  ],

  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @ViewChildren(CdkAccordionItem) items: QueryList<CdkAccordionItem> =
    new QueryList<CdkAccordionItem>();

  public readonly sidebarItems: SidebarItem[] = [
    {
      title: 'Home',
      icon: 'tablerHome',
      href: 'dashboard',
    },
    {
      title: 'Customers',
      icon: 'tablerUsersGroup',
      href: 'customers',
      // isAvailable: () => this.authService.hasRights(UserRight.CustomersRead),
    },
    {
      title: 'Sim Card Orders',
      icon: 'tablerTruckDelivery',
      href: 'sim-card-orders',
      // isAvailable: () =>
      //   this.authService.hasRights(UserRight.SimCardOrdersManage),
    },
    {
      title: 'Porting',
      icon: 'tablerIndentIncrease',
      // isAvailable: () => this.isPortingAvailable(),
      children: [
        {
          title: 'Inports',
          href: 'porting/inports',
          // isAvailable: () => this.authService.hasRights(UserRight.InportsRead),
        },
        {
          title: 'Outports',
          href: 'porting/outports',
          // isAvailable: () => this.authService.hasRights(UserRight.OutportsRead),
        },
      ],
    },
    {
      title: 'Billing',
      icon: 'tablerReportMoney',
      // isAvailable: () => this.isBillingAvailable(),
      children: [
        {
          title: 'Invoices',
          href: 'billing/invoices',
          // isAvailable: () => this.authService.hasRights(UserRight.InvoicesRead),
        },
        {
          title: 'Settings',
          href: 'billing/settings',
          // isAvailable: () =>
          //   this.authService.hasRights(UserRight.BillingSettingsRead),
        },
        {
          title: 'One time costs',
          href: 'billing/one-time-costs',
          // isAvailable: () =>
          //   this.authService.hasRights(UserRight.OneTimeCostsRead),
        },
      ],
    },
    {
      title: 'Product Catalog',
      icon: 'tablerPackage',
      // isAvailable: () => this.isProductCatalogAvailable(),
      children: [
        {
          title: 'Propositions',
          href: 'product-catalog/propositions',
          // isAvailable: () =>
          //   this.authService.hasRights(UserRight.BusinessRulesRead),
        },
        {
          title: 'Subscriptions',
          href: 'product-catalog/subscriptions',
          // isAvailable: () =>
          //   this.authService.hasRights(UserRight.SubscriptionsRead),
        },
        {
          title: 'Bundles',
          href: 'product-catalog/bundles',
          // isAvailable: () => this.authService.hasRights(UserRight.BundlesRead),
        },
        {
          title: 'Offerings',
          href: 'product-catalog/kpn-offerings',
          // isAvailable: () =>
          //   this.authService.hasRights(UserRight.OfferingsRead),
        },
        {
          title: 'Discounts',
          href: 'product-catalog/discounts',
          // isAvailable: () =>
          //   this.authService.hasRights(UserRight.DiscountsRead),
        },
        {
          title: 'Additional Prices',
          href: 'product-catalog/additional-prices',
          // isAvailable: () =>
          //   this.authService.hasRights(UserRight.AdditionalPricesRead),
        },
      ],
    },
    {
      title: 'Administration',
      icon: 'tablerUserStar',
      // isAvailable: () => this.isAdministrationAvailable(),
      children: [
        {
          title: 'Users',
          href: 'administration/users',
          // isAvailable: () => this.authService.hasRights(UserRight.UsersRead),
        },
        {
          title: 'Roles',
          href: 'administration/roles',
          // isAvailable: () => this.authService.hasRights(UserRight.RolesRead),
        },
        {
          title: 'Stock',
          href: 'administration/stock-management',
          // isAvailable: () =>
          //   [UserRight.StockSimRead, UserRight.StockSimRead].some((right) =>
          //     this.authService.hasRights(right)
          //   ),
        },
        {
          title: 'Templates',
          href: 'administration/template-management',
          // isAvailable: () =>
          //   [UserRight.TemplatesEmailRead, UserRight.TemplatesSmsRead].some(
          //     (right) => this.authService.hasRights(right)
          //   ),
        },
        {
          title: 'Notifications',
          href: 'administration/notifications',
          // isAvailable: () =>
          //   [
          //     UserRight.NotificationsEmailRead,
          //     UserRight.NotificationsSmsRead,
          //     UserRight.NotificationsKpnSmsRead,
          //   ].some((right) => this.authService.hasRights(right)),
        },
      ],
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService
  ) {
    console.log(router.url);
  }

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

  // private isPortingAvailable() {
  //   return [UserRight.InportsRead, UserRight.OutportsRead].some((right) =>
  //     this.authService.hasRights(right)
  //   );
  // }

  // private isProductCatalogAvailable() {
  //   return [
  //     UserRight.BusinessRulesRead,
  //     UserRight.BundlesRead,
  //     UserRight.SubscriptionsRead,
  //     UserRight.OfferingsRead,
  //     UserRight.DiscountsRead,
  //   ].some((right) => this.authService.hasRights(right));
  // }

  // private isAdministrationAvailable() {
  //   return [
  //     UserRight.RolesRead,
  //     UserRight.UsersRead,
  //     UserRight.TemplatesEmailRead,
  //     UserRight.TemplatesSmsRead,
  //     UserRight.NotificationsEmailRead,
  //     UserRight.NotificationsSmsRead,
  //     UserRight.NotificationsKpnSmsRead,
  //     UserRight.StockSimRead,
  //     UserRight.StockEsimRead,
  //   ].some((right) => this.authService.hasRights(right));
  // }

  // private isBillingAvailable() {
  //   return [
  //     UserRight.InvoicesRead,
  //     UserRight.OneTimeCostsRead,
  //     UserRight.BillingSettingsRead,
  //     UserRight.AdditionalPricesRead,
  //   ].some((right) => this.authService.hasRights(right));
  // }
}
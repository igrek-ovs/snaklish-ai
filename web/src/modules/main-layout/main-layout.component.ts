import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../core/enums/app-routes.enum';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, OverlayModule, NavbarComponent, RouterLink],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  public isSidebarShowed = signal(false);
  public isUserMenuShowed = signal(false);
  public isAppsMenuShowed = signal(false);
  public isNotificationMenuShowed = signal(false);

  public AppRoutes = AppRoutes;

  constructor(public readonly router: Router) {}

  ngOnInit(): void {}

  public signOut() {}
}

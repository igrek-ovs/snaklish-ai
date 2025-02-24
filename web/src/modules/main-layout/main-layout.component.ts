import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  public isSidebarShowed = signal(false);
  public isUserMenuShowed = signal(false);
  public isAppsMenuShowed = signal(false);
  public isNotificationMenuShowed = signal(false);

  constructor(
    public readonly router: Router,
  ) {}

  ngOnInit(): void {
  }

  public signOut() {
  }
}

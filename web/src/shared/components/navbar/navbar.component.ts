import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { tap } from 'rxjs';
import { LocaleService } from '@core/services';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
imports: [NgFor, NgIf],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  public userInitials = signal<string>('');
  public locales: { name: string; code: string }[] = [];
  public currentLocale = '' as string;

  constructor(private readonly userService: UserService, private readonly localeService: LocaleService) {
    this.currentLocale = this.localeService.currentLocale;
  }

  ngOnInit(): void {
    this.userService
      .getUser()
      .pipe(
        tap((user) => {
          const userName = user.name;
          this.userInitials.set(userName.charAt(0).toUpperCase());
        })
      )
      .subscribe();

      this.localeService.locales$.subscribe((list) => {
        this.locales = list;
      });
  
      this.localeService.trackLocale().subscribe();
  }

  public signOut() {
    this.userService.signOut();
  }

  public onLocaleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newLocale = select.value;
    this.localeService.changeLocale(newLocale);
  }
}

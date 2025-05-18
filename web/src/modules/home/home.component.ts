import { Component } from '@angular/core';
import { SvgComponent } from "../../shared/components/svg/svg.component";
import { TranslatePipe } from "../../core/pipes/translate.pipe";
import { AsyncPipe } from '@angular/common';
import { UserService } from '@core/services';
import { Observable } from 'rxjs';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-home',
  imports: [SvgComponent, TranslatePipe, AsyncPipe],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public user$: Observable<User | null>;

  constructor(private readonly userService: UserService) {
    this.user$ = this.userService.user$;
  }
}

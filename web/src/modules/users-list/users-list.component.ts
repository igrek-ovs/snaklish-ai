import { Component, OnInit, signal } from '@angular/core';
import { UserRoles } from '@core/enums/user-roles.enum';
import { User } from '@core/models/user.model';
import { UsersService } from '@core/services/users.service';
import { ChipColorsEnum } from '@shared/components/chip/chip.component';
import { ColumnDef, ColumnType } from '@shared/components/table/header-def.model';
import { TableComponent } from '@shared/components/table/table.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-users-list',
  imports: [TableComponent],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  public users = signal<User[]>([]);

  public readonly headers: ColumnDef<User>[] = [
    {
      fieldName: 'name',
      displayName: 'Name',
      type: ColumnType.Text,
    },
    {
      fieldName: 'email',
      displayName: 'Email',
      type: ColumnType.Text,
    },
    {
      fieldName: 'isEmailConfirmed',
      displayName: 'Is Email Confirmed',
      type: ColumnType.Chip,
      colors: [ChipColorsEnum.Success, ChipColorsEnum.Error],
      labels: ['Confirmed', 'Not confirmed'],
    },
    {
      fieldName: 'role',
      displayName: 'Role',
      type: ColumnType.Text,
    }
  ];

  constructor(
    private readonly usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.usersService.getUsers().pipe(
    tap((users) => this.users.set(users)))
    .subscribe();
  }
}

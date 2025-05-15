import { Component, OnInit, signal } from '@angular/core';
import { UserRoles } from '@core/enums/user-roles.enum';
import { User } from '@core/models/user.model';
import { UsersService } from '@core/services/users.service';
import { provideIcons } from '@ng-icons/core';
import { ChipColorsEnum } from '@shared/components/chip/chip.component';
import { ActionConfig, ActionFiredEvent, ColumnDef, ColumnType } from '@shared/components/table/header-def.model';
import { TableComponent } from '@shared/components/table/table.component';
import { finalize, tap } from 'rxjs';
import { tablerUserOff } from '@ng-icons/tabler-icons';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-users-list',
  providers: [provideIcons({ tablerUserOff })],
  imports: [TableComponent],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  public users = signal<User[]>([]);
  public isLoading = signal<boolean>(true);

  public usersActions: ActionConfig<User>[] = [
    {
      icon: 'tablerUserOff',
      tooltip: 'Delete user',
      eventName: 'Delete',
      iconClass: 'icon-delete',
    },
  ];

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
    private readonly dialog: Dialog,
    private readonly hotToastService: HotToastService,
  ) {}

  ngOnInit(): void {
    this.usersService.getUsers().pipe(
      tap((users) => this.users.set(users)),
      finalize(() => this.isLoading.set(false)),
    ).subscribe();
  }

  public handleAction(event: ActionFiredEvent<User>) {
    const action = event.eventName;

    if (action === 'Delete') {
      const dialogRef = this.dialog.open(ConfirmationModalComponent);

      dialogRef.closed.pipe().subscribe();
    }
  }
}

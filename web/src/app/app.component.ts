import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { tablerEdit, tablerTrash } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  providers: [
    provideIcons({ tablerEdit, tablerTrash }),
  ]
})
export class AppComponent {
  title = 'Snaklish-AI';
}

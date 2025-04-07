import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { tablerEdit, tablerTrash } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [provideIcons({ tablerEdit, tablerTrash })],
  template: ` <router-outlet /> `,
})
export class AppComponent {
  title = 'Snaklish-AI';
}

import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgComponent } from "../svg/svg.component";

@Component({
  selector: 'app-links-list-widget',
  imports: [RouterLink, SvgComponent],
  templateUrl: './links-list-widget.component.html',
  styles: ``
})
export class LinksListWidgetComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public linksList = input<any[]>([]);
}

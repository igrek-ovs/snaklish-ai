import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerChevronLeftPipe, tablerChevronLeft, tablerChevronRight, tablerChevronRightPipe } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [NgClass, NgIcon],
  providers: [provideIcons({tablerChevronLeftPipe, tablerChevronLeft, tablerChevronRightPipe, tablerChevronRight})],
  templateUrl: './paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  public totalPages = input.required<number>();
  public maxPagesToShow = input<number>(5);

  public activePage = model<number>(1);

  public get pages() {
    const halfMaxPagesToShow = Math.floor(this.maxPagesToShow() / 2);
    let startPage: number;
    let endPage: number;

    if (this.totalPages() <= this.maxPagesToShow()) {
      startPage = 1;
      endPage = this.totalPages();
    } else {
      startPage = Math.max(this.activePage() - halfMaxPagesToShow, 1);
      endPage = Math.min(
        this.activePage() + halfMaxPagesToShow,
        this.totalPages()
      );

      if (endPage - startPage + 1 < this.maxPagesToShow()) {
        if (startPage === 1) {
          endPage = Math.min(
            startPage + this.maxPagesToShow() - 1,
            this.totalPages()
          );
        } else if (endPage === this.totalPages()) {
          startPage = Math.max(endPage - this.maxPagesToShow() + 1, 1);
        }
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  public setPage(page: number) {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.activePage.set(page);
  }
}
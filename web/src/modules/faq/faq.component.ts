import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { CmsService } from '@core/services';
import { Image } from '@core/models';
import { tap } from 'rxjs';
import { CmsMediaPipe } from '@core/pipes/cms-media.pipe';
import { FaqWidgetComponent } from '@shared/components/faq-widget/faq-widget.component';

interface WhyBlock {
  id: number;
  title: string;
  description: string;
  icon: Image;
  link: string;
  url: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  imports: [NgFor, CmsMediaPipe, FaqWidgetComponent],
})
export class FaqComponent implements OnInit {
  @ViewChild('scrollContainer', { static: true }) 
  private scrollContainer!: ElementRef<HTMLElement>;

  public tabList = [
    { title: 'Overview', url: '/overview' },
    { title: 'Details',  url: '/details'  },
    { title: 'FAQ',      url: '/faq'      },
  ];

  public faqSectionOverview = {
      title: 'Overview',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      faqList: [
        { id: 1, question: 'What is Lorem Ipsum?', answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
        { id: 2, question: 'Why do we use it?', answer: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.' },
        { id: 3, question: 'Where does it come from?', answer: 'Contrary to popular belief, Lorem Ipsum is not simply random text.' }
      ]
  };

  public faqSectionDetails = {
      title: 'Details',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      faqList: [
        { id: 1, question: 'What is Lorem Ipsum?', answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
        { id: 2, question: 'Why do we use it?', answer: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.' },
        { id: 3, question: 'Where does it come from?', answer: 'Contrary to popular belief, Lorem Ipsum is not simply random text.' }
      ]
  };

  public faqSectionFaq = {
      title: 'FAQ',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      faqList: [
        { id: 1, question: 'What is Lorem Ipsum?', answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
        { id: 2, question: 'Why do we use it?', answer: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.' },
        { id: 3, question: 'Where does it come from?', answer: 'Contrary to popular belief, Lorem Ipsum is not simply random text.' }
      ]
  };

  public whyBlocks = signal<WhyBlock[]>([]);

  public selectedTab = this.tabList[0];

  constructor(private readonly cmsService: CmsService) {}

  ngOnInit(): void {
    this.cmsService.getFaqPageContent().pipe(
      tap((content) => {
        const { whyBlocks } = content;
        this.whyBlocks.set(whyBlocks);
      })
    ).subscribe();
  }

  public selectTab(tab: { title: string; url: string }) {
    this.selectedTab = tab;
  
    const container = this.scrollContainer.nativeElement as HTMLElement;
    const target = container.querySelector(`#${tab.title}`) as HTMLElement;
    if (!target) return;
  
    const header = container.parentElement?.querySelector('.sticky') as HTMLElement;
    const headerHeight = header?.getBoundingClientRect().height || 0;
  
    const containerHeight = container.clientHeight;
    const targetHeight = target.clientHeight;
  
    const offsetTop =
      target.offsetTop -
      headerHeight -
      (containerHeight / 2 - targetHeight / 2);
  
    container.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

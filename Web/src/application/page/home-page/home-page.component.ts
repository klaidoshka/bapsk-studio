import {Component} from '@angular/core';
import {CardComponent} from '../../component/card/card.component';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {TranslatePipe} from '@ngx-translate/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'home-page',
  imports: [
    CardComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    TranslatePipe
  ],
  templateUrl: './home-page.component.html',
  styles: ``
})
export class HomePageComponent {
  protected readonly supportEmail = environment.SUPPORT__EMAIL;

  protected readonly faqKeys = [
    'page.home.faq.data.0',
    'page.home.faq.data.1',
    'page.home.faq.data.2',
    'page.home.faq.data.3',
    'page.home.faq.data.4',
    'page.home.faq.data.5',
    'page.home.faq.data.6',
    'page.home.faq.data.7',
    'page.home.faq.data.8'
  ];

  protected readonly gettingStartedStepKeys = [
    'page.home.getting-started.data.0',
    'page.home.getting-started.data.1',
    'page.home.getting-started.data.2',
    'page.home.getting-started.data.3',
    'page.home.getting-started.data.4',
    'page.home.getting-started.data.5',
    'page.home.getting-started.data.6',
    'page.home.getting-started.data.7',
    'page.home.getting-started.data.8',
    'page.home.getting-started.data.9'
  ];
}

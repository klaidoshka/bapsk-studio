import {Component} from '@angular/core';
import {CardComponent} from '../../component/card/card.component';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';

@Component({
  selector: 'home-page',
  imports: [
    CardComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent
  ],
  templateUrl: './home-page.component.html',
  styles: ``
})
export class HomePageComponent {
  protected readonly gettingStartedSteps = [
    {
      title: 'Create your Workspace Instance',
      description: 'This is where you will manage your business data.'
    },
    {
      title: 'Invite your Team',
      description: 'Collaborate with your team members and share the instance.'
    },
    {
      title: 'Define your Data',
      description: 'Define the structure of your data by creating custom data types.'
    },
    {
      title: 'Create Data Entries',
      description: 'Start adding data to your instance by creating entries.'
    },
    {
      title: 'Define Import Configuration',
      description: 'To import entries from files in defined CSV formats.'
    },
    {
      title: 'Setup Report Template',
      description: 'To visualize your data type entries on a printable report.'
    },
    {
      title: 'Import External Data',
      description: 'Use the import configuration to import data from files.'
    },
    {
      title: 'Generate Report',
      description: 'Generate and export reports based on your data.'
    }
  ];

  protected readonly faqs = [
    {
      question: 'What is the purpose of this application?',
      answer: 'This application is designed to help you manage your business data in a simple and ' +
        'effective way. It may look that this is Notepad or TODO application alternative, but no. ' +
        'This application is designed to be more than just a notepad. It provides a ' +
        'structured way to manage your business data, allowing you to define custom data types, ' +
        'import data from files, generate reports and submit VAT returns.'
    },
    {
      question: 'How do I create a new workspace instance?',
      answer: 'You can create a new workspace instance by going into Instances and clicking on the ' +
        '"Create Instance" button.'
    },
    {
      question: 'Can I invite my team members to collaborate?',
      answer: 'Yes, you can invite your team members by going to your created workspace instance, ' +
        'editing it and sending them an invitation by email.'
    },
    {
      question: 'How do I define my data structure?',
      answer: 'You can define your data structure by creating custom data types in the "Data Types" ' +
        'section within your workspace.'
    },
    {
      question: 'How do I import data from files?',
      answer: 'You can import data from files by defining an import configuration in the "Import ' +
        'Configurations" section and then using it to import data from CSV files within specific ' +
        'Data Entry sections.'
    },
    {
      question: 'How do I generate reports?',
      answer: 'You can generate reports by setting up a report template in the "Report Templates" ' +
        'section and then using it within Generate Report section to generate reports based on ' +
        'your data entries.'
    },
    {
      question: 'How do I submit VAT returns?',
      answer: 'It is only possible by using the predefined data structures of customers, salesmen ' +
        'and sales. You have to create sale entries and then submit them for VAT returns. ' +
        'VAT return is explicitly integrated into Lithuanian tax system. So, it is only ' +
        'available for Lithuania\'s salesmen.'
    },
    {
      question: 'Is there a limit to the number of entries I can create?',
      answer: 'No, there is no limit to the number of entries you can create in your workspace ' +
        'instance.'
    },
    {
      question: 'Isn\'t it too much to manage all these steps?',
      answer: 'At first glance, it may seem overwhelming, but once you get the hang of it, it ' +
        'becomes a simple and effective process. Each step is quite straightforward.'
    }
  ];
}

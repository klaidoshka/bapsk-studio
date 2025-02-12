import {Component, inject, OnInit} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';

interface Instance {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
}

@Component({
  selector: 'app-instance-page',
  imports: [
    Dialog,
    FormsModule,
    InputText,
    TableModule,
    DatePipe,
    Button
  ],
  templateUrl: './instance-page.component.html',
  providers: [ConfirmationService, MessageService]
})
export class InstancePageComponent implements OnInit {
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  instances: Instance[] = [];
  instanceDialog: boolean = false;
  instance: Instance = {name: '', createdAt: new Date()};
  selectedInstances: Instance[] = [];

  ngOnInit() {
    // Load instances (this should be replaced with a service call)
    this.instances = [
      {id: 1, name: 'Instance 1', description: 'Description 1', createdAt: new Date()},
      {id: 2, name: 'Instance 2', description: 'Description 2', createdAt: new Date()}
    ];
  }

  openNew() {
    this.instance = {name: '', createdAt: new Date()};
    this.instanceDialog = true;
  }

  editInstance(instance: Instance) {
    this.instance = {...instance};
    this.instanceDialog = true;
  }

  deleteInstance(instance: Instance) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + instance.name + '?',
      accept: () => {
        this.instances = this.instances.filter(i => i.id !== instance.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Instance Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.instanceDialog = false;
  }

  saveInstance() {
    if (this.instance.id) {
      this.instances[this.findIndexById(this.instance.id)] = this.instance;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Instance Updated',
        life: 3000
      });
    } else {
      this.instance.id = this.createId();
      this.instances.push(this.instance);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Instance Created',
        life: 3000
      });
    }
    this.instances = [...this.instances];
    this.instanceDialog = false;
    this.instance = {name: '', createdAt: new Date()};
  }

  findIndexById(id: number): number {
    return this.instances.findIndex(instance => instance.id === id);
  }

  createId(): number {
    return Math.floor(Math.random() * 1000);
  }
}

import {Component, inject, OnInit, signal} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {InstanceService} from '../../service/instance.service';
import {AuthService} from '../../service/auth.service';
import {first} from 'rxjs';
import Instance from '../../model/instance.model';
import ErrorResponse from '../../model/error-response.model';
import {TableModule} from 'primeng/table';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {Textarea} from 'primeng/textarea';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'instance-page',
  templateUrl: './instance-page.component.html',
  standalone: true,
  imports: [
    TableModule,
    Dialog,
    FormsModule,
    InputText,
    ButtonDirective,
    Textarea,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
})
export class InstancePageComponent implements OnInit {
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private instanceService = inject(InstanceService);
  private messageService = inject(MessageService);

  instances: Instance[] = [];
  editingInstance: Instance | null = null;
  displayDialog = signal<boolean>(false);
  description = signal<string | null>(null);
  name = signal<string | null>(null);

  ngOnInit() {
    this.authService.getUser().subscribe({
      next: (user) => {
        if (!user) {
          return;
        }

        this.instanceService.getByUserId(user.id).subscribe({
          next: (instances) => {
            this.instances = instances;
          }
        });
      }
    })
  }

  async createInstance() {
    if (!this.name()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Name is required'
      });
      return;
    }

    this.instanceService.create({
      name: this.name()!,
      description: this.description()
    })
    .pipe(first())
    .subscribe({
      next: (instance) => {
        this.instances.push(instance);
        this.name.set(null);
        this.description.set(null);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Instance created successfully'
        });
      },
      error: (response: ErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error.messages[0]
        });
      }
    });
  }

  async deleteInstance(instance: Instance) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this instance?',
      accept: () => {
        this.instanceService.delete(instance.id!).pipe(first()).subscribe({
          next: () => {
            this.instances = this.instances.filter((i) => i.id !== instance.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Instance deleted successfully'
            });
          },
          error: (response: ErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.error.messages[0]
            });
          }
        });
      }
    })
  }

  async openCreation() {
    this.name.set(null);
    this.description.set(null);
    this.editingInstance = null;
    this.displayDialog.set(true);
  }

  async openEdit(instance: Instance) {
    this.name.set(instance.name);
    this.description.set(instance.description);
    this.editingInstance = instance;
    this.displayDialog.set(true);
  }

  async saveInstance() {
    if (this.editingInstance) {
      if (!this.name()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Name is required'
        });
        return;
      }

      this.instanceService.edit({
        id: this.editingInstance.id!,
        name: this.name()!,
        description: this.description()
      }).pipe(first()).subscribe({
        next: () => {
          const index = this.instances.findIndex(i => i.id === this.editingInstance?.id);

          this.instances[index] = {
            ...this.editingInstance!,
            name: this.name()!,
            description: this.description()
          };

          this.displayDialog.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Instance edited successfully'
          });
        },
        error: (response: ErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.error.messages[0]
          });
        }
      });
    } else {
      // Create logic
      await this.createInstance();
      this.displayDialog.set(false);
    }
  }
}

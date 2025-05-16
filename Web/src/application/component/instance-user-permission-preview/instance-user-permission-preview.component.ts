import {Component, computed, input} from '@angular/core';
import {Badge} from "primeng/badge";
import {instanceUserPermissions} from '../../constant/instance-user.permissions';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'instance-user-permission-preview',
  imports: [
    Badge,
    TranslatePipe
  ],
  templateUrl: './instance-user-permission-preview.component.html',
  styles: ``
})
export class InstanceUserPermissionPreviewComponent {
    readonly permissions = input.required<string[]>();

    protected readonly allPermissions = computed(() => instanceUserPermissions.map(p => ({
      ...p,
      toggled: this.permissions().includes(p.value)
    })));
}

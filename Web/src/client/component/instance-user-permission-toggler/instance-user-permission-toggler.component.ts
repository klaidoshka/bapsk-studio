import {Component, input} from '@angular/core';
import {Badge} from "primeng/badge";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'instance-user-permission-toggler',
  imports: [
    Badge,
    NgForOf
  ],
  templateUrl: './instance-user-permission-toggler.component.html',
  styles: ``
})
export class InstanceUserPermissionTogglerComponent {
  readonly permissions = input.required<{ label: string; toggled: boolean }[]>();
  readonly toggle = input.required<(userIndex: number, permissionIndex: number) => void>();
  readonly userIndex = input.required<number>();
}

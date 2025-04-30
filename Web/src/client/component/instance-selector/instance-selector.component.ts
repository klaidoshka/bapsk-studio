import {Component, effect, inject, ViewEncapsulation} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import {InstanceService} from '../../service/instance.service';
import {Button} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {rxResource} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {NumberUtil} from '../../util/number.util';
import Instance from '../../model/instance.model';

@Component({
  selector: 'instance-selector',
  imports: [
    DropdownModule,
    Button,
    ReactiveFormsModule,
    FormsModule,
    Select
  ],
  templateUrl: './instance-selector.component.html',
  styleUrl: `./instance-selector.component.scss`,
  encapsulation: ViewEncapsulation.None
})
export class InstanceSelectorComponent {
  private readonly instanceService = inject(InstanceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly instances = rxResource({loader: () => this.instanceService.getAll()});
  protected readonly selectedInstance = this.instanceService.getActiveInstance();

  constructor() {
    effect(() => {
      const instanceId = NumberUtil.parse(this.route.snapshot.paramMap.get('instanceId'));

      if (instanceId) {
        const found = this.instances.value()?.find(i => i.id === instanceId);

        if (found) {
          this.instanceService.setActiveInstance(found);
        }
      }
    });
  }

  protected onChange(instance: Instance) {
    const tree = this.router.parseUrl(this.router.url);
    const segments = [...(tree.root.children['primary']?.segments ?? [])];
    const index = segments.findIndex(s => s.path === 'workspace');

    this.instanceService.setActiveInstance(instance);

    if (index >= 0 && segments.length > index + 1) {
      segments[index + 1] = new UrlSegment(instance.id!.toString(), {});
      this.router.navigate(segments.map(s => s.path));
      return;
    }

    this.router.navigate(['/home/workspace/' + instance.id]);
  }

  protected manage() {
    this.router.navigate(['/home/instance/create']);
  }
}

import {Component, inject} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import {InstanceService} from '../../service/instance.service';
import {Button} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {rxResource} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink, UrlSegment} from '@angular/router';
import Instance from '../../model/instance.model';
import {first} from 'rxjs';
import {NumberUtil} from '../../util/number.util';
import {Splitter} from 'primeng/splitter';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'instance-selector',
  imports: [
    DropdownModule,
    Button,
    ReactiveFormsModule,
    FormsModule,
    Select,
    Splitter,
    RouterLink,
    FloatLabel
  ],
  templateUrl: './instance-selector.component.html'
})
export class InstanceSelectorComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly instanceService = inject(InstanceService);
  protected readonly instances = rxResource({loader: () => this.instanceService.getAll()});
  protected readonly selectedInstance = this.instanceService.getActiveInstance();

  constructor() {
    this.route.params
      .pipe(first())
      .subscribe(params => {
        const instanceId = NumberUtil.parse(params['instanceId']);

        if (instanceId) {
          this.instanceService
            .getById(instanceId)
            .pipe(first())
            .subscribe(instance => this.instanceService.setActiveInstance(instance));
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
}

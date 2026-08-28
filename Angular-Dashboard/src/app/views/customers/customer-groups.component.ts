import { Component, inject } from '@angular/core';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { CustomerGroupService } from './customer-group.service';

@Component({
  selector: 'app-customer-groups',
  standalone: true,
  imports: [SharedUIModule],
  templateUrl: './customer-groups.component.html',
})
export class CustomerGroupsComponent {
  private readonly svc = inject(CustomerGroupService);

  get groups() { return this.svc.all; }
}

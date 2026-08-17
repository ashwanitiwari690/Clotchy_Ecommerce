import { Component } from '@angular/core';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { CUSTOMER_GROUPS_MOCK } from '../../core/mock-data/customers.mock';

@Component({
  selector: 'app-customer-groups',
  standalone: true,
  imports: [SharedUIModule],
  templateUrl: './customer-groups.component.html',
})
export class CustomerGroupsComponent {
  readonly groups = CUSTOMER_GROUPS_MOCK;
}

import { Component } from '@angular/core';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { CUSTOMERS_MOCK } from '../../core/mock-data/customers.mock';

@Component({
  selector: 'app-customer-addresses',
  standalone: true,
  imports: [SharedUIModule],
  templateUrl: './customer-addresses.component.html',
})
export class CustomerAddressesComponent {
  get rows() {
    return CUSTOMERS_MOCK.flatMap((c) => c.addresses.map((a) => ({ customer: c, address: a })));
  }
}

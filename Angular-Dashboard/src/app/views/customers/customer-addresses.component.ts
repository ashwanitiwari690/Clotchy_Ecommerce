import { Component, inject } from '@angular/core';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customer-addresses',
  standalone: true,
  imports: [SharedUIModule],
  templateUrl: './customer-addresses.component.html',
})
export class CustomerAddressesComponent {
  private readonly svc = inject(CustomerService);

  get rows() {
    return this.svc.all.flatMap((c) => c.addresses.map((a) => ({ customer: c, address: a })));
  }
}

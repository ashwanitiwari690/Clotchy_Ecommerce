import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedUIModule } from '../../shared/shared-ui.module';

@Component({
  selector: 'app-ticket-categories',
  standalone: true,
  imports: [SharedUIModule, FormsModule],
  templateUrl: './ticket-categories.component.html',
})
export class TicketCategoriesComponent {
  categories = signal<string[]>(['Order Issue', 'Payments', 'Account', 'Product', 'Shipping']);
  newCategory = '';

  addCategory(): void {
    const name = this.newCategory.trim();
    if (!name) return;
    this.categories.update((list) => [...list, name]);
    this.newCategory = '';
  }

  removeCategory(name: string): void {
    this.categories.update((list) => list.filter((c) => c !== name));
  }
}

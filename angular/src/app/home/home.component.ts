import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService, HomeData } from '../catalog.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly home = signal<HomeData | null>(null);

  constructor(private catalog: CatalogService) {
    this.catalog.getHome().subscribe((data) => this.home.set(data));
  }
}

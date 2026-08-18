import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../catalog.service';

interface CollectionView {
  name: string;
  image: string;
  subtitle: string;
}

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsComponent {
  collections = signal<CollectionView[]>([]);

  constructor(private catalog: CatalogService) {
    this.catalog.getCollections().subscribe((collections) => {
      this.collections.set(
        collections.map((c) => ({ name: c.name, image: c.image ?? '', subtitle: (c.description ?? '').toUpperCase() })),
      );
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { HomeCollectionService } from './home-collection.service';
import { CollectionService } from '../../collections/collection.service';
import { HomeCollectionFeature } from '../../../core/models/homepage.model';
import { ToastService } from '../../../layout/toasts/toast.service';

@Component({
  selector: 'app-home-collections',
  standalone: true,
  imports: [SharedUIModule, FormsModule, IconDirective],
  templateUrl: './home-collections.component.html',
})
export class HomeCollectionsComponent {
  private readonly svc = inject(HomeCollectionService);
  private readonly collectionSvc = inject(CollectionService);
  private readonly toast = inject(ToastService);

  pickedCollectionId = '';
  pickedDescription = '';
  pickedLink = '';
  editingFeature = signal<HomeCollectionFeature | null>(null);

  get features(): HomeCollectionFeature[] {
    return [...this.svc.all].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  get availableCollections() {
    const featuredIds = new Set(this.svc.all.map((f) => f.collectionId));
    return this.collectionSvc.all.filter((c) => !featuredIds.has(c.id));
  }

  collectionName(id: string): string { return this.collectionSvc.getById(id)?.name ?? '—'; }
  collectionImage(id: string): string { return this.collectionSvc.getById(id)?.image ?? ''; }

  onPick(id: string): void {
    this.pickedCollectionId = id;
    const col = this.collectionSvc.getById(id);
    this.pickedDescription = col?.description ?? '';
    this.pickedLink = `/collections/${col?.slug ?? ''}`;
  }

  addPicked(): void {
    if (!this.pickedCollectionId) return;
    this.svc.add(this.pickedCollectionId, this.pickedDescription, this.pickedLink);
    this.toast.success('Collection added to homepage.');
    this.pickedCollectionId = '';
    this.pickedDescription = '';
    this.pickedLink = '';
  }

  openEdit(feature: HomeCollectionFeature): void {
    this.editingFeature.set({ ...feature });
  }

  saveEdit(): void {
    const f = this.editingFeature();
    if (!f) return;
    this.svc.update(f.id, { shortDescription: f.shortDescription, link: f.link }).subscribe(() => this.toast.success('Collection feature updated.'));
  }

  remove(feature: HomeCollectionFeature): void {
    this.svc.remove(feature.id);
    this.toast.success('Collection removed from homepage.');
  }

  toggleStatus(feature: HomeCollectionFeature): void {
    this.svc.toggleStatus(feature);
  }

  move(feature: HomeCollectionFeature, direction: 'up' | 'down'): void {
    this.svc.move(feature.id, direction);
  }
}

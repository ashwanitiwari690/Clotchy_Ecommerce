import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { ProductService } from './product.service';
import { CategoryService } from '../categories/category.service';
import { CollectionService } from '../collections/collection.service';
import { placeholderImage } from '../../core/models/common.model';
import { ToastService } from '../../layout/toasts/toast.service';
import { UploadedImage } from '../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  private readonly svc = inject(ProductService);
  private readonly categorySvc = inject(CategoryService);
  private readonly collectionSvc = inject(CollectionService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  get categories() { return this.categorySvc.all; }
  get collections() { return this.collectionSvc.all; }

  readonly productId = this.route.snapshot.paramMap.get('id');
  readonly isEdit = !!this.productId;

  mainImage = signal<UploadedImage[]>([]);
  galleryImages = signal<UploadedImage[]>([]);
  thumbnailImage = signal<UploadedImage[]>([]);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    description: [''],
    shortDescription: [''],
    categoryId: ['', Validators.required],
    collectionIds: this.fb.nonNullable.control<string[]>([]),
    tags: [''],

    price: [0, Validators.required],
    salePrice: [''],
    costPrice: [0],
    tax: [5],
    discount: [0],

    stock: [0],
    lowStockThreshold: [10],
    availability: ['in-stock' as 'in-stock' | 'out-of-stock' | 'backorder'],
    allowBackorder: [false],

    variantSize: [''],
    variantColor: [''],
    variantMaterial: [''],

    metaTitle: [''],
    metaDescription: [''],
    urlSlug: ['', Validators.required],
    keywords: [''],

    status: ['draft' as 'draft' | 'published' | 'out-of-stock' | 'archived'],
    featured: [false],
    bestSeller: [false],
  });

  variants = signal<{ id: string; size?: string; color?: string; material?: string; sku: string; price: number; stock: number }[]>([]);

  constructor() {
    if (this.productId) {
      // Fetched directly rather than read from the cached list, since this page
      // can be opened via a direct link before the product list has loaded.
      this.svc.getByIdAsync(this.productId).subscribe((product) => {
        this.form.reset({
          name: product.name,
          sku: product.sku,
          description: product.description,
          shortDescription: product.shortDescription,
          categoryId: product.categoryId,
          collectionIds: product.collectionIds,
          tags: product.tags.join(', '),
          price: product.price,
          salePrice: product.salePrice != null ? String(product.salePrice) : '',
          costPrice: product.costPrice,
          tax: product.tax,
          discount: product.discount,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
          availability: product.availability,
          allowBackorder: product.allowBackorder,
          variantSize: '',
          variantColor: '',
          variantMaterial: '',
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          urlSlug: product.urlSlug,
          keywords: product.keywords,
          status: product.status,
          featured: product.featured,
          bestSeller: product.bestSeller,
        });
        this.mainImage.set([{ url: product.mainImage, name: product.name }]);
        this.thumbnailImage.set([{ url: product.thumbnail, name: product.name }]);
        this.galleryImages.set(product.gallery.map((url, i) => ({ url, name: `${product.name} ${i + 1}` })));
        this.variants.set(product.variants);
      });
    }
  }

  toggleCollection(id: string): void {
    const control = this.form.controls.collectionIds;
    const current = control.value;
    control.setValue(current.includes(id) ? current.filter((c) => c !== id) : [...current, id]);
  }

  isCollectionSelected(id: string): boolean {
    return this.form.controls.collectionIds.value.includes(id);
  }

  addVariant(): void {
    const raw = this.form.getRawValue();
    if (!raw.variantSize && !raw.variantColor && !raw.variantMaterial) {
      this.toast.error('Enter at least a size, color, or material for the variant.');
      return;
    }
    const sku = `${raw.sku || 'SKU'}-${raw.variantSize || ''}${raw.variantColor ? '-' + raw.variantColor.slice(0, 3).toUpperCase() : ''}`;
    this.variants.update((list) => [...list, {
      id: `var-${Date.now()}`,
      size: raw.variantSize || undefined,
      color: raw.variantColor || undefined,
      material: raw.variantMaterial || undefined,
      sku,
      price: Number(raw.price) || 0,
      stock: 10,
    }]);
    this.form.patchValue({ variantSize: '', variantColor: '', variantMaterial: '' });
  }

  removeVariant(id: string): void {
    this.variants.update((list) => list.filter((v) => v.id !== id));
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fill in all required fields.');
      return;
    }
    const raw = this.form.getRawValue();
    const slug = raw.urlSlug || raw.name.toLowerCase().replace(/\s+/g, '-');

    const payload = {
      name: raw.name,
      sku: raw.sku,
      description: raw.description,
      shortDescription: raw.shortDescription,
      brandId: null,
      categoryId: raw.categoryId,
      collectionIds: raw.collectionIds,
      tags: raw.tags.split(',').map((t) => t.trim()).filter(Boolean),
      price: Number(raw.price),
      salePrice: raw.salePrice === '' ? null : Number(raw.salePrice),
      costPrice: Number(raw.costPrice),
      tax: Number(raw.tax),
      discount: Number(raw.discount),
      stock: Number(raw.stock),
      lowStockThreshold: Number(raw.lowStockThreshold),
      availability: raw.availability,
      allowBackorder: raw.allowBackorder,
      mainImage: this.mainImage()[0]?.url ?? placeholderImage(slug, 700, 900),
      thumbnail: this.thumbnailImage()[0]?.url ?? this.mainImage()[0]?.url ?? placeholderImage(slug + '-thumb', 200, 200),
      gallery: this.galleryImages().map((g) => g.url),
      variants: this.variants(),
      metaTitle: raw.metaTitle,
      metaDescription: raw.metaDescription,
      urlSlug: slug,
      keywords: raw.keywords,
      status: raw.status,
      featured: raw.featured,
      bestSeller: raw.bestSeller,
    };

    if (this.productId) {
      this.svc.update(this.productId, payload).subscribe(() => {
        this.toast.success('Product updated.');
        this.router.navigate(['/products']);
      });
    } else {
      this.svc.create({
        ...payload,
        unitsSold: 0,
        revenue: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      }).subscribe(() => {
        this.toast.success('Product created.');
        this.router.navigate(['/products']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}

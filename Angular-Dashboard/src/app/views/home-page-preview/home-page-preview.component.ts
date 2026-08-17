import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroService } from '../home-page/hero/hero.service';
import { HomeCategoryService } from '../home-page/categories/home-category.service';
import { HomeCollectionService } from '../home-page/collections/home-collection.service';
import { BestSellerService } from '../home-page/best-sellers/best-seller.service';
import { HomePromotionService } from '../home-page/promotions/home-promotion.service';
import { TestimonialService } from '../home-page/testimonials/testimonial.service';
import { CommunityService } from '../home-page/community/community.service';
import { NewsletterService } from '../home-page/newsletter/newsletter.service';
import { getCategoryById } from '../../core/mock-data/categories.mock';
import { getCollectionById } from '../../core/mock-data/collections.mock';
import { getProductById } from '../../core/mock-data/products.mock';

@Component({
  selector: 'app-home-page-preview',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './home-page-preview.component.html',
  styleUrl: './home-page-preview.component.scss',
})
export class HomePagePreviewComponent {
  private readonly heroSvc = inject(HeroService);
  private readonly categorySvc = inject(HomeCategoryService);
  private readonly collectionSvc = inject(HomeCollectionService);
  private readonly bestSellerSvc = inject(BestSellerService);
  private readonly promoSvc = inject(HomePromotionService);
  private readonly testimonialSvc = inject(TestimonialService);
  private readonly communitySvc = inject(CommunityService);
  readonly newsletterSvc = inject(NewsletterService);

  get hero() {
    return [...this.heroSvc.all].filter((b) => b.status === 'active').sort((a, b) => a.displayOrder - b.displayOrder)[0];
  }

  get categories() {
    return [...this.categorySvc.all]
      .filter((f) => f.status === 'active')
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((f) => getCategoryById(f.categoryId))
      .filter((c) => !!c);
  }

  get collections() {
    return [...this.collectionSvc.all]
      .filter((f) => f.status === 'active')
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((f) => ({ feature: f, collection: getCollectionById(f.collectionId) }))
      .filter((x) => !!x.collection);
  }

  get bestSellers() {
    return [...this.bestSellerSvc.all]
      .filter((f) => f.status === 'active')
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((f) => getProductById(f.productId))
      .filter((p) => !!p);
  }

  get promotion() {
    return this.promoSvc.all.find((p) => p.status === 'active');
  }

  get testimonials() {
    return [...this.testimonialSvc.all]
      .filter((t) => t.status === 'approved')
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  get communityImages() {
    return [...this.communitySvc.all]
      .filter((c) => c.status === 'active')
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  stars(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}

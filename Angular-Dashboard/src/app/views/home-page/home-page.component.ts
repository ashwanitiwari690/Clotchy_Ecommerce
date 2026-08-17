import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { HeroService } from './hero/hero.service';
import { HomeCategoryService } from './categories/home-category.service';
import { HomeCollectionService } from './collections/home-collection.service';
import { BestSellerService } from './best-sellers/best-seller.service';
import { HomePromotionService } from './promotions/home-promotion.service';
import { TestimonialService } from './testimonials/testimonial.service';
import { CommunityService } from './community/community.service';
import { NewsletterService } from './newsletter/newsletter.service';

interface HomeSection {
  title: string;
  description: string;
  icon: string;
  link: string;
  count: number;
  activeCount: number;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SharedUIModule, RouterLink, IconDirective],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  private readonly hero = inject(HeroService);
  private readonly categories = inject(HomeCategoryService);
  private readonly collections = inject(HomeCollectionService);
  private readonly bestSellers = inject(BestSellerService);
  private readonly promotions = inject(HomePromotionService);
  private readonly testimonials = inject(TestimonialService);
  private readonly community = inject(CommunityService);
  private readonly newsletter = inject(NewsletterService);

  get sections(): HomeSection[] {
    return [
      { title: 'Hero Banner', description: 'Homepage hero slides and CTAs.', icon: 'cilImage', link: '/home-page/hero', count: this.hero.all.length, activeCount: this.hero.all.filter((b) => b.status === 'active').length },
      { title: 'Shop By Category', description: 'Categories featured on the homepage.', icon: 'cilBasket', link: '/home-page/categories', count: this.categories.all.length, activeCount: this.categories.all.filter((c) => c.status === 'active').length },
      { title: 'Explore Collections', description: 'Collections featured on the homepage.', icon: 'cilLayers', link: '/home-page/collections', count: this.collections.all.length, activeCount: this.collections.all.filter((c) => c.status === 'active').length },
      { title: 'Best Sellers', description: 'Products shown in the Best Sellers section.', icon: 'cilStar', link: '/home-page/best-sellers', count: this.bestSellers.all.length, activeCount: this.bestSellers.all.filter((b) => b.status === 'active').length },
      { title: 'Promotional Sections', description: 'Homepage promotional banners.', icon: 'cilGift', link: '/home-page/promotions', count: this.promotions.all.length, activeCount: this.promotions.all.filter((p) => p.status === 'active').length },
      { title: 'Testimonials', description: 'Customer testimonials and reviews.', icon: 'cilCommentSquare', link: '/home-page/testimonials', count: this.testimonials.all.length, activeCount: this.testimonials.all.filter((t) => t.status === 'approved').length },
      { title: 'Community Section', description: 'Clotchy community gallery images.', icon: 'cilGrid', link: '/home-page/community', count: this.community.all.length, activeCount: this.community.all.filter((c) => c.status === 'active').length },
      { title: 'Newsletter Section', description: 'Newsletter / Join Community CTA.', icon: 'cilEnvelopeClosed', link: '/home-page/newsletter', count: 1, activeCount: this.newsletter.value.status === 'active' ? 1 : 0 },
    ];
  }
}

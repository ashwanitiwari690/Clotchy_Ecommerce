import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  values = [
    { icon: '✦', title: 'Bold by Design', text: 'Every piece is built around a statement, not just a print.' },
    { icon: '◆', title: 'Premium Fabric', text: '100% combed cotton, tested for softness and durability.' },
    { icon: '⬡', title: 'Made in India', text: 'Designed, printed and stitched by local craftsmanship.' },
    { icon: '♻', title: 'Responsible Production', text: 'Small, considered batches over fast-fashion excess.' }
  ];
}

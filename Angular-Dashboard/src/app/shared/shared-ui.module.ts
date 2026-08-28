import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// CoreUI modal imports
import {
  ButtonDirective,
  ModalToggleDirective,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ButtonCloseDirective,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalModule
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import {PaginationComponent} from './components/pagination/pagination.component'
import {GlobalSearchComponent} from './components/global-search/global-search.component'
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { ChartCardComponent } from './components/chart-card/chart-card.component';
import { AppDatePipe } from './pipes/app-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonDirective,
    ModalToggleDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalModule,
    PaginationComponent,
    GlobalSearchComponent,
    StatusBadgeComponent,
    StatCardComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    ImageUploaderComponent,
    ChartCardComponent,
    AppDatePipe
  ],
  exports: [
    ButtonDirective,
    ModalToggleDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalModule,
    FormsModule,
    PaginationComponent,
    GlobalSearchComponent,
    StatusBadgeComponent,
    StatCardComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    ImageUploaderComponent,
    ChartCardComponent,
    AppDatePipe
  ]
})
export class SharedUIModule { }

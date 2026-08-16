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
    GlobalSearchComponent
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
    GlobalSearchComponent
  ]
})
export class SharedUIModule { }

import { Component } from '@angular/core';
import { KnowledgeService } from '../knowledge.service';
import { SharedUIModule } from '../../../shared/shared-ui.module';
@Component({
  selector: 'app-knowledge',
  imports: [SharedUIModule],
  templateUrl: './knowledge.component.html',
  styleUrl: './knowledge.component.scss',
})
export class KnowledgeComponent {
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  data = [
    { id: 1, class: 'Mark', col1: 'Otto', col2: '@mdo', col3: '@mdo' },
    { id: 2, class: 'Jacob', col1: 'Thornton', col2: '@fat', col3: '@fat' },
    { id: 3, class: 'Larry', col1: 'Bird', col2: '@twitter', col3: '@twitter' },
    // add more data
  ];
  constructor(private serv: KnowledgeService) { }

  ngOnInit(): void {
    this.totalItems = this.data.length;
    this.serv.getService().subscribe(res => {
      console.log('ssss', res)
    })
  }

onSearch(value: string) {
  console.log('Search:', value);
}

  loadData(page: number) {
    console.log('Page changed to:', page);
    this.currentPage = page;

    // this.service.getList(page).subscribe(res => {
    //   this.data = res.items;
    // });
  }
}

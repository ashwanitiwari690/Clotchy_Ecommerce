import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from './AppService.class';
import { FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";
import { environment } from '../../environments/environment';
import { ToastService } from '../layout/toasts/toast.service';
// declare var $: any; 
@Component({
  selector: 'basecomponent',
  template: '<div></div>'
})
export class AppComponentClass<T1, T2> implements OnInit {

  protected userid: any;
  // public displayedColumns: any[];
  public cdata: any;
  public cur_row: any;
  protected keyfield: number;
  // public state: boolean;
  protected amount: any;
  protected pkgselected: number;
  private debug = environment.production;
  // public tag_label: string;
  protected subscribe: Subscription = new Subscription;
  public dataSource: any = "";

  // @ViewChild(MatSort , null  ) protected sort: MatSort;
  // @ViewChild(MatPaginator , null) protected paginator: MatPaginator;

  constructor(protected data: AppService<any>, protected router: Router, public toastMessage: ToastService,
    protected fb?: FormBuilder,) {
    this.userid = sessionStorage.getItem('iduser');
    this.keyfield = -1;
    this.amount = null;
    this.pkgselected = -1;
  }

  ngOnInit() {

    // this.data.frm_label.subscribe(res => { this.tag_label = res; });
    // this.data.status.subscribe(res => { this.state = res; });
    this.loadDataSource();
  }

  loadDataSource() {
    this.data.getService().subscribe((res: any) => {
      this.debug_log(res);
      this.dataSource = res;
    },
    (err:any) => {
      console.log("Error", err)
    });
  }

  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onSubmit() {
    this.debug_log("Thanks for submitting! Data: " + JSON.stringify(this.cdata));
    this.debug_log("keyfield:::" + this.keyfield.toString());
    //  this.debug_log(''+this.keyfield+'');
    if (this.keyfield == -1) {
      this.data.saveService(JSON.stringify(this.cdata)).subscribe(
        (res:any) => {
          console.log('Save data ::', res)
          this.ngOnInit();
          // this.loadDataSource();
          this.data.changefrm(false);
          // this.data.changelabel("List Details");
          setTimeout(() => {
            this.alertMessage("Success Message", res.message);
          }, 3000)
          
        },
        (err:any) => {
          this.alertMessage("Error Message", err)
        }
      );
    }
    else {
      this.data.updateService(JSON.stringify(this.cdata), this.keyfield).subscribe((res:any) => {
        console.log('Update data ::', res)
        // this.loadDataSource();
        this.ngOnInit();
        this.data.changefrm(false);
        this.data.Data = null;
        // this.data.changelabel("List Details");
        setTimeout(() => {
          this.alertMessage("Success Message", res.message);
        }, 3000)
        // this.alertMessage("Success Message", res.message)
      },
        (err:any) => {
          this.alertMessage("Error Message", err)
        });
    }
  }

  Delete(id: number) {
    console.log("deleted row :" + JSON.stringify(id));
    this.data.deleteService(id).subscribe(
      (data:any) => {
        this.loadDataSource();
        setTimeout(() =>{
          this.alertMessagefordelete("Success Message", data.message)
        }, 3000)
      },
      (err:any) => {
        this.alertMessagefordelete("Error Message", err)
      }
    );
  }

  Edit(row: any) {
    this.data.changelabel("Edit Details");
    this.data.Data = row;
    this.data.changefrm(true);
  }

  alertMessage(action: any, message: any) {
    this.toastMessage.success(message)
  }

  alertMessagefordelete(action: any, message: any) {
    this.toastMessage.success(message)
  }

  debug_log(log: any) {
    console.log(log);
  }

  onDestroy() {
    this.data.frm_label.unsubscribe();
    this.subscribe.unsubscribe();
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

}
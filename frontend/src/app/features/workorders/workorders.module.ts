import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyJobsComponent } from './my-jobs.component';
import { WorkorderDetailComponent } from './workorder-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: MyJobsComponent },
      { path: ':id', component: WorkorderDetailComponent }
    ]),
    MyJobsComponent,
    WorkorderDetailComponent
  ]
})
export class WorkordersModule {}

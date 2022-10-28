import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarioPopoverPage } from './calendario-popover.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarioPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarioPopoverPageRoutingModule {}

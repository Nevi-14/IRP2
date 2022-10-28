import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarioPopoverPageRoutingModule } from './calendario-popover-routing.module';

import { CalendarioPopoverPage } from './calendario-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioPopoverPageRoutingModule
  ],
  declarations: [CalendarioPopoverPage]
})
export class CalendarioPopoverPageModule {}

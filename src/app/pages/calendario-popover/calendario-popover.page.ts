import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
@Component({
  selector: 'app-calendario-popover',
  templateUrl: './calendario-popover.page.html',
  styleUrls: ['./calendario-popover.page.scss'],
})
export class CalendarioPopoverPage implements OnInit {
  fecha = new Date().toISOString();;

  constructor(
    public popOverCtrl: PopoverController,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
console.log('test', this.fecha)

  }
  formatDate(value: any) {


    return this.popOverCtrl.dismiss({
      fecha:value
    })
  }
}

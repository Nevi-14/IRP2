import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';

@Component({
  selector: 'app-fecha',
  templateUrl: './fecha.page.html',
  styleUrls: ['./fecha.page.scss'],
})
export class FechaPage implements OnInit {
  fecha = new Date().toISOString();
  pickerOptions = {
    mode: 'md'
  };
  dateValue = format(new Date(), 'yyyy-MM-dd') + 'T00:00:00.000Z';
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  dateChanged($event){
    this.dateValue = $event.detail.value;

  
  
    console.log(this.dateValue, 'date value', $event.detail.value)
  }
  submit(){

    this.modalCtrl.dismiss({

      data:  this.dateValue
     });

  }

}

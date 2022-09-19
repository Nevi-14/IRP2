import { Component, Input, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { AppSettingsService } from 'src/app/services/app_settings.service';


@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent implements OnInit {
@Input()titulo;
fecha = new Date().toLocaleDateString();
  constructor(
    public menuCtrl: MenuController,
    private plt:Platform,
    public appSettingService: AppSettingsService
    
      ) {}

  ngOnInit() {}
  toggle(){
 this.appSettingService.menu = !this.appSettingService.menu ;
    this.menuCtrl.toggle('myMenu');
  
  }
}

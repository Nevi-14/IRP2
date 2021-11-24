import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './encabezados/header.component';
import { MiniMapaComponent } from './mini-mapa/mini-mapa.component';
import { MapaComponent } from './mapa/mapa.component';



@NgModule({
  declarations: [HeaderComponent,MiniMapaComponent,MapaComponent],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,MiniMapaComponent,MapaComponent

  ]
})
export class ComponentsModule { }

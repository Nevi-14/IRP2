import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FiltroPipe } from './filtro.pipe';
import { ColonesPipe } from './colones.pipe';


@NgModule({
  declarations: [
    FiltroPipe,
    ColonesPipe
    
  ],
  imports: [
    CommonModule
  ],
  exports:[
   
    FiltroPipe,
    DatePipe,
    ColonesPipe
  ]
})
export class PipesModule { }

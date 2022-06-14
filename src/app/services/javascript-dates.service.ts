import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JavascriptDatesService {

  constructor() { }

  
 // FUNCION RETORNA FORMATO FECHA
 // EL PARAMETRP DATE HACE REFERENCIA A LA FECHA Y EL MODE SE REFIRE AL FORMATO A DEVOLVER  >  2022-02-08  O 2022/02/08
retornaFormatoFecha(date,mode){

  let currentDate= date.getDate();  // OBTIENE EL DIA ACTUAL DE LA FECHA A RETORNAR

  currentDate = ("0" + currentDate).slice(-2); // DEVUELCE EL DIA ACTUAL CON UN FORMATO DE 2 DIGITOS

  let currentMonth= date.getMonth()+1;  // SE OBTIENE EL MES ACTUAL PERO EN JAVASCRIPT LOS MESES INICIAN EN 0 ENTONCES SE LE SUMA 1

  currentMonth = ("0" + currentMonth).slice(-2); // CONVIERTE EL NUMERO DE MES EN UN FORMATO DE 2 DIGITOS

  let  currentYear = date.getFullYear(); // OBTIENE EL AÑO ACTUAL

  let dateValue = ''; // CREAMOS LA   VARIABLE QUE DEVOLVERA EL VALOR DESEADO

  switch(mode){

    case '-':
       // 2022-02-08
      dateValue = currentYear +'-'+currentMonth+'-'+currentDate

      break;

      case '/':
         // 2022/02/08
        dateValue = currentYear +'/'+currentMonth+'/'+currentDate

      break;

      default:

        return null
  }

  return dateValue;
 
}






retornaHoraAmPm(date){

//09:00:00 AM - PM
let hours = date.getHours();
let minutes = date.getMinutes();
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'
hours = hours < 10 ? '0' + hours : hours;
// appending zero in the start if hours less than 10
minutes = minutes < 10 ? '0' + minutes : minutes;

let hourValue = hours +':'+'00'+':'+'00'+' ' + ampm;

return hourValue;

}



}

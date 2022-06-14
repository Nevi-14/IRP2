import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginToggle = false;
  verified = false;
  loginText = 'Iniciar Sección';
  show = false;
  color = 'light';
  constructor() { }
}

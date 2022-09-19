import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  menu = false;
  isLoading = false;
  loading: HTMLIonLoadingElement ;
  elementos =[]



  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl:ModalController
  ) { }








}

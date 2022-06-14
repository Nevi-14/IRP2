export class GuiaEntrega{
    constructor(
       public idGuia: string,
        public fecha: Date,
        public zona: string,
        public ruta: string,
        public idCamion: string,
        public numClientes: number,
        public peso: number,
        public estado: string,
        public HH: string,
        public volumen: number
 
    ){}
}

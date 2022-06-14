export class ConsultaGuias{
    constructor(
       public idGuia: string,
        public idcliente: number,
        public nombre: string,
        public direccion: string,
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

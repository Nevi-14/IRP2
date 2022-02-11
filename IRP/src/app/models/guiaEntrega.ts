export class GuiaEntrega{
    constructor(
       public idGuia: string,
       public chofer:string,
        public fecha: Date,
        public zona: string,
        public ruta: string,
        public idCamion: string,
        public numClientes: number,
        public capacidad: number,
        public pesoRestante: number,
        public peso: number,
        public estado: string,
        public HH: string,
        public volumen: number,
        public facturas: []
    ){}
}

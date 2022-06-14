export class Camiones{
    constructor(
       public idCamion: string,
        public descripcion: string,
        public marca: string,
        public modelo: string,
        public propietario: string,
        public capacidadPeso: number,
        public capacidadVolumen: number,
        public activo: number,
        public frio: string,
        public seco: string,
        public chofer: string,

    ){}
}

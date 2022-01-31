export class Camiones{
    constructor(
       public idCamion: number,
        public descripcion: string,
        public marca: string,
        public modelo: string,
        public propietario: string,
        public capacidadPeso: number,
        public capacidadVolumen: number,
        public activo: number,
        public frio: number,
        public seco: number,
        public chofer: number,

    ){}
}

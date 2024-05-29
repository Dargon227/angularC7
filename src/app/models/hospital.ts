export class Hospital {
    id: number;
    nombre: string;
    direccion: string;
  
    constructor(id: number, nombre: string, direccion: string) {
      this.id = id;
      this.nombre = nombre;
      this.direccion = '';
    }
  }
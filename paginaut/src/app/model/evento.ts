export interface Evento {
    id?: number;
    titulo: string;
    informacion_evento: string;
    tipo: string;
    lugar_evento: string;
    fecha_inicio: string;
    fecha_fin: string;
    hora_inicio: string;
    hora_fin: string;
    activo: boolean;
  }
import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import * as FullCalendar from '@fullcalendar/core';
import { EventoService, Evento } from '../../evento.service';

@Component({
  selector: 'app-agenda-admin',
  templateUrl: './agenda-admin.component.html',
  styleUrl: './agenda-admin.component.css'
})
export class AgendaAdminComponent implements OnInit {

  eventos: Evento[] = [];
  selectedEvent: any = null;
  baseImageUrl = 'http://localhost/paginaut/';

  renderEventContent = (eventInfo: any) => {
    const backgroundColor = eventInfo.event.backgroundColor || '#043D3D' ; // Color por defecto de FullCalendar
    return { 
      html: `
        <div class="text-white pl-4 rounded-lg bg-[${backgroundColor}]">
          <b>${eventInfo.timeText}</b>
          <i>${eventInfo.event.title}</i>
          
        </div>
      `
    };
  }

  handleEventClick = (clickInfo: any) => {
    this.selectedEvent = {
      title: clickInfo.event.title,
      informacion_evento: clickInfo.event.extendedProps.informacion,
      lugar_evento: clickInfo.event.extendedProps.lugar,
      fecha_inicio: clickInfo.event.extendedProps.fecha_inicio,
      fecha_fin: clickInfo.event.extendedProps.fecha_fin,
      hora_inicio: clickInfo.event.extendedProps.hora_inicio,
      hora_fin: clickInfo.event.extendedProps.hora_fin,
      imagen_principal: clickInfo.event.extendedProps.imagen_principal,
      imagenes_generales: clickInfo.event.extendedProps.imagenes_generales
    };
    this.openModal();
  }

  openModal(): void {
    const modal = document.getElementById('hs-slide-down-animation-modal');
    const closeButton = document.getElementById('close-modal-button');
    //console.log("Intentando abrir modal");
    if (modal && closeButton) {
      modal.classList.remove('hidden');
      modal.classList.add('hs-overlay-open', 'opacity-100', 'duration-500');
      modal.classList.remove('opacity-0', 'ease-out');
      closeButton.click();  // Simula un clic en el botón que abre el modal
      //console.log("Modal abierto");
    } else {
      //console.error("No se pudo encontrar el modal o el botón de cierre");
    }
  }

  closeModal(): void {
    const modal = document.getElementById('hs-slide-down-animation-modal');
    //console.log("Cerrando modal");
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('hs-overlay-open', 'opacity-100', 'duration-500');
      modal.classList.add('opacity-0', 'ease-out');
      //console.log("Modal cerrado");
    }
  }

  calendarOptions: FullCalendar.CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    events: [], // Se actualizará dinámicamente
    eventContent: this.renderEventContent,
    eventClick: this.handleEventClick
  };

  constructor(private eventoService: EventoService) { }

  ngOnInit() {
    this.loadEventos();
  }

  loadEventos(): void {
    this.eventoService.obtenerEventos().subscribe({
      next: (response) => {
        this.eventos = response.records;
        console.log(this.eventos);
        this.updateCalendarEvents();
      },
      error: (error) => console.error('Error al cargar eventos:', error)
    });
  }

  updateCalendarEvents(): void {
    const eventsByDay: { [key: string]: any[] } = {};
    
    const calendarEvents = this.eventos.map(evento => {
      const startDate = evento.fecha_inicio.split(' ')[0]; // Extrae solo la fecha
      const EndDate = evento.fecha_fin.split(' ')[0];

      if (!eventsByDay[startDate]) {
        eventsByDay[startDate] = [];
      }
      if (!eventsByDay[EndDate]) {
        eventsByDay[EndDate] = [];
      }
      eventsByDay[startDate].push(evento);
    
      return {
        title: evento.titulo,
        start: `${startDate}T${evento.hora_inicio}`,
        end: `${evento.fecha_fin.split(' ')[0]}T${evento.hora_fin}`,
        extendedProps: {
          informacion: evento.informacion_evento,
          lugar: evento.lugar_evento,
          fecha_inicio: startDate, // Asigna solo la fecha aquí
          fecha_fin: EndDate,
          hora_inicio: evento.hora_inicio,
          hora_fin: evento.hora_fin,
          imagen_principal: this.baseImageUrl+evento.imagen_principal,
          imagenes_generales: evento.imagenes_generales
        }
      };
    });
    
    this.calendarOptions.events = calendarEvents;
  }
}
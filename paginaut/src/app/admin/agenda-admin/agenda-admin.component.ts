import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import * as FullCalendar from '@fullcalendar/core';
import { EventoService, Evento } from '../../evento.service';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-agenda-admin',
  templateUrl: './agenda-admin.component.html',
  styleUrls: ['./agenda-admin.component.css']
})
export class AgendaAdminComponent implements OnInit {

  eventos: Evento[] = [];
  selectedEvent: any = null;
  baseImageUrl = 'http://localhost/paginaut/';

  // Define an array of colors
  colors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7B32B', '#00A4E4', '#F25F5C', '#3F8EFC', '#C1C8E4', '#C4E17F'];

  renderEventContent = (eventInfo: any) => {
    const backgroundColor = eventInfo.event.backgroundColor || '#043D3D'; // Default background color
    return { 
      html: `
        <div class="text-white pl-2" style="background-color: ${backgroundColor}; border-radius: 5px">
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
    if (modal && closeButton) {
      modal.classList.remove('hidden');
      modal.classList.add('hs-overlay-open', 'opacity-100', 'duration-500');
      modal.classList.remove('opacity-0', 'ease-out');
      closeButton.click();  // Simulates a click on the button that opens the modal
    }
  }

  closeModal(): void {
    const modal = document.getElementById('hs-slide-down-animation-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('hs-overlay-open', 'opacity-100', 'duration-500');
      modal.classList.add('opacity-0', 'ease-out');
    }
  }

  calendarOptions: FullCalendar.CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [], // Will be updated dynamically
    datesSet: this.handleDatesSet.bind(this), // Calls handleDatesSet when dates are updated
    eventContent: this.renderEventContent,
    eventClick: this.handleEventClick,
    titleFormat: { year: 'numeric', month: 'short' } // Basic title format
  };
  
  handleDatesSet(args: any) {
    const titleElement = document.querySelector('.fc-toolbar-title');
    if (titleElement) {
      // Replace "De" with "de"
      titleElement.textContent = titleElement.textContent?.replace('De', 'de') || '';
      titleElement.classList.add('capitalize'); // Optional: If you need the month to start with a capital letter
    }
  }
  

  constructor(private eventoService: EventoService) { }

  ngOnInit() {
    this.loadEventos();
  }

  loadEventos(): void {
    this.eventoService.obtenerEventos().subscribe({
      next: (response) => {
        this.eventos = response.records;
        this.updateCalendarEvents();
      }
    });
  }

  updateCalendarEvents(): void {
    const calendarEvents = this.eventos.map((evento, index) => {
      const startDate = evento.fecha_inicio.split(' ')[0];
      const endDate = evento.fecha_fin.split(' ')[0];

      // Assign a color from the array cyclically
      const colorIndex = index % this.colors.length;
      const backgroundColor = this.colors[colorIndex];

      return {
        title: evento.titulo,
        start: `${startDate}T${evento.hora_inicio}`,
        end: `${endDate}T${evento.hora_fin}`,
        backgroundColor: backgroundColor, // Set the background color here
        extendedProps: {
          informacion: evento.informacion_evento,
          lugar: evento.lugar_evento,
          fecha_inicio: startDate,
          fecha_fin: endDate,
          hora_inicio: evento.hora_inicio,
          hora_fin: evento.hora_fin,
          imagen_principal: this.baseImageUrl + evento.imagen_principal,
          imagenes_generales: evento.imagenes_generales
        }
      };
    });
    
    this.calendarOptions.events = calendarEvents;
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  template: `
    <div class="flex justify-center items-center h-full">
      <p class="text-red-500">El archivo no se encuentra disponible.</p>
    </div>
  `,
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}

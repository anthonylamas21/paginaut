import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
}) 
export class AppComponent implements  AfterViewInit {
   title = 'paginaut';
   ngAfterViewInit() {
    this.initNavbarMenu();
  }

  initNavbarMenu() {
    const burger = document.querySelector('.navbar-burger') as HTMLElement;
    const menu = document.querySelector('.navbar-menu') as HTMLElement;

    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      menu.classList.toggle('hidden');
    });
  }
}
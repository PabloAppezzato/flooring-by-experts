import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'fbe-my-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 20px;">
      <h2>Mis trabajos</h2>
      <div *ngFor="let job of jobs" style="border: 1px solid #ddd; padding: 12px; margin: 10px; border-radius: 8px;">
        <h3>{{ job.project.name }}</h3>
        <p><strong>Dirección:</strong>
          <a [href]="mapLink(job.project.siteAddress)" target="_blank">
            {{ job.project.siteAddress }}
          </a>
        </p>
        <p><strong>Contacto:</strong> {{ job.project.siteContact }}</p>
        <p><strong>Estado:</strong> {{ job.status }}</p>
        <a [routerLink]="['/workorders', job.id]" style="cursor: pointer; color: blue; text-decoration: underline;">
          Abrir
        </a>
      </div>
    </div>
  `
})
export class MyJobsComponent implements OnInit {
  jobs: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:4000/api/workorders/my')
      .subscribe(
        jobs => this.jobs = jobs,
        error => console.error('Error loading jobs', error)
      );
  }

  mapLink(addr?: string): string {
    if (!addr) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
  }
}

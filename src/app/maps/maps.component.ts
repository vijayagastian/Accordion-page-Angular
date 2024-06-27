import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent 

  implements OnInit {
    private map!: L.Map;
    private centroid: L.LatLngExpression = [13.0827, 80.2707]; // Define the coordinates for the marker
    
    private initMap(): void {
      this.map = L.map('map', {
        center: this.centroid,
        zoom: 12
      });
    
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 10,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
    
      // Create a single marker and add it to the map
      const marker = L.marker(this.centroid);
      marker.addTo(this.map);
    
      tiles.addTo(this.map);
    }
    
    constructor() { }
    
    ngOnInit(): void {
      this.initMap();
    }
  }
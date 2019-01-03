import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public eventEmit:any;
  constructor() { 
    this.eventEmit = new EventEmitter();
  }
}

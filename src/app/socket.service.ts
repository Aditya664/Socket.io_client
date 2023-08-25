import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;
  private data:any;
  private url = 'https://darling-douhua-369796.netlify.app'; 

  constructor() {
    this.socket = io(this.url);
  }

  sendDrawing(data: any) {
    this.data = data
    this.socket.emit('drawing', data);
  }

  getDrawing(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('drawing', (data: any) => {
        observer.next(data);
      });
    });
  }
}

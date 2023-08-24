import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing-component.component.html',
  styleUrls: ['./drawing-component.component.css'],
})
export class DrawingComponent implements OnInit,OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild('colorPicker', { static: true }) colorPicker!: ElementRef<HTMLInputElement>;
  private context!: CanvasRenderingContext2D;
  subscription = new Subscription()

  private drawing = false;
  private lastX = 0;
  private lastY = 0;
  private currentColor = 'black';

  constructor(private socketService: SocketService,private router:Router) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width  = 400;
    this.canvas.nativeElement.height  = 400
    this.subscription.add(
    this.socketService.getDrawing().subscribe((data: any) => {
      console.log(data)
      this.drawOnCanvas(data);
    })
    );
  }


  onShow(){
    this.router.navigate(['show'])
  }

  private drawOnCanvas(data: any): void {
    const { x, y, type, color } = data;

    if (type === 'start') {
      this.context.beginPath();
      this.context.moveTo(x, y);
    } else if (type === 'move') {
      this.context.lineTo(x, y);
      this.context.strokeStyle = color;
      this.context.lineWidth = 2;
      this.context.stroke();
    } else {
      this.context.closePath();
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.drawing = true;
    this.lastX = event.clientX - this.canvas.nativeElement.offsetLeft;
    this.lastY = event.clientY - this.canvas.nativeElement.offsetTop;
this.subscription.add(
    this.socketService.sendDrawing({
      x: this.lastX,
      y: this.lastY,
      type: 'start',
      color: this.currentColor,
    }))

    this.subscription.add(
    this.drawOnCanvas({
      x: this.lastX,
      y: this.lastY,
      type: 'start',
      color: this.currentColor,
    }))
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.drawing) return;

    const currentX = event.clientX - this.canvas.nativeElement.offsetLeft;
    const currentY = event.clientY - this.canvas.nativeElement.offsetTop;

    this.drawOnCanvas({
      x: currentX,
      y: currentY,
      type: 'move',
      color: this.currentColor,
    });

    this.subscription.add(
    this.socketService.sendDrawing({
      x: currentX,
      y: currentY,
      type: 'move',
      color: this.currentColor,
    }))

    this.lastX = currentX;
    this.lastY = currentY;
  }

 

  onColorChange(): void {
    this.currentColor = this.colorPicker.nativeElement.value;
  }
}

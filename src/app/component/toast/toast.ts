import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent implements OnInit {
  toasts$: any;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toasts$ = this.getToasts();
  }

  getToasts() {
    return this.toastService.getToasts();
  }

  closeToast(id: string) {
    this.toastService.remove(id);
  }
}

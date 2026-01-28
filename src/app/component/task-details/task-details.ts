import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { Task } from '../../models/task-manager.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css'
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  task: Task | null = null;
  comments: any[] = [];
  newCommentText: string = '';
  isLoading = false;
  isEditing = false;
  editTitle = '';
  editDescription = '';
  editStatus = 'Backlog';
  editPriority = 'low';
  isSaving = false;
  isDarkMode = false;
  private destroy$ = new Subject<void>();

  constructor(
    private tasksService: TasksService, 
    private router: Router,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkMode();
    this.darkModeService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
      });
    this.task = this.tasksService.getTask();
    if (!this.task) {
      this.router.navigate(['/projects']);
      return;
    }
    this.loadComments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadComments(): void {
    if (this.task?.id) {
      this.tasksService.getComments(this.task.id).subscribe(data => this.comments = data);
    }
  }

  addComment(): void {
    if (!this.newCommentText.trim() || !this.task?.id) return;
    this.tasksService.addComment(this.task.id, this.newCommentText).subscribe(comment => {
      this.comments.push(comment);
      this.newCommentText = '';
    });
  }

  startEdit(): void {
    if (!this.task) return;
    this.editTitle = this.task.title || '';
    this.editDescription = this.task.description || '';
    this.editStatus = this.task.status || 'Backlog';
    this.editPriority = this.task.priority || 'low';
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    if (!this.task?.id || !this.editTitle.trim()) return;
    
    this.isSaving = true;
    const updatedTask: Partial<Task> = {
      title: this.editTitle,
      description: this.editDescription,
      status: this.editStatus as "Backlog" | "In Progress" | "Done",
      priority: this.editPriority as "low" | "medium" | "high"
    };

    this.tasksService.updateTask(this.task.id, updatedTask).subscribe(
      (result) => {
        this.task = result;
        this.isEditing = false;
        this.isSaving = false;
      },
      (error) => {
        console.error('Error saving task:', error);
        this.isSaving = false;
      }
    );
  }

  goBack(): void {
    window.history.back();
  }

  getStatusClass(): string {
    if (!this.task?.status) return 'status-Backlog';
    return 'status-' + this.task.status.replace(/ /g, '-');
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}
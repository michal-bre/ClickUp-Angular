import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../services/tasks.service';
import { ToastService } from '../../services/toast.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { Task } from '../../models/task-manager.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent implements OnInit, OnDestroy {
  projectId: string = '';
  tasks: Task[] = [];
  isLoading: boolean = true;
  isAddingTask: boolean = false;
  editingTaskId: string | undefined = undefined;
  showDeleteConfirm: boolean = false;
  deleteTaskId: string | undefined = undefined;
  isDarkMode: boolean = false;
  private destroy$ = new Subject<void>();

  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'Backlog',
    priority: 'low'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService,
    private toastService: ToastService,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkMode();
    this.darkModeService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
      });
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId') || '';
      if (this.projectId) {
        this.loadTasks();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.tasksService.getTasksByProject(this.projectId).subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  viewDetails(task: Task): void {
    this.tasksService.setTask(task);
    this.router.navigate(['/task-details']);
  }

  toggleAddForm(): void {
    this.isAddingTask = !this.isAddingTask;
    if (!this.isAddingTask) {
      this.newTask = { title: '', description: '', status: 'Backlog', priority: 'low' };
    }
  }

  addTask(): void {
    if (!this.newTask.title?.trim()) {
      this.toastService.warning('Please enter a task title');
      return;
    }
    const taskToSave = { 
      ...this.newTask, 
      projectId: this.projectId 
    };
    this.tasksService.createTask(taskToSave).subscribe({
      next: (createdTask: Task) => {
        this.tasks.push(createdTask);
        this.toastService.success('Task created successfully');
        this.newTask = { title: '', description: '', status: 'Backlog', priority: 'low' };
        this.isAddingTask = false; 
      },
      error: (err) => {
        this.toastService.error('Failed to create task: ' + (err.error?.error || err.error?.message || 'Unknown error'));
      }
    });
  }

  startEdit(task: Task): void {
    this.editingTaskId = task.id;
  }

  saveEdit(task: Task): void {
    if (!task.id) return;
    this.tasksService.updateTask(task.id, task).subscribe({
      next: () => {
        this.editingTaskId = undefined;
        this.toastService.success('Task updated successfully');
      },
      error: () => {
        this.toastService.error('Failed to update task');
        this.loadTasks();
      }
    });
  }

  cancelEdit(): void {
    this.editingTaskId = undefined;
    this.loadTasks();
  }

  deleteTask(taskId: string | undefined): void {
    if (!taskId) return;
    this.deleteTaskId = taskId;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (!this.deleteTaskId) return;
    this.tasksService.deleteTask(this.deleteTaskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== this.deleteTaskId);
        this.toastService.success('Task deleted successfully');
        this.showDeleteConfirm = false;
        this.deleteTaskId = undefined;
      },
      error: () => {
        this.toastService.error('Failed to delete task');
        this.showDeleteConfirm = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deleteTaskId = undefined;
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  startQuickAdd(status: 'Backlog' | 'In Progress' | 'Done'): void {
    this.newTask = { title: '', description: '', status, priority: 'low' };
    this.isAddingTask = true;
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}
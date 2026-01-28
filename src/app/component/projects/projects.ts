import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/projects.service';
import { TeamsService } from '../../services/teams.services';
import { ToastService } from '../../services/toast.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { Team } from '../../models/task-manager.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  allProjects: any[] = [];
  filteredProjects: any[] = [];
  teams: Team[] = [];
  selectedTeamId: string = ''; 
  isLoading = true;
  isDarkMode = false;
  private destroy$ = new Subject<void>();

  showCreateProjectModal = false;
  newProjectName = '';
  isCreatingProject = false;
  modalTeamId: string = '';

  constructor(
    private projectsService: ProjectService,
    private teamsService: TeamsService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit() {
    this.isDarkMode = this.darkModeService.isDarkMode();
    this.darkModeService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
      });
    
    // Listen to route changes
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const teamId = params.get('teamId');
      this.selectedTeamId = teamId || '';
      this.loadInitialData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialData() {
    this.teamsService.getTeams().subscribe(teams => this.teams = teams);

    this.projectsService.getProjects().subscribe({
      next: (projects) => {
        this.allProjects = projects.map(p => ({
          ...p,
          teamId: p.teamId || p.team_id
        }));
        
        const teamIdFromUrl = this.route.snapshot.paramMap.get('teamId');

        if (teamIdFromUrl) {
          this.selectedTeamId = teamIdFromUrl;
          this.applyFilter(teamIdFromUrl);
        } else {
          this.filteredProjects = this.allProjects;
        }
        
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  applyFilter(teamId: string) {
    if (!teamId) {
      this.filteredProjects = this.allProjects;
    } else {
      this.filteredProjects = this.allProjects.filter(p => String(p.teamId) === teamId);
    }
  }

  onFilterChange() {
    this.applyFilter(this.selectedTeamId);
    if (this.selectedTeamId) {
      this.router.navigate(['/projects', this.selectedTeamId]);
    } else {
      this.router.navigate(['/projects']);
    }
  }

  goToTasks(projectId: string | undefined) {
    if (!projectId) {
      this.toastService.error('Project ID is missing');
      return;
    }
    this.router.navigate(['/tasks', projectId]);
  }

  openCreateProjectModal() {
    this.modalTeamId = this.selectedTeamId || '';
    this.showCreateProjectModal = true;
    this.newProjectName = '';
  }

  createProject() {
    if (!this.newProjectName.trim() || !this.modalTeamId) {
      this.toastService.warning('Please select a team first');
      return;
    }

    this.isCreatingProject = true;
    const projectData = {
      name: this.newProjectName,
      teamId: this.modalTeamId
    };

    this.projectsService.createProject(projectData).subscribe({
      next: (newProject: any) => {
        this.isCreatingProject = false;
        newProject.teamId = newProject.teamId || newProject.team_id || this.modalTeamId;
        this.allProjects.push(newProject);
        if (String(newProject.teamId) === this.selectedTeamId) {
          this.filteredProjects.push(newProject);
        }
        this.toastService.success('Project created successfully');
        this.closeCreateProjectModal();
      },
      error: (err) => {
        this.isCreatingProject = false;
        this.toastService.error('Failed to create project: ' + (err.error?.error || err.error?.message || 'Unknown error'));
      }
    });
  }

  closeCreateProjectModal() {
    this.showCreateProjectModal = false;
    this.newProjectName = '';
    this.modalTeamId = '';
  }

  getSelectedTeamName(): string {
    if (!this.selectedTeamId) return '';
    const team = this.teams.find(t => (t.id || t._id) === this.selectedTeamId);
    return team?.name || '';
  }

  getModalTeamName(): string {
    if (!this.modalTeamId) return '';
    const team = this.teams.find(t => (t.id || t._id) === this.modalTeamId);
    return team?.name || '';
  }

  getTeamNameForProject(teamId: string): string {
    const team = this.teams.find(t => (t.id || t._id) === teamId);
    return team?.name || 'Unknown Team';
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}

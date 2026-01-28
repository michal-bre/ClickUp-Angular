import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { TeamsService } from '../../services/teams.services';
import { ToastService } from '../../services/toast.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { Team } from '../../models/task-manager.models';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './teams.html',
  styleUrl: './teams.css'
})
export class TeamsComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  isLoading = true;
  isDarkMode = false;
  private destroy$ = new Subject<void>();
  
  showCreateModal = false;
  newTeamName = '';
  
  showAddMemberModal = false;
  selectedTeamId: string | null = null;
  memberUserId = '';
  isAddingMember = false;

  constructor(
    private teamsService: TeamsService,
    private toastService: ToastService,
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
    this.loadTeams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

   toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  loadTeams() {
    this.teamsService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) this.router.navigate(['/login']);
        else this.toastService.error('Failed to load teams');
      }
    });
  }

  onCreateTeam() {
    if (!this.newTeamName.trim()) {
      this.toastService.warning('Please enter a team name');
      return;
    }

    this.teamsService.createTeam({ name: this.newTeamName }).subscribe({
      next: (newTeam) => {
        this.teams.push(newTeam); 
        this.toastService.success('Team created successfully');
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Failed to create team: ' + (err.error?.error || err.error?.message || 'Unknown error'));
      }
    });
  }

  closeModal() {
    this.showCreateModal = false;
    this.newTeamName = '';
  }

  viewProject(teamId: string) {
    this.router.navigate(['/projects', teamId]);
  }

  openAddMemberModal(teamId: string) {
    this.selectedTeamId = teamId;
    this.showAddMemberModal = true;
    this.memberUserId = '';
  }

  addMember() {
    if (!this.selectedTeamId || !this.memberUserId.trim()) {
      this.toastService.warning('Please enter a user ID');
      return;
    }

    // Check if member already exists in the team
    const team = this.teams.find(t => (t.id || t._id) === this.selectedTeamId);
    if (team && team.members) {
      const memberExists = team.members.some(m => 
        (m.id || m._id) === this.memberUserId || 
        m.email === this.memberUserId
      );
      if (memberExists) {
        this.toastService.warning('This member is already in the team');
        return;
      }
    }

    this.isAddingMember = true;
    this.teamsService.addMemberToTeam(this.selectedTeamId, this.memberUserId).subscribe({
      next: () => {
        this.isAddingMember = false;
        this.toastService.success('Member added successfully');
        this.closeAddMemberModal();
        this.loadTeams();
      },
      error: (err) => {
        this.isAddingMember = false;
        const errorMsg = err.error?.error || err.error?.message || 'Unknown error';
        
        // Check if error is about member already existing
        if (errorMsg.toLowerCase().includes('already') || 
            errorMsg.toLowerCase().includes('exists') ||
            errorMsg.toLowerCase().includes('duplicate')) {
          this.toastService.warning('This member is already in the team');
        } else {
          this.toastService.error('Failed to add member: ' + errorMsg);
        }
      }
    });
  }

  closeAddMemberModal() {
    this.showAddMemberModal = false;
    this.selectedTeamId = null;
    this.memberUserId = '';
  }
}


import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';

import { addIcons } from 'ionicons';
import {
  homeOutline,
  personCircleOutline,
  createOutline,
  chatbubbleEllipsesOutline,
  logInOutline, 
  logOutOutline, 
  personOutline, 
  gridOutline,
  trashOutline,
  schoolOutline,
  peopleOutline,
  ellipsisVerticalOutline,
  imageOutline,
  star,
  starOutline
} from 'ionicons/icons';

interface User {
  id: number;
  rut: string;
  realName: string;
  username: string;
  email: string;
  role: number;
  subscription?: boolean;
  image?: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  tutorTitle: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})

export class DashboardPage implements OnInit {

  constructor(private alertCtrl: AlertController,
              private router: Router,
              private dashboardService: DashboardService) {
    addIcons({
      'home-outline': homeOutline,
      'person-circle-outline': personCircleOutline,
      'create-outline': createOutline,
      'chatbubble-ellipses-outline': chatbubbleEllipsesOutline,
      'log-in-outline': logInOutline,
      'log-out-outline': logOutOutline,
      'person-outline': personOutline,
      'grid-outline': gridOutline,
      'trash-outline': trashOutline,
      'school-outline': schoolOutline,
      'people-outline': peopleOutline,
      'ellipsis-vertical-outline': ellipsisVerticalOutline,
      'image-outline': imageOutline,
      'star': star,
      'star-outline': starOutline
    });
  }

  /* =========================
     🔹 ESTADO GENERAL
  ========================= */

  view = 'profile';
  role = 0;
  loggedUserId = 0;
  isLoggedIn: boolean = false;
  isPopoverOpen = false;
  popoverEvent: Event | null = null;

  selectedImageFile: File | null = null;

  setView(v: string) {
    this.view = v;
  }

  checkSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    this.isLoggedIn = !!token && !!user;
  }

  openPopover(event: Event) {
    this.checkSession();

    this.closeUserMenu(); // cierra menú de usuario si estuviera abierto

    this.popoverEvent = event;
    this.isPopoverOpen = true;
  }

  closePopover() {
    this.isPopoverOpen = false;
    this.popoverEvent = null;
  }

  goToLogin() {
    this.closePopover();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }

  goToProfile() {
    const user = localStorage.getItem('user');

    this.closePopover();

    setTimeout(() => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      const parsedUser = JSON.parse(user);
      this.router.navigate(['/user-profile', parsedUser.id_usuario]);
    }, 100);
  }

  goToDashboard() {
    this.closePopover();

    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 100);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;

    this.closePopover();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }

  hasNextReviewsPage(): boolean {
    return this.reviewsPage < Math.ceil(this.reviews.length / this.reviewsPageSize);
  }

  hasNextBookingsPage(): boolean {
    return this.bookingsPage < Math.ceil(this.bookings.length / this.pageSize);
  }

  hasNextAdsPage(): boolean {
    return this.adsPage < Math.ceil(this.ads.length / this.pageSize);
  }

  hasNextUsersPage(): boolean {
    return this.usersPage < Math.ceil(this.filteredUsers.length / this.usersPageSize);
  }

  /* =========================
     🔹 PERFIL
  ========================= */

  currentUser = {
    name: '',
    email: ''
  };

  user = {
    name: '',
    email: '',
    image: ''
  };

  password = '';
  confirmPassword = '';

  validateChanges(targetUser: any): boolean {

    if (!targetUser) {
      alert('Usuario inválido');
      return false;
    }

    // 🔹 validación contraseña SOLO perfil propio
    if (targetUser === this.user) {

      if (this.password || this.confirmPassword) {

        if (this.password !== this.confirmPassword) {
          alert('Contraseñas no coinciden');
          return false;
        }

        return true;
      }
    }

    // 🔹 validar cambios generales
    if (
      targetUser.name ||
      targetUser.email ||
      targetUser.username ||
      targetUser.rut
    ) {
      return true;
    }

    alert('No hay cambios');
    return false;
  }

  /* 🔥 CONFIRMAR */
  async confirmUserChanges(targetUser: any = null) {

    const userToValidate = targetUser || this.user;

    if (!this.validateChanges(userToValidate)) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Guardar cambios?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => this.saveChanges(userToValidate)
        }
      ]
    });

    await alert.present();
  }

  /* 🔥 GUARDAR (FIX REAL) */
  async saveChanges(targetUser: any) {
    if (targetUser === this.editingUser) {
      const payload = {
        rut: targetUser.rut,
        name: targetUser.name,
        username: targetUser.username,
        email: targetUser.email,
        subscription: targetUser.subscription
      };

      this.dashboardService.updateUser(targetUser.id, payload).subscribe({
        next: async (response) => {
          const index = this.users.findIndex(u => u.id === targetUser.id);

          if (index !== -1) {
            this.users[index] = response.user;
          }

          this.searchUsersFn();
          this.closeEditModal();

          const alert = await this.alertCtrl.create({
            header: 'Éxito',
            message: 'Usuario actualizado',
            cssClass: 'custom-alert',
            buttons: ['OK']
          });

          await alert.present();
        },
        error: (error) => alert(error.error?.error || 'Error al actualizar usuario')
      });

      return;
    }

    const formData = new FormData();

    if (this.user.name) formData.append('name', this.user.name);
    if (this.user.email) formData.append('email', this.user.email);

    if (this.password || this.confirmPassword) {
      if (this.password !== this.confirmPassword) {
        alert('Contraseñas no coinciden');
        return;
      }

      formData.append('password', this.password);
    }

    if (this.selectedImageFile) {
      formData.append('pfp', this.selectedImageFile);
    }

    this.dashboardService.updateMe(formData).subscribe({
      next: async (response) => {
        const oldLocalUser = localStorage.getItem('user');
        const parsed = oldLocalUser ? JSON.parse(oldLocalUser) : {};

        localStorage.setItem('user', JSON.stringify({
          ...parsed,
          nombre_real: response.user.name,
          correo_electronico: response.user.email,
          pfp: response.user.image
        }));

        this.password = '';
        this.confirmPassword = '';
        this.selectedImageFile = null;

        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Perfil actualizado correctamente',
          cssClass: 'custom-alert',
          buttons: ['OK']
        });

        await alert.present();

        this.loadDashboard();
      },
      error: (error) => alert(error.error?.error || 'Error al actualizar perfil')
    });
  }

  /* =========================
     🔹 REVIEWS
  ========================= */

  allReviews: any[] = [];
  reviews: any[] = [];
  paginatedReviews: Review[] = [];

  reviewsPage = 1;
  reviewsPageSize = 5;

  fetchReviews() {
    this.dashboardService.getReviews().subscribe({
      next: (data) => {
        this.allReviews = data;
        this.reviews = data;
        this.reviewsPage = 1;
        this.updateReviewsPagination();
      },
      error: (error) => {
        console.error('Error cargando reviews:', error);
        this.allReviews = [];
        this.reviews = [];
        this.updateReviewsPagination();
      }
    });
  }

  updateReviewsPagination() {
    const start = (this.reviewsPage - 1) * this.reviewsPageSize;
    this.paginatedReviews = this.reviews.slice(start, start + this.reviewsPageSize);
  }

  nextReviewsPage() {
    if (!this.hasNextReviewsPage()) return;

    this.reviewsPage++;
    this.updateReviewsPagination();
  }

  prevReviewsPage() {
    if (this.reviewsPage > 1) {
      this.reviewsPage--;
      this.updateReviewsPagination();
    }
  }

  deleteReview(id: number) {
    this.dashboardService.deleteReview(id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== id);
        this.allReviews = this.allReviews.filter(r => r.id !== id);
        this.updateReviewsPagination();
      },
      error: (error) => alert(error.error?.error || 'Error al eliminar review')
    });
  }

  getReviewStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? 'star' : 'star-outline'
    );
  }

    /* 🔥 CONFIRMAR */
  async confirmDeletion(id: number) {

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar review?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => this.deleteReview(id)
        }
      ]
    });

    await alert.present();
  }

  /* =========================
     🔹 TUTORÍAS
  ========================= */

  bookings: any[] = [];
  ads: any[] = [];

  paginatedBookings: any[] = [];
  paginatedAds: any[] = [];

  bookingsPage = 1;
  adsPage = 1;

  /* 🔥 dinámico */
  get pageSize(): number {
    return this.role === 1 ? 3 : 6;
  }

  fetchTutorias() {
    this.dashboardService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.bookingsPage = 1;
        this.updateBookingsPagination();
      },
      error: (error) => {
        console.error('Error cargando tutorías:', error);
        this.bookings = [];
        this.updateBookingsPagination();
      }
    });

    this.dashboardService.getAds().subscribe({
      next: (data) => {
        this.ads = data;
        this.adsPage = 1;
        this.updateAdsPagination();
      },
      error: (error) => {
        console.error('Error cargando anuncios:', error);
        this.ads = [];
        this.updateAdsPagination();
      }
    });
  }

  /* PAGINACIÓN BOOKINGS */
  updateBookingsPagination() {
    const start = (this.bookingsPage - 1) * this.pageSize;
    this.paginatedBookings = this.bookings.slice(start, start + this.pageSize);
  }

  nextBookingsPage() {
    if (!this.hasNextBookingsPage()) return;

    this.bookingsPage++;
    this.updateBookingsPagination();
  }

  prevBookingsPage() {
    if (this.bookingsPage > 1) {
      this.bookingsPage--;
      this.updateBookingsPagination();
    }
  }

  /* PAGINACIÓN ADS */
  updateAdsPagination() {
    const start = (this.adsPage - 1) * this.pageSize;
    this.paginatedAds = this.ads.slice(start, start + this.pageSize);
  }

  nextAdsPage() {
    if (!this.hasNextAdsPage()) return;

    this.adsPage++;
    this.updateAdsPagination();
  }

  prevAdsPage() {
    if (this.adsPage > 1) {
      this.adsPage--;
      this.updateAdsPagination();
    }
  }

  /* =========================
     🔹 ADMIN SEARCH
  ========================= */

  showResults = false;

  searchBookings = '';
  searchAds = '';

  filteredBookings: any[] = [];
  filteredAds: any[] = [];

  searchBookingsFn() {
    this.filteredBookings = this.bookings.filter(b =>
      b.user.toLowerCase().includes(this.searchBookings.toLowerCase()) ||
      b.tutor.toLowerCase().includes(this.searchBookings.toLowerCase())
    );

    this.showResults = true;
  }

  searchAdsFn() {
    this.filteredAds = this.ads.filter(a =>
      (a.title || '').toLowerCase().includes(this.searchAds.toLowerCase()) ||
      (a.tutor || '').toLowerCase().includes(this.searchAds.toLowerCase())
    );

    this.showResults = true;
  }

  resetSearch() {
    this.showResults = false;
    this.filteredBookings = [];
    this.filteredAds = [];
    this.searchBookings = '';
    this.searchAds = '';
  }

  /* =========================
    🔹 USERS (REHECHO BIEN)
  ========================= */

  users: any[] = [];
  filteredUsers: any[] = [];
  paginatedUsers: any[] = [];

  usersPage = 1;
  usersPageSize = 10;

  searchUsers = '';
  showUserResults = false;

  /* 🔥 POPOVER CONTROL */
  isUserMenuOpen = false;
  userMenuEvent: Event | null = null;
  selectedUser: any = null;

  /* 🔥 MODAL CONTROL */
  isEditModalOpen = false;
  editingUser: any = null;


  loadUsers() {
    this.dashboardService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.users = [];
      }
    });
  }

  /* 🔐 CONTROL DE PERMISOS */
  canManageUser(user: any): boolean {
    // si yo soy admin (2) y el otro también → NO permitido
    if (this.role === 2 && user.role === 2) {
      return false;
    }

    return true;
  }


  /* BUSCAR */
  searchUsersFn() {
    const query = this.searchUsers.toLowerCase();

    this.filteredUsers = this.users.filter(u =>
      (u.name || '').toLowerCase().includes(query) ||
      (u.username || '').toLowerCase().includes(query)
    );

    this.usersPage = 1;
    this.showUserResults = true;
    this.updateUsersPagination();
  }


  /* PAGINACIÓN */
  updateUsersPagination() {
    const start = (this.usersPage - 1) * this.usersPageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, start + this.usersPageSize);
  }

  nextUsersPage() {
    if (!this.hasNextUsersPage()) return;

    this.usersPage++;
    this.updateUsersPagination();
  }

  prevUsersPage() {
    if (this.usersPage > 1) {
      this.usersPage--;
      this.updateUsersPagination();
    }
  }

  /* 🔥 ABRIR POPOVER */
  openUserMenu(ev: Event, user: any) {
    if (!this.canManageUser(user)) return;

    this.closePopover(); // cierra header si estuviera abierto

    this.userMenuEvent = ev;
    this.selectedUser = user;
    this.isUserMenuOpen = true;
  }

  /* 🔹 ACCIONES POPOVER */
  handleEdit() {
    if (!this.canManageUser(this.selectedUser)) return;

    this.closeUserMenu();

    setTimeout(() => {
      this.editingUser = { ...this.selectedUser };
      this.isEditModalOpen = true;
    }, 200);
  }

    closeUserMenu() {
    this.isUserMenuOpen = false;
    this.userMenuEvent = null;
  }

  async handleDelete() {
    if (!this.canManageUser(this.selectedUser)) return;

    this.closeUserMenu();

    const confirmAlert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar este usuario?',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí',
          handler: () => {
            this.dashboardService.deleteUser(this.selectedUser.id).subscribe({
              next: () => {
                this.users = this.users.filter(u => u.id !== this.selectedUser.id);
                this.searchUsersFn();
              },
              error: (error) => {
                window.alert(error.error?.error || 'Error al eliminar usuario');
              }
            });
          }
        }
      ]
    });

    await confirmAlert.present();
  }

  handleDeleteImage() {
    if (!this.canManageUser(this.selectedUser)) return;

    this.closeUserMenu();

    this.dashboardService.deleteUserImage(this.selectedUser.id).subscribe({
      next: (response) => {
        const index = this.users.findIndex(u => u.id === this.selectedUser.id);

        if (index !== -1) {
          this.users[index] = response.user;
        }

        this.searchUsersFn();
      },
      error: (error) => alert(error.error?.error || 'Error al eliminar foto')
    });
  }

  /* 🔹 MODAL */
  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingUser = null;
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten imágenes JPG, JPEG o PNG.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen debe pesar máximo 2MB.');
      return;
    }

    this.selectedImageFile = file;
    this.user.image = URL.createObjectURL(file);
  }

  /* =========================
     🔹 INIT
  ========================= */
  
  ngOnInit() {
      this.checkSession();
      this.loadDashboard();
      const updated = localStorage.getItem('profileUpdated');

  if (updated) {

    localStorage.removeItem('profileUpdated');

    setTimeout(async () => {

      const alert = await this.alertCtrl.create({
        header: 'Éxito',
        message: 'Acción completada',
        cssClass: 'custom-alert',
        buttons: ['OK']
      });

      await alert.present();

    }, 300);
  }
    this.fetchReviews();
    this.fetchTutorias();
  }

  loadDashboard() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.dashboardService.getMe().subscribe({
      next: (me) => {
        this.role = me.role;
        this.loggedUserId = me.id;
        this.isLoggedIn = true;

        this.currentUser = {
          name: me.name,
          email: me.email
        };

        this.user = {
          name: me.name,
          email: me.email,
          image: me.image || 'assets/icon/userpfp.jpg'
        };

        this.fetchReviews();
        this.fetchTutorias();

        if (this.role === 2) {
          this.loadUsers();
        }
      },
      error: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      }
    });
  }

  goToTutoringAd(id: number) {
    this.router.navigate(['/tutoring-ad', id]);
  }

  goToUserProfile(id: number) {
    this.router.navigate(['/user-profile', id]);
  }
}
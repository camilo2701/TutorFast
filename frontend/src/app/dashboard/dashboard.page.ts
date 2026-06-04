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
  starOutline,
  trashBinOutline,
  shieldCheckmarkOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  documentTextOutline
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
      'star-outline': starOutline,
      'trash-bin-outline': trashBinOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'close-circle-outline': closeCircleOutline,
      'document-text-outline': documentTextOutline,
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

  selectedFile: File | null = null;

  

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

  async confirmDeleteAccount() {

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Desea eliminar su cuenta y toda la información asociada a esta?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {

            this.dashboardService
              .deleteMyAccount()
              .subscribe({

                next: () => {

                  localStorage.removeItem('token');
                  localStorage.removeItem('user');

                  this.router.navigate(['/login']);
                },

                error: (err) => {

                  window.alert(
                    err.error?.error || 'No se pudo eliminar la cuenta'
                  );

                }

              });

          }
        }
      ]
    });

    await alert.present();
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
     🔹 VERIFICACION DE TUTORES
  ========================= */

  tutorVerified: boolean = false;
  // Placeholder backend:
  // true = existe solicitud pendiente
  // false = no existe solicitud
  hasVerificationRequest: boolean = false;
  verificationPdf: File | null = null;

  /* ADMIN */

  verificationRequests: any[] = [];
  paginatedVerificationRequests: any[] = [];

  verificationPage = 1;
  verificationPageSize = 10;

  isVerificationMenuOpen = false;
  verificationMenuEvent: Event | null = null;
  selectedVerificationRequest: any = null;
  
  // Selección PDF
  onVerificationPdfSelected(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {

      alert('Solo se aceptan archivos PDF.');
      return;
    }

    this.verificationPdf = file;
  }

  // ENVIAR SOLICUTD
  async submitVerificationRequest() {

    if (!this.verificationPdf) {

      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Debes seleccionar un archivo PDF.',
        cssClass: 'custom-alert',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }

    this.dashboardService
      .sendVerificationRequest(this.verificationPdf)
      .subscribe({

        next: async () => {

          const alert = await this.alertCtrl.create({
            header: 'Éxito',
            message: 'Solicitud de verificación enviada correctamente.',
            cssClass: 'custom-alert',
            buttons: ['OK']
          });

          await alert.present();

          this.verificationPdf = null;          
          // Actualiza inmediatamente la vista
          this.hasVerificationRequest = true;
        },

        error: async (err) => {

          console.error(err);

          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: err.error?.error || 'No se pudo enviar la solicitud.',
            cssClass: 'custom-alert',
            buttons: ['OK']
          });

          await alert.present();
        }

      });

  }

  //POPOVER ADMIN
  openVerificationMenu(event: Event, request: any) {

    this.verificationMenuEvent = event;
    this.selectedVerificationRequest = request;
    this.isVerificationMenuOpen = true;
  }

  closeVerificationMenu() {

    this.isVerificationMenuOpen = false;
    this.verificationMenuEvent = null;
  }

  // APROBAR SOLICITUD
  async approveVerification() {

    this.closeVerificationMenu();

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Aprobar esta solicitud?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: async () => {

            try {

              await this.dashboardService
                .approveVerificationRequest(this.selectedVerificationRequest.id)
                .toPromise();

              await this.loadVerificationRequests();

              const success = await this.alertCtrl.create({
                header: 'Éxito',
                message: 'Solicitud aprobada correctamente.',
                cssClass: 'custom-alert',
                buttons: ['OK']
              });

              await success.present();

            } catch (error) {

              console.error(error);

              const fail = await this.alertCtrl.create({
                header: 'Error',
                message: 'No se pudo aprobar la solicitud.',
                cssClass: 'custom-alert',
                buttons: ['OK']
              });

              await fail.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }


  // RECHAZAR SOLICITUD
  async rejectVerification() {

    this.closeVerificationMenu();

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Rechazar esta solicitud?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: async () => {

            try {

              await this.dashboardService
                .rejectVerificationRequest(this.selectedVerificationRequest.id)
                .toPromise();

              await this.loadVerificationRequests();

              const success = await this.alertCtrl.create({
                header: 'Éxito',
                message: 'Solicitud rechazada correctamente.',
                cssClass: 'custom-alert',
                buttons: ['OK']
              });

              await success.present();

            } catch (error) {

              console.error(error);

              const fail = await this.alertCtrl.create({
                header: 'Error',
                message: 'No se pudo rechazar la solicitud.',
                cssClass: 'custom-alert',
                buttons: ['OK']
              });

              await fail.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // PAGINACION
  hasNextVerificationPage(): boolean {
    return this.verificationPage <
      Math.ceil(
        this.verificationRequests.length /
        this.verificationPageSize
      );
  }

  updateVerificationPagination() {

    const start =
      (this.verificationPage - 1) *
      this.verificationPageSize;

    this.paginatedVerificationRequests =
      this.verificationRequests.slice(
        start,
        start + this.verificationPageSize
      );
  }

  nextVerificationPage() {

    if (!this.hasNextVerificationPage()) return;

    this.verificationPage++;
    this.updateVerificationPagination();
  }

  prevVerificationPage() {

    if (this.verificationPage > 1) {

      this.verificationPage--;
      this.updateVerificationPagination();
    }
  }  

  /* =========================
     🔹 INIT
  ========================= */
  
  ngOnInit() {
      this.checkSession();
      this.loadDashboard();
      this.loadVerificationRequests();
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
        this.tutorVerified = me.tutorVerified;
        console.log('Voy a consultar solicitud');

        this.dashboardService
          .getMyVerificationRequest()
          .subscribe({
            next: (data) => {
              console.log('Solicitud pendiente:', data);
              this.hasVerificationRequest = data.hasRequest;
            },
            error: (err) => {
              console.error('ERROR CONSULTANDO SOLICITUD', err);
            }
          });

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

  submitVerification() {

    if (!this.selectedFile) {
      return;
    }

    this.dashboardService
      .sendVerificationRequest(this.selectedFile)
      .subscribe({
        next: () => {
          alert('Solicitud enviada correctamente');
        },
        error: (err) => {
          alert(err.error.error);
        }
      });
  }

  onFileSelected(event: any) {

    const file = event.target.files?.[0];

    if (file) {
      this.selectedFile = file;
    }

  }

  loadVerificationRequests() {
    this.dashboardService.getVerificationRequests().subscribe({
      next: (data) => {

        console.log('SOLICITUDES:', data);

        this.verificationRequests = data;

        this.verificationPage = 1;

        this.updateVerificationPagination();
      },
      error: (err) => {
        console.error(err);

        this.verificationRequests = [];
        this.paginatedVerificationRequests = [];
      }
    });
  }

  async handleCreateAd() {

    if (!this.tutorVerified) {

      const alert = await this.alertCtrl.create({
        header: 'Acción no permitida',
        message: 'Debes estar verificado como tutor para crear anuncios de tutoría.',
        cssClass: 'custom-alert',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }

    this.router.navigate(['/create-tutoring-ad']);
  }

  async downloadPdf(url: string) {

    const response = await fetch(url);

    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = blobUrl;
    link.download = 'documento-verificacion.pdf';

    link.click();

    window.URL.revokeObjectURL(blobUrl);
  }
  
}
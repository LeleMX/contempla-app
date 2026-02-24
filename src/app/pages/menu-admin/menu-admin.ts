import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService, MenuItem } from '../../core/services/menu';
import { AuditService } from '../../core/services/audit.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, FormsModule],
  templateUrl: './menu-admin.html'
})
export class MenuAdmin implements OnInit {
  private menuService = inject(MenuService);
  private auditService = inject(AuditService);
  private cdr = inject(ChangeDetectorRef);
  menuItems$!: Observable<MenuItem[]>;
  
  // Form Model
  currentItem: MenuItem = this.getEmptyItem();
  isEditing = false;
  isSaving = false;
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  
  categories = ['Bebidas Calientes', 'Bebidas Frías', 'Postres', 'Snacks', 'Especialidades'];

  ngOnInit() {
    this.menuItems$ = this.menuService.getMenuItems();
  }

  getEmptyItem(): MenuItem {
    return { name: '', description: '', category: 'Bebidas Calientes', price: 0, imageUrl: '' };
  }

  editItem(item: MenuItem) {
    this.currentItem = { ...item };
    this.isEditing = true;
    this.selectedImageFile = null;
    this.imagePreviewUrl = item.imageUrl || null;
  }

  cancelEdit() {
    this.currentItem = this.getEmptyItem();
    this.isEditing = false;
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Security Validation
      if (!file.type.startsWith('image/')) {
        this.showToast('Error: El archivo debe ser una imagen válida');
        return;
      }
      const allowedExtensions = /\.(jpg|jpeg|png|webp|gif)$/i;
      if (!allowedExtensions.test(file.name)) {
        this.showToast('Error: Formato de imagen no permitido (.jpg, .png, .webp)');
        return;
      }

      this.selectedImageFile = file;
      // Crear vista previa local
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }



  // Image Preview Modal State
  showImagePreview = false;
  previewImageUrl: string | null = null;

  openImagePreview(url: string | undefined) {
    if (!url) return;
    this.previewImageUrl = url;
    this.showImagePreview = true;
  }

  closeImagePreview() {
    this.showImagePreview = false;
    this.previewImageUrl = null;
  }

  // Modal State
  showConfirmModal = false;
  confirmAction: 'add' | 'edit' | 'delete' | null = null;
  itemToDeleteId?: string;

  // Toast State
  toastMessage: string | null = null;

  initiateSave() {
    if (!this.currentItem.name || this.currentItem.price <= 0) return;
    this.confirmAction = this.isEditing ? 'edit' : 'add';
    this.showConfirmModal = true;
  }

  initiateDelete(id: string | undefined) {
    if (!id) return;
    this.confirmAction = 'delete';
    this.itemToDeleteId = id;
    this.showConfirmModal = true;
  }

  cancelConfirm() {
    this.showConfirmModal = false;
    this.confirmAction = null;
    this.itemToDeleteId = undefined;
  }

  async confirmActionExecution() {
    this.showConfirmModal = false;
    if (this.confirmAction === 'add' || this.confirmAction === 'edit') {
      await this.saveItem();
    } else if (this.confirmAction === 'delete' && this.itemToDeleteId) {
      await this.executeDelete(this.itemToDeleteId);
    }
  }

  async saveItem() {
    this.isSaving = true;
    this.cdr.detectChanges();
    try {

      
      // Limpiar propiedades vacías para evitar errores de Firestore
      const docPayload = { ...this.currentItem };

      // Subir imagen si hay una seleccionada
      if (this.selectedImageFile) {
        docPayload.imageUrl = await this.menuService.uploadImage(this.selectedImageFile);
      } else if (!docPayload.imageUrl) {
        delete docPayload.imageUrl;
      }

      if (this.isEditing && this.currentItem.id) {
        const id = this.currentItem.id;
        delete docPayload.id; // Nunca guardar el ID dentro del documento si no es necesario o en update
        await this.menuService.updateMenuItem(id, docPayload);
        await this.auditService.logAction('ACTUALIZAR_MENU', 'Menu', docPayload, null, id);
        this.showToast('Producto editado exitosamente');
      } else {
        delete docPayload.id; // Por si acaso
        await this.menuService.addMenuItem(docPayload);
        await this.auditService.logAction('CREAR_MENU', 'Menu', docPayload);
        this.showToast('Producto creado exitosamente');
      }
      this.cancelEdit();
    } catch (e) {
      console.error("Error saving menu item", e);
      this.showToast('Error al guardar el producto');
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  async executeDelete(id: string) {
    try {
      await this.menuService.deleteMenuItem(id);
      await this.auditService.logAction('ELIMINAR_MENU', 'Menu', null, null, id);
      this.showToast('Producto eliminado exitosamente');
    } catch (e) {
      console.error("Error deleting menu item", e);
      this.showToast('Error al eliminar el producto');
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toastMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }
}

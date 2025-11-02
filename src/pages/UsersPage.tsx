import React, { useState, useRef } from "react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../features/users/usersApi"; 
import { User } from "../utils/types"; 
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog";

const UsersPage: React.FC = () => {
  const toast = useRef<any>(null);

  const [userDialog, setUserDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});

  const [globalFilter, setGlobalFilter] = useState("");
  const [confirmState, setConfirmState] = useState<{ visible: boolean; id?: number }>({ visible: false });

  const { data: usersData, isLoading, isError, error } = useGetUsersQuery({ limit: 100 });
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const isLoadingForm = isCreating || isUpdating; 
  const handleNew = () => {
    setCurrentUser({}); 
    setIsEdit(false);
    setUserDialog(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser({ ...user });
    setUserDialog(true);
  };

  const hideDialog = () => {
    setUserDialog(false);
    setCurrentUser({});
  };

  const handleDelete = (id: number) => {
    setConfirmState({ visible: true, id: id });
  };

  const handleSave = async () => {
    try {
      let message = "";
      if (isEdit) {
        await updateUser({ id: currentUser.id!, ...currentUser }).unwrap();
        message = "Usuario actualizado con éxito";
      } else {
        const newUser = currentUser as Omit<User, 'id'>;
        await createUser(newUser).unwrap();
        message = "Usuario creado con éxito";
      }
      
      toast.current?.show({ severity: "success", summary: "Éxito", detail: message });
      hideDialog();

    } catch (err: any) {
      console.error("Error al guardar:", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.data?.message || "No se pudo guardar el usuario",
      });
    }
  };

  const confirmDelete = async () => {
    if (!confirmState.id) return;
    try {
      await deleteUser(confirmState.id).unwrap();
      toast.current?.show({ severity: "success", summary: "Éxito", detail: "Usuario eliminado" });
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.data?.message || "No se pudo eliminar el usuario",
      });
    } finally {
      setConfirmState({ visible: false }); 
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof User) => {
    const val = e.target.value;
    setCurrentUser(prev => ({ ...prev, [name]: val }));
  };

  if (isLoading) {
    return <ProgressSpinner style={{ display: 'block', margin: 'auto' }} />;
  }
  if (isError) {
    return <div className="p-error">Error al cargar usuarios: {JSON.stringify(error)}</div>;
  }

  const actionBodyTemplate = (rowData: User) => {
    return (
      <div className="p-d-flex" style={{ gap: '0.5rem' }}>
        <Button icon="pi pi-pencil" rounded text severity="warning" onClick={() => handleEdit(rowData)} tooltip="Editar" />
        <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => handleDelete(rowData.id)} tooltip="Eliminar" />
      </div>
    );
  };

  const tableHeader = (
    <div className="p-d-flex p-jc-between p-ai-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Buscar usuario..."
        />
      </span>
      <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={handleNew} />
    </div>
  );

  return (
    <div className="p-2 md:p-4 surface-ground min-h-screen">
      <Toast ref={toast} />
      <ConfirmDialog 
        visible={confirmState.visible} 
        onHide={() => setConfirmState({ visible: false })} 
        message="¿Estás seguro de que quieres eliminar este usuario?"
        header="Confirmar eliminación" 
        icon="pi pi-exclamation-triangle" 
        accept={confirmDelete} 
        reject={() => setConfirmState({ visible: false })}
        acceptLabel="Sí"
        rejectLabel="No"
      />

      <Card title="Gestión de Usuarios" className="shadow-2 border-round-lg">
        <DataTable
          value={usersData?.users || []}
          paginator
          rows={10}
          stripedRows
          rowHover
          className="p-datatable-gridlines"
          emptyMessage="No se encontraron usuarios."
          globalFilter={globalFilter}
          header={tableHeader}
          responsiveLayout="scroll"
        >
          <Column field="id" header="ID" sortable style={{ minWidth: '80px' }} />
          <Column 
            field="firstName" 
            header="Nombre" 
            sortable 
            body={(u: User) => `${u.firstName} ${u.lastName}`} 
            style={{ minWidth: '200px' }} 
          />
          <Column field="email" header="Email" sortable style={{ minWidth: '250px' }} />
          <Column field="username" header="Username" sortable style={{ minWidth: '150px' }} />
          <Column field="phone" header="Teléfono" sortable style={{ minWidth: '150px' }} />
          <Column
            header="Acciones"
            body={actionBodyTemplate}
            frozen
            alignFrozen="right"
            style={{ minWidth: '130px' }}
          />
        </DataTable>
      </Card>

  
      <Dialog
        visible={userDialog}
        header={isEdit ? "Editar Usuario" : "Crear Usuario"}
        modal
        className="p-fluid"
        style={{ width: '50vw', minWidth: '300px' }}
        onHide={hideDialog}
        footer={(
          <div className="p-d-flex p-jc-end" style={{ gap: '0.5rem' }}>
            <Button label="Cancelar" icon="pi pi-times" outlined severity="secondary" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" severity="success" onClick={handleSave} loading={isLoadingForm} />
          </div>
        )}
      >
        <div className="p-field p-mb-3">
          <label htmlFor="firstName" className="p-d-block p-mb-1 p-text-bold">Nombre</label>
          <InputText id="firstName" value={currentUser.firstName || ''} onChange={(e) => onInputChange(e, 'firstName')} />
        </div>
        <div className="p-field p-mb-3">
          <label htmlFor="lastName" className="p-d-block p-mb-1 p-text-bold">Apellido</label>
          <InputText id="lastName" value={currentUser.lastName || ''} onChange={(e) => onInputChange(e, 'lastName')} />
        </div>
        <div className="p-field p-mb-3">
          <label htmlFor="email" className="p-d-block p-mb-1 p-text-bold">Email</label>
          <InputText id="email" value={currentUser.email || ''} onChange={(e) => onInputChange(e, 'email')} />
        </div>
        <div className="p-field p-mb-3">
          <label htmlFor="username" className="p-d-block p-mb-1 p-text-bold">Username</label>
          <InputText id="username" value={currentUser.username || ''} onChange={(e) => onInputChange(e, 'username')} />
        </div>
      </Dialog>
    </div>
  );
};

export default UsersPage;
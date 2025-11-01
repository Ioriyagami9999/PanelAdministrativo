import React, { useState } from "react";
import {
  useMeQuery,
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "../api/dummyjsonApi";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const DashboardPage: React.FC = () => {
  const toast = React.useRef<any>(null);
  const { data: user, isLoading: loadingUser } = useMeQuery();
  const { data: postsData, isLoading: loadingPosts } = useGetPostsQuery({ limit: 10, skip: 0 });

  const [addPost] = useAddPostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [visible, setVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>("");


  const handleNew = () => {
    setEditingPost(null);
    setTitle("");
    setBody("");
    setVisible(true);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setBody(post.body);
    setVisible(true);
  };

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId).unwrap();
      toast.current?.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Publicación eliminada correctamente",
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la publicación",
      });
    }
  };

const handleSave = async () => {
  try {
    if (editingPost) {
      await updatePost({ id: editingPost.id, title, body }).unwrap();
      toast.current?.show({
        severity: "success",
        summary: "Actualizado",
        detail: "Publicación actualizada correctamente",
      });
    } else {
      // ✅ Aquí agregamos el userId
      await addPost({ title, body, userId: user?.id }).unwrap();
      toast.current?.show({
        severity: "success",
        summary: "Agregado",
        detail: "Publicación creada correctamente",
      });
    }
    setVisible(false);
  } catch (err) {
    console.error("❌ Error al guardar:", err);
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "No se pudo guardar la publicación",
    });
  }
};

  if (loadingUser || loadingPosts) return <ProgressSpinner />;

  return (
<div className="p-8 bg-gray-50 min-h-screen space-y-8">
  <Toast ref={toast} />

  {/* 🧍 Sección de perfil */}
  <Card className="shadow-md border-0">
    <div className="flex flex-col md:flex-row items-center gap-6">
      <img
        src={user?.image}
        alt="User"
        className="w-28 h-28 rounded-full border-4 border-indigo-100 shadow"
      />
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-800">
          Bienvenido, {user?.firstName} {user?.lastName} 👋
        </h2>
        <p className="text-gray-500 mt-1">@{user?.username}</p>
        <div className="mt-3 space-y-1 text-gray-600">
          <p><b>Correo:</b> {user?.email}</p>
          <p><b>Género:</b> {user?.gender}</p>
        </div>
      </div>
    </div>
  </Card>

  {/* 🧾 Gestión de publicaciones */}
  <Card
    title="Gestión de publicaciones"
    subTitle="Crea, edita o elimina tus publicaciones fácilmente"
    className="shadow-md border-0"
  >
<div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
  <h3 className="text-xl font-semibold text-gray-700">Publicaciones recientes</h3>

  <div className="flex items-center gap-2 w-full md:w-auto">
    <span className="p-input-icon-left w-full md:w-64">
      <i className="pi pi-search" />
      <InputText
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Buscar publicación..."
        className="w-full"
      />
    </span>

    <Button
      icon="pi pi-plus"
      label="Nueva publicación"
      className="p-button-rounded p-button-success"
      onClick={handleNew}
    />
  </div>
</div>



<DataTable
  value={postsData?.posts?.filter(
    (p) =>
      p.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
      p.body.toLowerCase().includes(globalFilter.toLowerCase())
  ) || []}
  paginator
  rows={5}
  stripedRows
  className="rounded-lg overflow-hidden"
  emptyMessage="No hay publicaciones registradas."
    >
      <Column field="id" header="ID" style={{ width: "80px" }} />
      <Column
        field="title"
        header="Título"
        body={(rowData) => (
          <span className="font-medium text-gray-800">{rowData.title}</span>
        )}
      />
      <Column
        field="body"
        header="Contenido"
        body={(rowData) => (
          <span className="text-gray-600">{rowData.body.slice(0, 80)}...</span>
        )}
      />
      <Column
        header="Acciones"
        style={{ width: "130px" }}
        body={(rowData) => (
          <div className="flex gap-2 justify-center">
            <Button
              icon="pi pi-pencil"
              rounded
              outlined
              severity="info"
              className="p-button-sm"
              tooltip="Editar"
              onClick={() => handleEdit(rowData)}
            />
            <Button
              icon="pi pi-trash"
              rounded
              outlined
              severity="danger"
              className="p-button-sm"
              tooltip="Eliminar"
              onClick={() => handleDelete(rowData.id)}
            />
          </div>
        )}
      />
    </DataTable>
  </Card>

  {/* ✏️ Modal agregar/editar */}
  <Dialog
    header={editingPost ? "Editar publicación" : "Nueva publicación"}
    visible={visible}
    style={{ width: "35vw" }}
    onHide={() => setVisible(false)}
    className="rounded-xl shadow-lg"
  >
    <div className="p-fluid space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
          Título
        </label>
        <InputText
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Escribe un título atractivo"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="body" className="block mb-2 font-medium text-gray-700">
          Contenido
        </label>
        <InputText
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escribe el contenido de tu publicación"
          className="w-full"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          outlined
          severity="secondary"
          onClick={() => setVisible(false)}
        />
        <Button
          label="Guardar"
          icon="pi pi-check"
          severity="success"
          onClick={handleSave}
        />
      </div>
    </div>
  </Dialog>
</div>

  );
};

export default DashboardPage;

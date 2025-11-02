import React, { useState, useRef } from "react";
import {
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "../features/posts/postsApi";
import { useMeQuery } from "../api/dummyjsonApi";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Post } from "../utils/types";

const FetchPost: React.FC = () => {
  const toast = useRef<any>(null);
  const { data: user, isLoading: loadingUser } = useMeQuery();
  const { data: postsData, isLoading: loadingPosts } = useGetPostsQuery({
    limit: 10,
    skip: 0,
  });

  const [addPost] = useAddPostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [visible, setVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [isViewVisible, setIsViewVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [confirmState, setConfirmState] = useState<{ visible: boolean; id?: number }>({
    visible: false,
  });

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

  const handleView = (post: Post) => {
    setSelectedPost(post);
    setIsViewVisible(true);
  };

  const handleDelete = (postId: number) => {
    setConfirmState({ visible: true, id: postId });
  };

  const confirmDelete = async () => {
    if (!confirmState.id) return;
    try {
      await deletePost(confirmState.id).unwrap();
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
    } finally {
      setConfirmState({ visible: false });
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


  if (loadingUser || loadingPosts) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #f8fafc, #eef2ff)",
        }}
      >
        <ProgressSpinner
          style={{ width: "60px", height: "60px" }}
          strokeWidth="6"
          animationDuration=".7s"
        />
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 surface-ground min-h-screen">
      <Toast ref={toast} />
      <ConfirmDialog
        visible={confirmState.visible}
        onHide={() => setConfirmState({ visible: false })}
        message="¿Eliminar publicación?"
        accept={confirmDelete}
      />

   
      <Dialog
        header={selectedPost?.title}
        visible={isViewVisible}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "50vw" }}
        onHide={() => setIsViewVisible(false)}
        modal
      >
        {selectedPost && (
          <div className="p-fluid">
            <p>
              <strong>Usuario ID:</strong> {selectedPost.userId}
            </p>
            <p>
              <strong>Tags:</strong> {selectedPost.tags?.join(", ")}
            </p>
            <hr className="p-my-2" />
            <p style={{ lineHeight: 1.6 }}>{selectedPost.body}</p>
          </div>
        )}
      </Dialog>

 
      <Card
        title="Gestión de publicaciones"
        subTitle="Crea, edita o elimina tus publicaciones fácilmente"
        className="shadow-2 border-round-lg"
      >
        <h3 className="p-text-xl p-text-bold text-color-secondary p-mt-0 p-mb-3">
          Publicaciones recientes
        </h3>

        <div
          className="p-d-flex p-jc-between p-ai-center p-mb-4 p-flex-wrap"
          style={{ gap: "1rem" }}
        >
          <span className="p-input-icon-left p-w-full p-md-w-20rem">
            <i className="pi pi-search" />
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar publicación..."
              className="p-w-full"
            />
          </span>

          <Button
            icon="pi pi-plus"
            label="Nueva"
            className="p-button-success"
            onClick={handleNew}
          />
        </div>

      
        <DataTable
          value={
            postsData?.posts?.filter(
              (p) =>
                p.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
                p.body.toLowerCase().includes(globalFilter.toLowerCase())
            ) || []
          }
          paginator
          rows={5}
          stripedRows
          rowHover
          className="border-round-lg overflow-hidden p-datatable-gridlines"
          emptyMessage="No hay publicaciones registradas."
          scrollable
          responsiveLayout="scroll"
          removableSort
        >
          <Column field="id" header="ID" style={{ minWidth: "80px" }} sortable />
          <Column
            field="title"
            header="Título"
            style={{ minWidth: "200px" }}
            sortable
            body={(rowData) => (
              <span className="p-text-bold text-color">{rowData.title}</span>
            )}
          />
          <Column
            field="body"
            header="Contenido"
            style={{ minWidth: "300px" }}
            body={(rowData) => (
              <span className="text-color-secondary">
                {rowData.body.slice(0, 80)}...
              </span>
            )}
          />
          <Column
            header="Acciones"
            frozen
            alignFrozen="right"
            style={{ minWidth: "130px" }}
            body={(rowData: Post) => (
              <div className="p-d-flex p-jc-center" style={{ gap: "0.5rem" }}>
                <Button
                  icon="pi pi-eye"
                  rounded
                  text
                  severity="info"
                  tooltip="Ver"
                  onClick={() => handleView(rowData)}
                />
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="warning"
                  tooltip="Editar"
                  onClick={() => handleEdit(rowData)}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  tooltip="Eliminar"
                  onClick={() => handleDelete(rowData.id)}
                />
              </div>
            )}
          />
        </DataTable>
      </Card>

 
 
      <Dialog
        header={editingPost ? "Editar publicación" : "Nueva publicación"}
        visible={visible}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        className="border-round-xl shadow-2"
      >
        <div className="p-fluid">
          <div className="p-mb-3">
            <label
              htmlFor="title"
              className="p-d-block p-mb-1 p-text-bold text-color-secondary"
            >
              Título
            </label>
            <InputText
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe un título atractivo"
              className="p-w-full"
            />
          </div>

          <div className="p-mb-3">
            <label
              htmlFor="body"
              className="p-d-block p-mb-1 p-text-bold text-color-secondary"
            >
              Contenido
            </label>
            <InputTextarea
              id="body"
              value={body}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setBody(e.target.value)
              }
              placeholder="Escribe el contenido de tu publicación"
              className="p-w-full"
              rows={5}
            />
          </div>

          <div className="p-d-flex p-jc-end p-pt-4" style={{ gap: "0.5rem" }}>
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

export default FetchPost;

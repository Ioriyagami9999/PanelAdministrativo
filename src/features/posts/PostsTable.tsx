import React, { useState, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useGetPostsQuery, useDeletePostMutation } from "../../api/dummyjsonApi";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const PostsTable: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const { data, isLoading } = useGetPostsQuery({ limit: PAGE_SIZE, skip: page * PAGE_SIZE });
  const [deletePost] = useDeletePostMutation();
  const toast = React.useRef<any>(null);
  const [confirmState, setConfirmState] = useState<{ visible: boolean; id?: number }>({visible:false});
  const navigate = useNavigate();

  const header = (
    <div className="p-d-flex p-jc-between p-ai-center">
      <h3>Publicaciones</h3>
      <div className="p-d-flex">
        <InputText placeholder="Buscar..." value={globalFilter} onChange={(e)=>setGlobalFilter(e.target.value)} className="p-mr-2"/>
        <Button label="Nuevo" icon="pi pi-plus" onClick={()=>navigate("/posts/new")}/>
      </div>
    </div>
  );

  const actionsTemplate = (rowData:any) => (
    <div>
      <Button icon="pi pi-eye" className="p-button-text p-mr-2" onClick={()=>{/* ver modal */}}/>
      <Button icon="pi pi-pencil" className="p-button-text p-mr-2" onClick={()=>navigate(`/posts/${rowData.id}/edit`)}/>
      <Button icon="pi pi-trash" className="p-button-danger" onClick={()=>setConfirmState({visible:true,id:rowData.id})}/>
    </div>
  );

  const confirmDelete = async () => {
    if (!confirmState.id) return;
    try {
      await deletePost(confirmState.id).unwrap();
      toast.current?.show({severity:"success", summary:"Eliminado", detail:"Publicación eliminada"});
    } catch (err:any) {
      toast.current?.show({severity:"error", summary:"Error", detail: err?.data?.message || "No se pudo eliminar"});
    } finally { setConfirmState({visible:false}); }

  };

  return (
    <div>
      <Toast ref={toast}/>
      <ConfirmDialog visible={confirmState.visible} onHide={()=>setConfirmState({visible:false})} message="¿Eliminar publicación?" accept={confirmDelete}/>
      <Toolbar left={header} />
      <DataTable value={data?.posts} paginator rows={PAGE_SIZE} totalRecords={data?.total} lazy first={page*PAGE_SIZE} onPage={(e)=>setPage(e.page ?? 0)} loading={isLoading} globalFilter={globalFilter}>
        <Column field="id" header="ID" style={{width:70}} />
        <Column field="title" header="Título" />
        <Column field="userId" header="Usuario" />
        <Column field="tags" header="Tags" body={(row)=>row.tags?.join(", ")} />
        <Column field="reactions" header="Reacciones" />
        <Column header="Acciones" body={actionsTemplate} style={{width:200}}/>
      </DataTable>
    </div>
  );
};

export default PostsTable;

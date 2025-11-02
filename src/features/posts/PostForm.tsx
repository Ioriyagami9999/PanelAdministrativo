import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { 
  // --- ✅ CAMBIO N° 1 ---
  // Importamos los hooks de mutación desde la NUEVA RAMA de posts
  useAddPostMutation, 
  useUpdatePostMutation 
} from "../../features/posts/postsApi"; // <-- ¡Ruta actualizada!
import { 
  // 'useMeQuery' sigue viniendo del TRONCO (api)
  useMeQuery 
} from "../../api/dummyjsonApi";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Chips } from "primereact/chips";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

type FormData = { title: string; body: string; tags: string[] };

const PostForm: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const { control, handleSubmit, reset, formState } = useForm<FormData>({ 
    defaultValues: { title: "", body: "", tags: [] }
  });
  const { errors, isSubmitting } = formState;

  // --- ✅ CAMBIO N° 2 ---
  // Estos hooks ahora vienen del 'postsApi' importado arriba
  const [addPost, { isLoading: isAdding }] = useAddPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  
  const { data: userData } = useMeQuery(); 

  const navigate = useNavigate();
  const toast = useRef<any>(null);

  const isLoading = isAdding || isUpdating;

  useEffect(()=> {
    // Lógica para cargar datos si estás editando (opcional)
  }, [id, isEdit, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      let message = "";
      if (isEdit) {
        await updatePost({ id: Number(id), ...data }).unwrap();
        message = "Publicación actualizada con éxito";
      } else {
        const newPostData = { 
          ...data, 
          userId: userData?.id 
        };
        await addPost(newPostData).unwrap();
        message = "Publicación creada con éxito";
      }
      
      toast.current?.show({
        severity: "success", 
        summary: "Éxito", 
        detail: message,
        life: 3000
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err: any) {
      console.error("Error al guardar:", err);
      toast.current?.show({
        severity: "error", 
        summary: "Error", 
        detail: err?.data?.message || "No se pudo guardar la publicación",
        life: 3000
      });
    }
  };

  return (
    <> 
      <Toast ref={toast} />
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-fluid p-p-4 p-shadow-2" style={{maxWidth:720, margin: '0 auto', background: 'white', borderRadius: '8px'}}>
        
        <h3 style={{marginTop: 0}}>{isEdit ? "Editar" : "Crear"} publicación</h3>
        
        {/* Campo Título con validación */}
        <div className="p-field p-mb-3">
          <label htmlFor="title" className="p-d-block p-mb-1">Título</label>
          <Controller 
            name="title"
            control={control} 
            rules={{ required: "El título es obligatorio" }} 
            render={({field, fieldState}) => (
              <InputText 
                id={field.name} 
                {...field} 
                className={classNames({ 'p-invalid': fieldState.error })}
              />
            )} 
          />
          {errors.title && <small className="p-error p-d-block p-mt-1">{errors.title.message}</small>}
        </div>

        {/* Campo Contenido con validación */}
        <div className="p-field p-mb-3">
          <label htmlFor="body" className="p-d-block p-mb-1">Contenido</label>
          <Controller 
            name="body"
            control={control} 
            rules={{ required: "El contenido es obligatorio" }} 
            render={({field, fieldState}) => (
              <InputTextarea 
                id={field.name} 
                rows={6} 
                {...field} 
                className={classNames({ 'p-invalid': fieldState.error })}
              />
            )} 
          />
          {errors.body && <small className="p-error p-d-block p-mt-1">{errors.body.message}</small>}
        </div>

        {/* Campo Tags */}
        <div className="p-field p-mb-3">
          <label htmlFor="tags" className="p-d-block p-mb-1">Tags (separados por coma)</label>
          <Controller 
            name="tags"
            control={control} 
            render={({field}) => (
              <Chips 
                id={field.name} 
                value={field.value} 
                onChange={(e)=>field.onChange(e.value)} 
                separator="," 
                allowDuplicate={false}
              />
            )} 
          />
        </div>

        {/* Botones de Acción */}
        <div className="p-mt-4 p-d-flex p-jc-end">
          <Button 
            label="Cancelar" 
            icon="pi pi-times" 
            className="p-button-secondary p-mr-2" 
            onClick={()=>navigate("/")} 
            type="button"
            disabled={isLoading}
          />
          <Button 
            label={isLoading ? "Guardando..." : "Guardar"} 
            icon="pi pi-check" 
            type="submit" 
            loading={isLoading}
            disabled={isLoading || isSubmitting}
          />
        </div>
      </form>
    </>
  );
};

export default PostForm;
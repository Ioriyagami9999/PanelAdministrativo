import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAddPostMutation, useUpdatePostMutation, useGetPostsQuery } from "../../api/dummyjsonApi";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Chips } from "primereact/chips";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";

type FormData = { title: string; body: string; tags: string[] };

const PostForm: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { control, handleSubmit, reset } = useForm<FormData>({ defaultValues: { title: "", body: "", tags: [] }});
  const [addPost] = useAddPostMutation();
  const [updatePost] = useUpdatePostMutation();
  const navigate = useNavigate();

  useEffect(()=> {
    // Si es edición, puedes cargar los datos desde el servidor (GET /posts/:id)
    // Si DummyJSON no tiene endpoint /posts/:id real en tu plan, podrías pre-cargar datos del listado.
  }, [id]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await updatePost({ id: Number(id), ...data }).unwrap();
      } else {
        await addPost(data as any).unwrap();
      }
      navigate("/");
    } catch (err) {
      // mostrar toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid p-p-4 p-shadow-2" style={{maxWidth:720}}>
      <h3>{isEdit ? "Editar" : "Crear"} publicación</h3>
      <label>Título</label>
      <Controller control={control} name="title" rules={{ required: true }} render={({field}) => <InputText {...field} />} />
      <label className="p-mt-2">Contenido</label>
      <Controller control={control} name="body" rules={{ required: true }} render={({field}) => <InputTextarea rows={6} {...field} />} />
      <label className="p-mt-2">Tags</label>
      <Controller control={control} name="tags" render={({field}) => <Chips value={field.value} onChange={(e)=>field.onChange(e.value)} />} />
      <div className="p-mt-3">
        <Button label="Guardar" type="submit" />
        <Button label="Cancelar" className="p-button-secondary p-ml-2" onClick={()=>navigate("/")} />
      </div>
    </form>
  );
};

export default PostForm;

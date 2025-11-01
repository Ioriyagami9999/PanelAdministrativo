import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useLoginMutation } from "../../api/dummyjsonApi";
import { useAppDispatch } from "../../hooks";
import { setCredentials } from "./authSlice";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import "./LoginPage.css";
type Form = {
  username: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { control, handleSubmit, formState } = useForm<Form>({
    defaultValues: {
      username: "kminchelle",
      password: "0lelplR",
    },
  });
  const { errors, isSubmitting } = formState;

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const toast = React.useRef<any>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: Form) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ token: res.accessToken, userName: res.username }));

      toast.current?.show({
        severity: "success",
        summary: "Inicio exitoso",
        detail: `Bienvenido, ${res.username}!`,
        life: 3000,
      });
      navigate("/");
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error de inicio",
        detail: err?.data?.message || "Credenciales inválidas",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <Card
        title="Iniciar sesión"
        subTitle="Accede al panel de publicaciones"
        className="shadow-3 w-full max-w-md mx-auto"
        style={{ borderRadius: "16px" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid space-y-4">
          {/* Usuario */}
          <div className="field">
            <label htmlFor="username" className="font-medium text-gray-700">
              Usuario
            </label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "El usuario es obligatorio" }}
              render={({ field, fieldState }) => (
                <span className="p-input-icon-left w-full">
                  <i className="pi pi-user" />
                  <InputText
                    id={field.name}
                    placeholder="Nombre de usuario"
                    className={classNames("w-full", { "p-invalid": fieldState.error })}
                    {...field}
                  />
                </span>
              )}
            />
            {errors.username && (
              <small className="p-error">{errors.username.message}</small>
            )}
          </div>

          {/* Contraseña */}
          <div className="field">
            <label htmlFor="password" className="font-medium text-gray-700">
              Contraseña
            </label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "La contraseña es obligatoria" }}
              render={({ field, fieldState }) => (
                <Password
                  id={field.name}
                  placeholder="Tu contraseña"
                  toggleMask
                  feedback={false}
                  className={classNames("w-full", { "p-invalid": fieldState.error })}
                  inputClassName="w-full"
                  {...field}
                />
              )}
            />
            {errors.password && (
              <small className="p-error">{errors.password.message}</small>
            )}
          </div>

          {/* Botón principal */}
          <Button
            label={isLoading ? "Ingresando..." : "Ingresar"}
            icon="pi pi-sign-in"
            loading={isLoading}
            className="w-full mt-4"
            type="submit"
            disabled={isSubmitting}
          />
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
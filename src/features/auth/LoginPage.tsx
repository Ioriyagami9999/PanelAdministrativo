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
import "../css/LoginPage.css";
import { User } from "../../utils/types";

type Form = {
  username: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { control, handleSubmit, formState, reset } = useForm<Form>({
    defaultValues: {
      username: "kminchelle",
      password: "0lelplR",
    },
  });

  const { errors, isSubmitting } = formState;
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const toast = React.useRef<Toast>(null);
  const navigate = useNavigate();

  /** ✅ Manejo del envío del formulario */
  const onSubmit = async (data: Form) => {
    try {
      const res = await login(data).unwrap();
      const { token, accessToken, refreshToken, ...userData } = res;

      dispatch(
        setCredentials({
          token: accessToken || token,
          user: userData as User,
        })
      );

      toast.current?.show({
        severity: "success",
        summary: "Inicio exitoso",
        detail: `Bienvenido, ${res.username}!`,
        life: 3000,
      });

      // Pequeña pausa antes de redirigir
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error de inicio",
        detail: err?.data?.message || "Credenciales inválidas",
        life: 3000,
      });
      reset({ password: "" });
    }
  };
  React.useEffect(() => {
  const container = document.querySelector(".login-page-container");
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement("span");
    particle.classList.add("particle");
    const size = Math.random() * 4 + 2; // tamaño 2-6px
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(particle);
  }
}, []);


  return (
    <div className="login-page-container">
      <Toast ref={toast} />

      <Card
        title=" Iniciar sesión"
        subTitle="Bienvenido al panel administrativo"
        className="login-card"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {/* --- Campo de Usuario --- */}
          <div className="login-field">
            <label htmlFor="username" className="login-label">
              Usuario
            </label>
            <Controller
              name="username"
              control={control}
              rules={{
                required: "El usuario es obligatorio",
                minLength: {
                  value: 3,
                  message: "Debe tener al menos 3 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <span className="p-input-icon-left w-full">
                  <i className="pi pi-user" />
                  <InputText
                    id={field.name}
                    placeholder="Nombre de usuario"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                    {...field}
                  />
                </span>
              )}
            />
            {errors.username && (
              <small className="p-error">{errors.username.message}</small>
            )}
          </div>

          {/* --- Campo de Contraseña --- */}
          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Contraseña
            </label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <Password
                  id={field.name}
                  placeholder="Tu contraseña"
                  toggleMask
                  feedback={false}
                  className={classNames("w-full", {
                    "p-invalid": fieldState.error,
                  })}
                  inputClassName="w-full"
                  {...field}
                />
              )}
            />
            {errors.password && (
              <small className="p-error">{errors.password.message}</small>
            )}
          </div>

          {/* --- Botón de Envío --- */}
          <Button
            label={isLoading ? "Ingresando..." : "Ingresar"}
            icon="pi pi-sign-in"
            loading={isLoading}
            className="login-submit-button"
            type="submit"
            disabled={isSubmitting || isLoading}
          />
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;

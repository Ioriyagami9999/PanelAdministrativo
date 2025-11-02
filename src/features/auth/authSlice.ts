import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../utils/types";


interface AuthState { 
  token: string | null; 
  user: User | null; 
}


const getInitialUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      
      return JSON.parse(storedUser) as User;
    } catch (e) {
      console.error("Error al parsear el usuario guardado", e);
      return null;
    }
  }
  return null;
};


export const initialState: AuthState = { 
  token: localStorage.getItem("token") || null, 
  user: getInitialUser()
};

console.log("Initial auth state:", initialState);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    
    setCredentials(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
     
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    
    logout(state) {
      state.token = null;
      state.user = null; // Borramos el usuario
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Borramos el usuario
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
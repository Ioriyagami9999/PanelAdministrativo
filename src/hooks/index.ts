import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";

/**
 * Hook tipado para el dispatch de Redux Toolkit
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Hook tipado para acceder al estado global
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { ToastOptions, toast } from "react-toastify";

const DEFAULT_OPTIONS: ToastOptions = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: 1500,
};

export function toastSuccess(message: string, options?: ToastOptions): void {
  toast.success(message, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

export function toastError(message: string, options?: ToastOptions): void {
  toast.error(message, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

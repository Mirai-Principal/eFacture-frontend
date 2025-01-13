import Swal from "sweetalert2";

interface ToastProps {
  title: string;
}
export const Toast = (props: ToastProps) => {
  const title = props.title;
  const ToastInstance = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  ToastInstance.fire({
    icon: "success",
    title: title,
  });
};

export const Dialog = (title: string) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: title,
    showConfirmButton: false,
    timer: 1500,
  });
};

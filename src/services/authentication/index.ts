import { useMutation } from "@tanstack/react-query";
import { login } from "./request";

export const useLogin = () => {
  return useMutation({ mutationFn: login });
};

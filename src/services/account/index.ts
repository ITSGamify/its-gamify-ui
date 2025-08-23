import { useMutation } from "@tanstack/react-query";
import { updateAccount } from "./request";

export interface RequestAccountsParams {
  full_name: string;
  email: string;
  role_id: string;
  department_id: string;
  password: string;
  avatar_url: string;
}

export interface RequestUpdateAccountParams extends RequestAccountsParams {
  id: string;
}
export const useUpdateAccount = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: RequestUpdateAccountParams) => updateAccount(data),
    onSuccess,
  });
};

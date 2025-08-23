import { OptionField } from "@hooks/shared/useGetOptions";
import { Department } from "@interfaces/api/department";

export const departmentOptionField: OptionField<Department> = {
  labelField: "name",
  valueField: "id",
};

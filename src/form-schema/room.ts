import * as yup from "yup";

export interface RoomModalFormData {
  question_count: number;
  time_per_question: number;
  bet_points: number;
  challenge_id: string;
  host_user_id: string;
}

export const roomModalFormSchema: yup.ObjectSchema<RoomModalFormData> = yup
  .object()
  .shape({
    question_count: yup
      .number()
      .typeError("Số câu hỏi phải là số")
      .required("Số câu hỏi là bắt buộc"),
    bet_points: yup
      .number()
      .typeError("Số điểm cược phải là số")
      .required("Số điểm cược là bắt buộc"),
    time_per_question: yup
      .number()
      .typeError("Thời gian cho mỗi câu hỏi phải là số")
      .required("Thời gian cho mỗi câu hỏi là bắt buộc"),
    challenge_id: yup.string().required("Challenge ID là bắt buộc"),
    host_user_id: yup.string().required("Host user ID là bắt buộc"),
  });

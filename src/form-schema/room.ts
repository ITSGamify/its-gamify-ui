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
      .min(10, "Số câu hỏi tối thiểu là 10")
      .max(30, "Số câu hỏi tối đa là 30")
      .required("Số câu hỏi là bắt buộc"),
    bet_points: yup
      .number()
      .typeError("Số điểm cược phải là số")
      .min(100, "Số điểm cược tối thiểu là 100")
      .max(5000, "Số điểm cược tối đa là 5000")
      .required("Số điểm cược là bắt buộc"),
    time_per_question: yup
      .number()
      .typeError("Thời gian cho mỗi câu hỏi phải là số")
      .min(5, "Thời gian cho mỗi câu hỏi tối thiểu là 5 giây")
      .max(60, "Thời gian cho mỗi câu hỏi tối đa là 60 giây")
      .required("Thời gian cho mỗi câu hỏi là bắt buộc"),
    challenge_id: yup.string().required("Challenge ID là bắt buộc"),
    host_user_id: yup.string().required("Host user ID là bắt buộc"),
  });

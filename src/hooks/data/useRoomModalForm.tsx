import ToastContent from "@components/ui/atoms/Toast";
import { PATH } from "@constants/path";
import { yupResolver } from "@hookform/resolvers/yup";
import { Room } from "@interfaces/api/challenge";
import { useSignalR } from "@providers/SignalRContext";
import { useCreateRoom, useUpdateRoom } from "@services/room";
import { getRoute } from "@utils/route";
import userSession from "@utils/user-session";
import { useCallback, useMemo } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { roomModalFormSchema } from "src/form-schema/room";
import * as yup from "yup";

interface Props {
  room: Room | null;
  challengeId: string | null;
  onClose?: () => void;
  numOfQuestion?: number;
}

export interface RoomModalForm {
  name: string;
  question_count: number;
  time_per_question: number;
  bet_points: number;
  challenge_id: string;
  host_user_id: string;
  max_players: number;
}

export const useRoomModalForm = ({
  room,
  challengeId,
  onClose,
  numOfQuestion,
}: Props) => {
  const profile = userSession.getUserProfile();

  const roomModalFormSchema = useMemo(() => {
    return yup.object().shape({
      name: yup
        .string()
        .trim()
        .required("Vui lòng nhập tên phòng")
        .min(3, "Tên phòng cần có ít nhất 3 ký tự")
        .max(50, "Tên phòng không được quá 50 ký tự")
        .test(
          "no-whitespace-only",
          "Tên phòng không thể chỉ có khoảng trắng",
          (value) => {
            if (!value) return false;
            return value.trim().length > 0;
          }
        )
        .test(
          "no-multiple-spaces",
          "Tên phòng không được có nhiều khoảng trắng liên tiếp",
          (value) => {
            if (!value) return true; // Let required() handle empty values
            return !/\s{2,}/.test(value.trim());
          }
        )
        .test(
          "valid-characters",
          "Tên phòng chỉ được chứa chữ cái, số và khoảng trắng",
          (value) => {
            if (!value) return true; // Let required() handle empty values
            return /^[a-zA-ZÀ-ỹ0-9\s]+$/.test(value.trim());
          }
        ),
      question_count: yup
        .number()
        .typeError("Vui lòng nhập số câu hỏi hợp lệ")
        .min(1, "Cần có ít nhất 1 câu hỏi")
        .max(numOfQuestion || 20, `Tối đa ${numOfQuestion || 20} câu hỏi`)
        .required("Vui lòng nhập số câu hỏi"),
      bet_points: yup
        .number()
        .typeError("Vui lòng nhập số điểm cược hợp lệ")
        .min(50, "Số điểm cược tối thiểu là 50 điểm")
        .max(5000, "Số điểm cược tối đa là 5000 điểm")
        .required("Vui lòng nhập số điểm cược"),
      time_per_question: yup
        .number()
        .typeError("Vui lòng nhập thời gian hợp lệ")
        .min(10, "Thời gian tối thiểu là 10 giây/câu")
        .max(60, "Thời gian tối đa là 60 giây/câu")
        .required("Vui lòng nhập thời gian cho mỗi câu hỏi"),
      max_players: yup
        .number()
        .typeError("Vui lòng nhập số người chơi hợp lệ")
        .min(2, "Cần có ít nhất 2 người chơi")
        .max(10, "Tối đa 10 người chơi")
        .required("Vui lòng nhập số người chơi tối đa"),
      challenge_id: yup.string().required("Vui lòng chọn thử thách"),
      host_user_id: yup.string().required("Thông tin người tạo phòng bị thiếu"),
    });
  }, [numOfQuestion]);

  const navigate = useNavigate();
  const { control, handleSubmit, reset, watch } = useForm<RoomModalForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: room?.name || "",
      question_count: room?.question_count || 1,
      time_per_question: room?.time_per_question || 60,
      bet_points: room?.bet_points || 100,
      max_players: room?.max_players || 10,
      host_user_id: room?.host_user_id || profile?.user.id,
      challenge_id: room?.challenge_id || challengeId || "",
    },
    resolver: yupResolver(roomModalFormSchema) as Resolver<RoomModalForm>,
  });

  const { mutateAsync: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();

  const { connection } = useSignalR();

  const handleSave = useCallback(
    async (formData: RoomModalForm) => {
      const body = {
        name: formData.name,
        question_count: formData.question_count,
        time_per_question: formData.time_per_question,
        bet_points: formData.bet_points,
        challenge_id: formData.challenge_id,
        host_user_id: formData.host_user_id,
        max_players: formData.max_players,
      };

      const onSuccess = () => {
        toast.success(ToastContent, {
          data: {
            message: "Cập nhật thành công",
          },
        });
        reset();
      };

      if (room) {
        await updateRoom({ id: room.id, ...body }, { onSuccess });
        await connection?.invoke("GetRoomDetail", room.id);
        if (onClose) onClose();
      } else {
        const res = await createRoom({ ...body }, { onSuccess });
        const route = getRoute(PATH.TOURNAMENT_WAITING_ROOM, {
          roomId: res.id,
        });
        navigate(route);
      }
    },
    [room, reset, updateRoom, connection, onClose, createRoom, navigate]
  );

  return {
    isSubmitting: isCreating || isUpdating,
    bet_points: watch("bet_points"),
    handleSubmit: handleSubmit(handleSave),
    control,
  };
};

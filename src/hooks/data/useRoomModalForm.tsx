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
      question_count: yup
        .number()
        .typeError("Số câu hỏi phải là số")
        .min(1, "Số câu hỏi tối thiểu là 1")
        .max(numOfQuestion || 20, `Số câu hỏi tối đa là ${numOfQuestion || 20}`)
        .required("Số câu hỏi là bắt buộc"),
      bet_points: yup
        .number()
        .typeError("Số điểm cược phải là số")
        .min(50, "Số điểm cược tối thiểu là 50")
        .max(5000, "Số điểm cược tối đa là 5000")
        .required("Số điểm cược là bắt buộc"),
      time_per_question: yup
        .number()
        .typeError("Thời gian cho mỗi câu hỏi phải là số")
        .min(10, "Thời gian cho mỗi câu hỏi tối thiểu là 10 giây")
        .max(60, "Thời gian cho mỗi câu hỏi tối đa là 60 giây")
        .required("Thời gian cho mỗi câu hỏi là bắt buộc"),
      max_players: yup
        .number()
        .typeError("Số người chơi tối đa là số")
        .min(2, "Số người chơi tối thiểu là 2 giây")
        .max(10, "Số người chơi tối đa là 10 giây")
        .required("Số người chơi là bắt buộc"),
      challenge_id: yup.string().required("Challenge ID là bắt buộc"),
      host_user_id: yup.string().required("Host user ID là bắt buộc"),
    });
  }, [numOfQuestion]);

  const navigate = useNavigate();
  const { control, handleSubmit, reset, watch } = useForm<RoomModalForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
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
        await connection?.invoke("UpdateRoom", room.id);
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

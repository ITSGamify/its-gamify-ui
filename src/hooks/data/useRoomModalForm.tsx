import ToastContent from "@components/ui/atoms/Toast";
import { PATH } from "@constants/path";
import { yupResolver } from "@hookform/resolvers/yup";
import { Room } from "@interfaces/api/challenge";
import { useCreateRoom, useUpdateRoom } from "@services/room";
import { useGetUserMetric } from "@services/user";
import { getRoute } from "@utils/route";
import userSession from "@utils/user-session";
import { useCallback } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { roomModalFormSchema } from "src/form-schema/room";

interface Props {
  room: Room | null;
  challengeId: string | null;
}

export interface RoomModalForm {
  question_count: number;
  time_per_question: number;
  bet_points: number;
  challenge_id: string;
  host_user_id: string;
}

export const useRoomModalForm = ({ room, challengeId }: Props) => {
  const profile = userSession.getUserProfile();
  const navigate = useNavigate();
  const { control, handleSubmit, reset, watch } = useForm<RoomModalForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      question_count: room?.question_count || 10,
      time_per_question: room?.time_per_question || 60,
      bet_points: room?.bet_points || 100,
      host_user_id: room?.host_user_id || profile?.user.id,
      challenge_id: room?.challenge_id || challengeId || "",
    },
    resolver: yupResolver(roomModalFormSchema) as Resolver<RoomModalForm>,
  });

  const { mutateAsync: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();

  const handleSave = useCallback(
    async (formData: RoomModalForm) => {
      const body = {
        question_count: formData.question_count,
        time_per_question: formData.time_per_question,
        bet_points: formData.bet_points,
        challenge_id: formData.challenge_id,
        host_user_id: formData.host_user_id,
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
      } else {
        const res = await createRoom({ ...body }, { onSuccess });
        const route = getRoute(PATH.TOURNAMENT_WAITING_ROOM, {
          roomId: res.id,
        });
        navigate(route);
      }
    },
    [room, reset, updateRoom, createRoom, navigate]
  );

  const { data: userMetric, isFetching: isLoadingUserMetric } =
    useGetUserMetric(profile?.user.id || "");

  return {
    isLoading: isLoadingUserMetric,
    isSubmitting: isCreating || isUpdating,
    userMetric,
    bet_points: watch("bet_points"),
    handleSubmit: handleSubmit(handleSave),
    control,
  };
};

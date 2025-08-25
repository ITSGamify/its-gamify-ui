// src/components/modals/JoinRoomModal.tsx
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useJoinRoom } from "@services/room";
import { getRoute } from "@utils/route";
import { PATH } from "@constants/path";

interface JoinRoomModalProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  open,
  onClose,
  roomId,
}) => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const { mutateAsync: joinRoom, isPending: isJoining } = useJoinRoom();

  const handleJoin = useCallback(async () => {
    if (!roomId || !roomCode) return;
    const body = {
      id: roomId,
      room_code: roomCode,
    };
    const onSuccess = () => {
      setRoomCode("");

      const route = getRoute(PATH.TOURNAMENT_WAITING_ROOM, { roomId: roomId });
      navigate(route);
    };
    await joinRoom({ ...body }, { onSuccess });
  }, [joinRoom, navigate, roomCode, roomId]);

  const handleClose = useCallback(() => {
    if (isJoining) return;
    onClose();
  }, [isJoining, onClose]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Tham gia phòng</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Mã phòng"
          type="text"
          fullWidth
          variant="standard"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button disabled={isJoining} onClick={handleJoin}>
          {isJoining ? "Đang tham gia..." : "Tham gia"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinRoomModal;

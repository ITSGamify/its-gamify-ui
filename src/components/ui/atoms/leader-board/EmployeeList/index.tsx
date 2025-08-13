import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";

interface Employee {
  name: string;
  role: string;
  avatarInitials: string;
}

interface EmployeeListProps {
  employees: Employee[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
  return (
    <List sx={{ mt: 4 }}>
      {employees.map((emp, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar
              sx={{ bgcolor: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {emp.avatarInitials}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={emp.name} secondary={emp.role} />
        </ListItem>
      ))}
    </List>
  );
};

export default EmployeeList;

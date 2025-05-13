import UserAvatar from "@/components/molecules/user-avatar";
import { Box } from "@mui/material";

const UserAvatarField = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <UserAvatar editable={true} />
    </Box>
  );
};

export default UserAvatarField;

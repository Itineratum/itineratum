import endpointsConst from "@/constants/pages/endpoints.json";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useEffect } from "react";
import ButtonMenu from "./button-menu";

const ProfileIcon = ({ locale }: { locale: string }) => {
  const id: string = "profile-icon";
  const profileIconMenu: Record<string, string> = {};

  useEffect(() => {
    endpointsConst.profileIcon.actions.map((profileAction) => {
      profileIconMenu[profileAction.endpoint] = profileAction.name;
    });
  }, []);

  return (
    <ButtonMenu
      id={id}
      icon={<PersonOutlineOutlinedIcon />}
      menuItems={profileIconMenu}
      useLink={true}
      locale={locale}
    />
  );
};

export default ProfileIcon;

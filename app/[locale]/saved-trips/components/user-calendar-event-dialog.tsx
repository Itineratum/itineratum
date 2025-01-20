import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { CalendarEvent } from "@/constants/types/calendarEvent";
import { Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

const UserCalendarEventDialog = ({
  open,
  setOpen,
  calendarEvent,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  calendarEvent: CalendarEvent;
}) => {
  const t = useTranslations("savedTrips.userCalendarEventDialog");

  const spacing = 2;

  const handleOnClose = () => {
    setOpen(false);
  };

  const title = () => {
    return <DialogTitle>{calendarEvent.title}</DialogTitle>;
  };

  const startDate = () => {
    return (
      <Stack direction="row" spacing={spacing}>
        <Text
          text={t("startDate") + ":"}
          variant={TypographyVariant.h6}
          bold={true}
        />
        <Text
          text={dayjs(calendarEvent.start).format("dddd, D MMMM YYYY, h:mm A")}
          variant={TypographyVariant.h6}
          bold={false}
        />
      </Stack>
    );
  };

  const endDate = () => {
    return (
      <Stack direction="row" spacing={spacing}>
        <Text
          text={t("endDate") + ":"}
          variant={TypographyVariant.h6}
          bold={true}
        />
        <Text
          text={dayjs(calendarEvent.end).format("dddd, D MMMM YYYY, h:mm A")}
          variant={TypographyVariant.h6}
          bold={false}
        />
      </Stack>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      fullScreen={false}
      fullWidth={true}
    >
      {title()}
      <DialogContent>
        {startDate()}
        {endDate()}
      </DialogContent>
    </Dialog>
  );
};

export default UserCalendarEventDialog;

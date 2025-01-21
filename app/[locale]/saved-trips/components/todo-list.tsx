import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { ToDo } from "@/constants/types/toDo";
import AddIcon from "@mui/icons-material/Add";
import { Box, CircularProgress, IconButton, List, Stack } from "@mui/material";
import { ObjectId } from "mongodb";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ToDoItem from "./todo-item";

const ToDoList = ({
  setShowAddToDoDialog,
}: {
  setShowAddToDoDialog: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("savedTrips");
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [checkedToDoIds, setCheckedToDoIds] = useState<ObjectId[]>([]);

  const spacing = 2;
  const maxHeight = "592px";

  const getUserToDoList = trpc.user.getUserToDoList.useQuery(
    {
      email: session?.user.email!,
    },
    { enabled: isLoggedIn },
  );

  useEffect(() => {
    if (getUserToDoList.data) {
      setToDos(getUserToDoList.data);
      setCheckedToDoIds(
        getUserToDoList.data
          .filter((toDo: ToDo) => toDo.isComplete)
          .map((toDo: ToDo) => toDo._id),
      );
    }
  }, [getUserToDoList.data]);

  const titleAddButton = () => {
    const title = () => {
      return (
        <Text
          text={t("toDo") + ":"}
          variant={TypographyVariant.h5}
          bold={true}
        />
      );
    };

    const addButton = () => {
      const handleOnClick = () => {
        setShowAddToDoDialog(true);
      };

      return (
        <IconButton
          onClick={handleOnClick}
          sx={{ color: colorsConst.palette.text.primary }}
        >
          <AddIcon />
        </IconButton>
      );
    };

    return (
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        {title()}
        {addButton()}
      </Box>
    );
  };

  const toDoItems = () => {
    const loadingAnimationSize = 24;

    if (getUserToDoList.isLoading) {
      return (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={loadingAnimationSize} />
        </Box>
      );
    }

    if (toDos.length === 0) {
      return (
        <Text text={t("noToDos")} variant={TypographyVariant.h6} bold={false} />
      );
    }

    return (
      <List sx={{ maxHeight, overflow: "auto" }}>
        {toDos.map((toDo) => (
          <ToDoItem
            key={JSON.stringify(toDo._id)}
            toDo={toDo}
            checkedToDoIds={checkedToDoIds}
            setCheckedToDoIds={setCheckedToDoIds}
          />
        ))}
      </List>
    );
  };

  return (
    <Stack direction="column" spacing={spacing}>
      {titleAddButton()}
      {toDoItems()}
    </Stack>
  );
};

export default ToDoList;

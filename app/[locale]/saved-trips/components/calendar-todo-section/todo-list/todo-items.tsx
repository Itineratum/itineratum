import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { ToDo } from "@/constants/types/toDo";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { Box, CircularProgress, List } from "@mui/material";
import { ObjectId } from "bson";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SAVED_TRIPS_STYLES } from "../../styles";
import ToDoItem from "./todo-item";

const ToDoItems = () => {
  const { data: session } = useSession();
  const { isLoggedIn } = useSavedTrips();

  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [checkedToDoIds, setCheckedToDoIds] = useState<ObjectId[]>([]);

  const t = useTranslations("savedTrips");
  const styles = SAVED_TRIPS_STYLES.CALENDAR_TODO_SECTION.TODO_LIST;

  const getUserToDoList = trpc.user.getUserToDoList.useQuery(
    {
      email: session?.user.email!,
    },
    { enabled: isLoggedIn }
  );

  useEffect(() => {
    if (getUserToDoList.data) {
      setToDos(getUserToDoList.data);
      setCheckedToDoIds(
        getUserToDoList.data
          .filter((toDo: ToDo) => toDo.isComplete)
          .map((toDo: ToDo) => toDo._id)
      );
    }
  }, [getUserToDoList.data]);

  if (getUserToDoList.isLoading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
      </Box>
    );
  }

  if (toDos.length === 0) {
    return (
      <Text text={t("noToDos")} variant={TypographyVariant.h6} bold={false} />
    );
  }

  return (
    <List sx={{ maxHeight: styles.MAX_HEIGHT, overflow: "auto" }}>
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

export default ToDoItems;

import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { ToDo } from "@/constants/types/toDo";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

const ToDoList = ({
  setShowAddToDoDialog,
}: {
  setShowAddToDoDialog: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("savedTrips");
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [checkedToDoIndices, setCheckedToDoIndices] = useState<number[]>([0]);

  const spacing = 2;
  const maxHeight = "592px";

  const getUserToDoList = trpc.user.getUserToDoList.useQuery(
    {
      email: session?.user.email!,
    },
    { enabled: isLoggedIn },
  );
  const checkUserToDo = trpc.user.checkUserToDo.useMutation();

  useEffect(() => {
    if (getUserToDoList.data && getUserToDoList.data.length > 0) {
      setToDos(getUserToDoList.data);
      setCheckedToDoIndices(
        getUserToDoList.data
          .map((toDo: ToDo, index: number) => (toDo.isComplete ? index : -1))
          .filter((index: number) => index !== -1),
      );
    }
  }, [getUserToDoList.data]);

  const handleOnChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const isChecked = event.target.checked;
    const newCheckedToDos = [...checkedToDoIndices];
    const data = {
      email: session?.user.email!,
      toDoIndex: index,
      toDoIsComplete: isChecked,
    };
    await checkUserToDo.mutateAsync(data);

    if (isChecked) {
      newCheckedToDos.push(index);
    } else {
      const currentIndex = checkedToDoIndices.indexOf(index);
      newCheckedToDos.splice(currentIndex, 1);
    }

    setCheckedToDoIndices(newCheckedToDos);
  };

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
        {toDos.map((toDo, index) => (
          <ListItem key={index}>
            <ListItemButton dense>
              <ListItemIcon>
                <Checkbox
                  checked={checkedToDoIndices.includes(index)}
                  sx={{ color: colorsConst.palette.text.primary }}
                  onChange={(event) => handleOnChange(event, index)}
                />
              </ListItemIcon>
              <ListItemText>
                <Text
                  text={toDo.toDo}
                  variant={TypographyVariant.h6}
                  bold={false}
                  textDecoration={TypographyTextDecoration.underline}
                />
              </ListItemText>
            </ListItemButton>
          </ListItem>
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

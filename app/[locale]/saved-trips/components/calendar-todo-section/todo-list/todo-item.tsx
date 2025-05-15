import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import TextInputField from "@/components/molecules/text-input-field";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { AddToDoFormData } from "@/constants/types/formData/addToDoFormData";
import { ToDo } from "@/constants/types/toDo";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  Checkbox,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { ObjectId } from "mongodb";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ToDoItem = ({
  toDo,
  checkedToDoIds,
  setCheckedToDoIds,
}: {
  toDo: ToDo;
  checkedToDoIds: ObjectId[];
  setCheckedToDoIds: React.Dispatch<React.SetStateAction<ObjectId[]>>;
}) => {
  const t = useTranslations("savedTrips.toDoItem");
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<AddToDoFormData>({
    defaultValues: {
      name: toDo.name,
    },
  });

  const [modifyMode, setModifyMode] = useState<boolean>(false);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadingAnimationSize = 24;
  const spacing = 2;
  const height = "60px";

  const nameId = "name";
  const name = watch(nameId);

  const modifyUserToDo = trpc.user.modifyUserToDo.useMutation();
  const deleteUserToDo = trpc.user.deleteUserToDo.useMutation();
  const utils = trpc.useUtils();

  const checkbox = () => {
    const handleOnClick = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const isChecked = event.target.checked;
      const newCheckedToDos = [...checkedToDoIds];
      toDo.isComplete = isChecked;
      const data = {
        email: session?.user.email!,
        modifiedToDo: toDo,
      };
      await modifyUserToDo.mutateAsync(data);

      if (isChecked) {
        newCheckedToDos.push(toDo._id!);
      } else {
        const currentIndex = checkedToDoIds.indexOf(toDo._id!);
        newCheckedToDos.splice(currentIndex, 1);
      }

      setCheckedToDoIds(newCheckedToDos);
    };

    return (
      <Checkbox
        checked={checkedToDoIds.includes(toDo._id!)}
        sx={{ color: colorsConst.palette.text.primary }}
        onChange={handleOnClick}
      />
    );
  };

  const toDoName = () => {
    if (modifyMode) {
      return (
        <TextInputField
          name={nameId}
          label={t("nameDescription")}
          control={control}
          errorMessage={t("nameError")}
          errors={errors}
          value={name}
        />
      );
    }

    return (
      <Text
        text={toDo.name}
        variant={TypographyVariant.h6}
        bold={false}
        textDecoration={TypographyTextDecoration.underline}
      />
    );
  };

  const modifyButton = () => {
    const handleOnClick = () => {
      setModifyMode(true);
    };

    return (
      !modifyMode && (
        <IconButton
          onClick={handleOnClick}
          sx={{ color: colorsConst.palette.text.primary }}
        >
          <EditIcon />
        </IconButton>
      )
    );
  };

  const saveButton = () => {
    const handleOnClick = async () => {
      if (name === toDo.name) {
        setModifyMode(false);
        return;
      }

      const nameValid = await trigger(nameId);

      if (!nameValid) return;

      setIsModifying(true);
      const modifiedToDo: ToDo = {
        name,
        isComplete: toDo.isComplete,
        _id: toDo._id,
      };
      const data = {
        email: session?.user.email!,
        modifiedToDo,
      };
      await modifyUserToDo.mutateAsync(data);
      setIsModifying(false);
      setModifyMode(false);
      utils.user.invalidate();
    };

    return (
      modifyMode && (
        <IconButton
          onClick={handleOnClick}
          sx={{ color: colorsConst.palette.text.primary }}
          disabled={isModifying}
        >
          {isModifying ? (
            <CircularProgress size={loadingAnimationSize} />
          ) : (
            <SaveIcon />
          )}
        </IconButton>
      )
    );
  };

  const deleteButton = () => {
    const handleOnClick = async () => {
      setIsDeleting(true);
      const data = {
        email: session?.user.email!,
        toDoId: toDo._id,
      };
      await deleteUserToDo.mutateAsync(data);
      utils.user.invalidate();
      setIsDeleting(false);
    };

    return (
      !modifyMode && (
        <IconButton
          onClick={handleOnClick}
          sx={{ color: colorsConst.palette.text.primary }}
        >
          {isDeleting ? (
            <CircularProgress size={loadingAnimationSize} />
          ) : (
            <DeleteIcon />
          )}
        </IconButton>
      )
    );
  };

  return (
    <ListItem
      key={JSON.stringify(toDo._id)}
      sx={{ height }}
      secondaryAction={
        <Stack direction="row" spacing={spacing}>
          {modifyButton()}
          {saveButton()}
          {deleteButton()}
        </Stack>
      }
    >
      <ListItemButton dense>
        {!modifyMode && <ListItemIcon>{checkbox()}</ListItemIcon>}
        <ListItemText>{toDoName()}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default ToDoItem;

import { ObjectId } from "mongodb";

export interface ToDo {
  name: string;
  isComplete: boolean;
  _id: ObjectId | null;
}

import { changeLocalData } from "./local-data.js";

export function deleteElementLocal(data, id) {
  const result = data.filter((el) => el.id !== id);
  changeLocalData(result);
}

export function addElementLocal(data, newData) {
  const result = [newData, ...data];
  changeLocalData(result);
}

export function editElementLocal(data, editedData) {
  const result = data.map((el) => {
    if (el.id === editedData.id) {
      return editedData;
    } else {
      return el;
    }
  });

  changeLocalData(result);
}
 
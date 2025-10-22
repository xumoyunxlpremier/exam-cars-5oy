import { changeLocalData, localData } from "./local-data.js"

export function deleteElementLocal(id) {
    const result = localData.filter((element) => element.id != id)
    changeLocalData(result)
}

export function addElementLocal(newData) {
    const result = [newData, ...localData];
    changeLocalData(result)
}

export function editElementLocal(editedData) {
    const result = localData.map((element) => {
        if (element.id === editedData.id) {
            return editedData
        } else {
            return element;
        }
    })

    changeLocalData(result)
}
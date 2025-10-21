const baseURL = "https://json-api.uz/api/project/fn44";

//All
export async function getAll(query = "") {
  try {
    const req = await fetch(baseURL + `/cars${query ? query : ""}`);
    const res = await req.json();
    return res;
  } catch {
    throw new Error("Ma'lumotlarni olishda xatolik boldi");
  }
}

//getByID
export async function getById(id) {
  try {
    const req = await fetch(baseURL + `/cars/${id}`);
    const res = await req.json();
    return res;
  } catch {
    throw new Error("Malumotni olishda xatolik boldi");
  }
}

//Add element
export async function addElement(newData) {
  try {
    const token = localStorage.getItem("token");
    const req = await fetch(baseURL + "/cars", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    });
    const res = await req.json();
    return res;
  } catch {
    throw new Error("Malumot qoshishda xatolik boldi");
  }
}

//Edit element
export async function editElement(editedData) {
  try {
    const token = localStorage.getItem("token");
    const req = await fetch(baseURL + `/cars/${editedData.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedData),
    });
    const res = await req.json();
    return res;
  } catch {
    throw new Error("Malumot tahrirlahda xatolik boldi");
  }
}

//Delete element
export async function deleteElement(id) {
  try {
    const token = localStorage.getItem("token");
    await fetch(baseURL + `/cars/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  } catch {
    throw new Error("Malumotni ochirishda xatolik boldi");
  }
}




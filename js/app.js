import { checkAuth } from "./check-auth.js";
import { deleteElementLocal, editElementLocal } from "./crud.js";
import { changeLocalData, localData } from "./local-data.js";
import { deleteElement, editedElement, getAll } from "./request.js";
import { createToast, deleteToast } from "./toast.js";
import { pagination, ui } from "./ui.js";

const limit = 12;
let skip = 0;

// let i = 114;

// const interval = setInterval(() => {
//   try {
//     deleteElement(i)
//     .then((id) => {
//         deleteElementLocal(id)
//     })
//     .catch(() => {})
//     .finally(() => {})
// } catch(error) {
//     console.log(error);   
// }

//   if (i >= 300) {
//     clearInterval(interval); // to'xtatish
//   }

//   i++;
// }, 1000);

const elOfflinePage = document.getElementById("networkError")
const elFilterTypeSelect = document.getElementById("filterTypeSelect")
const elFilterValueSelect = document.getElementById("filterValueSelect")
const elSearchInput = document.getElementById("searchInput")
const elLoader = document.getElementById("loader")
const elContainer = document.getElementById("carContainer")
const elEditForm = document.getElementById("editForm");
const elEditModal = document.getElementById("editModal");
const elEditedElementTitle = document.getElementById("editedElementTitle")
const elPagination = document.getElementById("pagination");
const elNoDataInfo = document.getElementById("noDataInfo")
const elNoData = document.getElementById("noData")
const elAnswerModal = document.getElementById("answerModal")

let backendData = null;
let uiData = null
let worker = new Worker("./worker.js");
let filterKey = null;
let filterValue = null;
let editedElementId = null
let deleteElementId = null;



window.addEventListener("DOMContentLoaded", () => {
    if (window.navigator.onLine === false) {
        elOfflinePage.classList.remove("hidden")
        elOfflinePage.classList.add("flex");
    } else {
        elOfflinePage.classList.add("hidden")
        elOfflinePage.classList.remove("flex");
    }


    elLoader.classList.remove("hidden")
    elLoader.classList.add("grid")
    getAll()
    .then((res) => {
        backendData = res;
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
    })

    getAll(`?limit=${limit}&skip=${skip}`)
    .then((res) => {
        pagination(res.total, res.limit, res.skip);
        changeLocalData(res.data)
        createToast("true" ,"Ma'lumotlar muvaffaqiyatli keldi")
    }) 
    .catch((error) => {
        elNoData.classList.remove("hidden")
        elNoData.classList.add("no-data")
        elNoDataInfo.innerText = "Ma'lumotlar mavjud emas";
        elPagination.classList.add("hidden")
        createToast("error" ,"Ma'lumotlarni olishda xatolik bo'ldi!")
    })
    .finally(() => {
        elLoader.classList.add("hidden")
        elLoader.classList.remove("grid")
    })
})

elFilterTypeSelect.addEventListener("change", (evt) => {
    const value = evt.target[evt.target.selectedIndex].value;
    filterKey = value
    worker.postMessage({
        functionName: "filterByType",
        params: [backendData.data, value],
    })
})

elFilterValueSelect.addEventListener("change", (evt) => {
    const value = evt.target[evt.target.selectedIndex].value;
    filterValue = value;

    const elContainer = document.getElementById("carContainer")
    elContainer.innerHTML = ""

    if (filterKey && filterValue) {
        elLoader.classList.remove("hidden")
        elLoader.classList.add("grid")
        getAll(`?${filterKey}=${filterValue}`)
        .then((res) => {
            ui(res.data)
        })
        .catch((error) => {
            alert(error.message)
        })
        .finally(() => {
            elLoader.classList.add("hidden")
            elLoader.classList.remove("grid")
        })
    }
})

elSearchInput.addEventListener("input", (evt) => {
    const key = evt.target.value;

    worker.postMessage({
        functionName: "search",
        params: [backendData.data, key],
    })
})

worker.addEventListener("message", (evt) => {
    
    // Select
    const response = evt.data;
    const result = response.result;

    if (response.target === "filterByType") {
        elFilterValueSelect.classList.remove("hidden")
        
        const option = document.createElement("option")
        option.selected = true;
        option.disabled = true;
        option.textContent = "Hammasi"
        elFilterValueSelect.appendChild(option)

        elFilterValueSelect.innerHTML = "";
        result.forEach(element => {
            const option = document.createElement("option")
            option.textContent = element;
            option.value = element;
            elFilterValueSelect.appendChild(option)
        });   
    } else if(response.target === "search"){
        const elContainer = document.getElementById("carContainer")
        elContainer.innerHTML = null;
        if (response.result.length > 0) {
            elNoData.classList.add("hidden")
            elNoData.classList.remove("no-data")
            elPagination.classList.remove("hidden")
            elNoDataInfo.innerText = ""
            ui(response.result)
        } else {
            elContainer.innerHTML = "";
            elNoData.classList.remove("hidden")
            elNoData.classList.add("no-data")
            elPagination.classList.add("hidden")
            elNoDataInfo.innerText = "Bunday mashina mavjud emas"
        }
        
    }
})

window.addEventListener("online", () => {
    elOfflinePage.classList.add("hidden");
    elOfflinePage.classList.remove("flex");
})

window.addEventListener("offline", () => {
    elOfflinePage.classList.remove("hidden");
    elOfflinePage.classList.add("flex");
})

elContainer.addEventListener("click", (evt) => {
    const target = evt.target;

    // Info
    // if (target.classList.contains("js-info")) {
        
    // }

    // Edit
    if (target.classList.contains("js-edit")) {
        if (checkAuth()) {
            editedElementId = target.id
            elEditModal.showModal()
            const foundElement = localData.find((element) => element.id == target.id)
            
            elEditForm.name.value = foundElement.name;
            elEditedElementTitle.innerText = foundElement.name
            elEditForm.description.value = foundElement.description;
        } else {
            createToast("error" ,"Ro'yhatdan o'tishingiz kerak!")
            setTimeout(() => {
                window.location.href = "/pages/login.html"
            }, 2000)
        }
    }

    // Delete
    if (target.classList.contains("js-delete")) {
        if (checkAuth()) {
            elContainer.classList.add("hidden")
            elPagination.classList.add("hidden")
            elContainer.classList.remove("grid")
            elAnswerModal.classList.remove("hidden")
            elAnswerModal.classList.add("answer-modal")
            deleteElementId = target.id;
        } else {
            createToast("error" ,"Ro'yhatdan o'tishingiz kerak!")
            setTimeout(() => {
                window.location.href = "/pages/login.html"
            }, 2000)
        }
    }
})

elEditForm.addEventListener("submit", (evt) => {
    evt.preventDefault()


    createToast("loading", "Ma'lumot tahrirlanmoqda")

    const formData = new FormData(elEditForm);
    const result = {};

    formData.forEach((value, key) => {
        result[key] = value;
    })

    if (editedElementId) {
        result.id = editedElementId;
        editedElement(result)
        .then((res) => {
            editElementLocal(res);
        })
        .catch(() => {})
        .finally(() => {
            editedElementId = null;
            elEditModal.close()
            createToast("true", "Ma'lumot muvaffaqiyatli tahrirlandi!")
        })
    }
})

// Pagination
elPagination.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("js-page")) {
        skip = evt.target.dataset.skip;
        elContainer.innerHTML = ""
        elLoader.classList.remove("hidden")
        elLoader.classList.add("grid")
        getAll(`?limit=${limit}&skip=${skip}`)
        .then((res) => {
            ui(res.data)
            pagination(res.total, res.limit, res.skip);
        })
        .catch((error) => {
            alert(error.message)
        })
        .finally(() => {
            elLoader.classList.add("hidden")
            elLoader.classList.remove("grid")
        })
    }
})

// Answer modal
elAnswerModal.addEventListener("click", (evt) => {
    const target = evt.target

    if (target.classList.contains("js-xa")) {    
        elContainer.classList.remove("hidden")
        elPagination.classList.remove("hidden")
        elContainer.classList.add("grid")
        elAnswerModal.classList.add("hidden")
        elAnswerModal.classList.remove("answer-modal")
        createToast("loading", "Ma'lumot o'chirilmoqda")
        deleteElement(deleteElementId)
        .then((id) => {
            deleteToast()
            deleteElementLocal(id)
            createToast("true", "Ma'lumot muvaffaqiyatli o'chirildi")
        })
        .catch((error) => {
            createToast("error", error.message)
        })
        .finally(() => {
            deleteElementId = null;
        })      
    } else if(target.classList.contains("js-yoq")) {
        elContainer.classList.remove("hidden")
        elPagination.classList.remove("hidden")
        elContainer.classList.add("grid")
        elAnswerModal.classList.add("hidden")
        elAnswerModal.classList.remove("answer-modal")
        deleteElementId = null;
    }
})
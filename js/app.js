import { checkAuth } from "./check.auth.js";
import { changeLocalData } from "./local-data.js";
import { getAll } from "./request.js";
import { ui } from "./ui.js";

//Skeleton
function showLoader(count) {
  const elContainer = document.getElementById("container");
  const skeletonTemplate = document.getElementById("skeletonTemplate");

  elContainer.innerHTML = "";
  document.getElementById("noData").classList.add("hidden");

  for (let i = 0; i < count; i++) {
    const clone = skeletonTemplate.content.cloneNode(true);
    elContainer.appendChild(clone);
  }
}

function hideLoader() {
  document.getElementById("container").innerHTML = "";
}

//Modal
function showModal(title, message) {
  const modal = document.getElementById("modalInfo");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const closeBtn = document.getElementById("modalCloseBtn");

  modalTitle.textContent = title;
  modalMessage.textContent = message;

  modal.showModal();

  closeBtn.onclick = () => modal.close();
}
const elContainer = document.getElementById("container");
const elOfflinePage = document.getElementById("offlinePage");
const elFilterTypeSelect = document.getElementById("filterTypeSelect");
const elFilterValueSelect = document.getElementById("filterValueSelect");
const elSearchInput = document.getElementById("searchInput");

let backendData = null;
let worker = new Worker("./worker.js");
let filterKey = null;
let filterValue = null;

//Check internet
window.addEventListener("DOMContentLoaded", () => {
  if (window.navigator.onLine === false) {
    elOfflinePage.classList.remove("hidden");
  } else {
    elOfflinePage.classList.add("hidden");
  }

  showLoader(24);

  getAll()
    .then((res) => {
      backendData = res;
      changeLocalData(backendData.data);
      hideLoader();
    })
    .catch((error) => {
      hideLoader();
      showModal("Xatolik", error.message);
    });
});

//Type select
elFilterTypeSelect.addEventListener("change", (evt) => {
  const value = evt.target[evt.target.selectedIndex].value;
  filterKey = value;
  showLoader(24);
  worker.postMessage({
    functionName: "filterByType",
    params: [backendData.data, filterKey],
  });
});

//Value select
elFilterValueSelect.addEventListener("change", (evt) => {
  const value = evt.target[evt.target.selectedIndex].value;
  filterValue = value;

  const elContainer = document.getElementById("container");
  elContainer.innerHTML = null;

  if (filterKey && filterValue) {
    showLoader(24);
    getAll(`?${filterKey}=${filterValue}`)
      .then((res) => {
        hideLoader();
        ui(res.data);
      })
      .catch((error) => {
        hideLoader();
        showModal("Xatolik", error.message);
      });
  }
});

//Search
elSearchInput.addEventListener("input", (evt) => {
  const key = evt.target.value;
  showLoader(24);
  worker.postMessage({
    functionName: "search",
    params: [backendData.data, key],
  });
});

//Web worker
worker.addEventListener("message", (evt) => {
  console.log(evt);

  //Select
  const response = evt.data;

  if (response.target === "filterByType") {
    elFilterValueSelect.classList.remove("hidden");
    elFilterValueSelect.innerHTML = "";
    const option = document.createElement("option");
    option.selected = true;
    option.disabled = true;
    option.textContent = "All";
    elFilterValueSelect.appendChild(option);

    response.result.forEach((element) => {
      const option = document.createElement("option");
      option.textContent = element;
      option.value = element;
      elFilterValueSelect.appendChild(option);
    });
  } else if (response.target === "search") {
    hideLoader();
    const elContainer = document.getElementById("container");
    elContainer.innerHTML = null;

    if (response.result.length > 0) {
      document.getElementById("noData").classList.add("hidden");
      ui(response.result);
    } else {
      const elNoData = document.getElementById("noData");
      elNoData.classList.remove("hidden");
    }
  }
});

//Online
window.addEventListener("online", () => {
  elOfflinePage.classList.add("hidden");
});

//Offline
window.addEventListener("offline", () => {
  elOfflinePage.classList.remove("hidden");
});

//crud
elContainer.addEventListener("click", (evt) => {
  const target = evt.target;
  //Get
  if (target.classList.contains("js-info")) {
  }
  //Edit
  if (target.classList.contains("js-edit")) {
    if (checkAuth()) {
    } else {
      window.location.href = "/pages/login.html";
      alert(`Royhattan otishingiz kere brodar`);
    }
  }
  //Delete
  if (target.classList.contains("js-delete")) {
    if (checkAuth() && confirm("Rostan ochirmoqchimisiz>?")) {
    } else {
      window.location.href = "/pages/login.html";
      alert(`Royhattan otishingiz kere brodar`);
    }
  }
});

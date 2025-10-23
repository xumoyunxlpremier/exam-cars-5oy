import { checkAuth } from "../check-auth.js"
import { editElementLocal } from "../crud.js"
import { editedElement } from "../request.js"
import { createToast } from "../toast.js"

const elTitle = document.getElementById("name")
const elTrim = document.getElementById("trim")
const elGeneration = document.getElementById("generation")
const elYear = document.getElementById("year")
const elColor = document.getElementById("color")
const elColorName = document.getElementById("colorName")
const elCategory = document.getElementById("category")
const elDoorCount = document.getElementById("doorCount")
const elSeatCount = document.getElementById("seatCount")
const elMaxSpeed = document.getElementById("maxSpeed")
const elAcceleration = document.getElementById("acceleration")
const elEngine = document.getElementById("engine")
const elHorsePower = document.getElementById("horsepower")
const elFuelType = document.getElementById("fuelType")
const elCity = document.getElementById("city")
const elHighway = document.getElementById("highway")
const elCombined = document.getElementById("combined")
const elCountry = document.getElementById("country")
const elDescription = document.getElementById("description")
const elID = document.getElementById("id")
const elAslDet = document.getElementById("asldet")
const elSkeletonDet = document.getElementById("skeletoon")
const elEditButton = document.getElementById("editButton")
const elEditModal = document.getElementById("editModal");
const elEditForm = document.getElementById("editForm");
let editedElementId = null;
let findEl = null;
let elIDD = null;

async function getById(id) {
    elIDD = id;
    document.title = "Yuklanmoqda..."
    try {
        const req = await fetch(`https://json-api.uz/api/project/fn44/cars/${id}`)
        const res = await req.json()
        return res
    } catch {
        throw new Error("Ma'lumotni olishda xatolik bo'ldi")
    }
}

function set(el, value) {
  // qiymat bo‘sh bo‘lsa yoki yo‘q bo‘lsa
  if (value === undefined || value === null || String(value).trim() === "") {
    el.innerText = "no-data";
    return;
  }

  // agar raqam bo‘lishi shart bo‘lsa va raqam bo‘lmasa
  if (el.dataset.type === "number" && isNaN(Number(value))) {
    el.innerText = "no-data";
    return;
  }

  // normal holatda qiymatni qo‘yamiz
  el.innerText = value;
}


function ui(data) {
  findEl = data
  document.title = data.name;

  set(elTitle, data.name);
  set(elDescription, data.description);
  set(elTrim, data.trim);
  set(elGeneration, data.generation);
  set(elYear, data.year);
  set(elColorName, data.colorName);
  set(elCategory, data.category);
  set(elDoorCount, data.doorCount);
  set(elSeatCount, data.seatCount);
  set(elMaxSpeed, data.maxSpeed);
  set(elAcceleration, data.acceleration);
  set(elEngine, data.engine);
  set(elHorsePower, data.horsepower);
  set(elFuelType, data.fuelType);
  set(elCountry, data.country);
  set(elID, elIDD);

  // fuel consumption → 3 field
  set(elCity, data?.fuelConsumption?.city);
  set(elHighway, data?.fuelConsumption?.highway);
  set(elCombined, data?.fuelConsumption?.combined);

  // color style
  if (data.color.startsWith("#")) {
    elColor.style.background = data.color
  } else {
    elColor.style.borderRadius = "1px";
    elColor.style.width = "56px"
    elColor.innerText = "no-data"
  }
}


window.addEventListener("DOMContentLoaded", () => {
    const data = new URLSearchParams(location.search);
    const id = data.get("id");
    
    getById(id)
    .then((res) => {
        ui(res);
    })
    .catch(() => {})
    .finally(() => {
        elSkeletonDet.classList.add("hidden")
        elAslDet.classList.remove("hidden")
    })


})

elEditButton.addEventListener("click", () => {
  elEditForm.name.value = findEl.name; 
  elEditForm.description.value = findEl.description;
  elEditForm.trim.value = findEl.trim;
  elEditForm.generation.value = findEl.generation;
  elEditForm.year.value = findEl.year;
  elEditForm.color.value = findEl.color;
  elEditForm.colorName.value = findEl.colorName;
  elEditForm.category.value = findEl.category;
  elEditForm.doorCount.value = findEl.doorCount;
  elEditForm.seatCount.value = findEl.seatCount;
  elEditForm.maxSpeed.value = findEl.maxSpeed;
  elEditForm.acceleration.value = findEl.acceleration;
  elEditForm.engine.value = findEl.engine; 
  elEditForm.horsepower.value = findEl.horsepower; 
  elEditForm.fuelType.value = findEl.fuelType; 
  elEditForm.country.value = findEl.country;
  const {city, highway, combined} = findEl.fuelConsumption;
  elEditForm.city.value = city;
  elEditForm.highway.value = highway;
  elEditForm.combined.value = combined;
  
  if (checkAuth()) {
    elEditModal.showModal()
  } else {
    createToast("error" ,"Ro'yhatdan o'tishingiz kerak!")
    setTimeout(() => {
      window.location.href = "/pages/register.html"
    }, 2000)
  }
})

const form = document.getElementById("editForm");

elEditForm.addEventListener("submit", function (e) {
  e.preventDefault(); // submitni to'xtatish
  const fd = new FormData(form);
  const generalValues = {};
  const fuelConsumption = {};
  const errors = [];
  const fuelFields = ["city", "highway", "combined"];
  const numberFields = { year: { min: 1700, max: 2025 }, doorCount: { min: 1, max: 20 }, seatCount: { min: 1, max: 20 }, horsepower: { min: 1 } };
  for (let [name, value] of fd.entries()) {
    value = value.trim();
    if (value === "" || value.toLowerCase() === "undefined" || value.toLowerCase() === "null") {
      errors.push(`${name} kiritilmagan yoki noto'g'ri`);
      continue;
    }
    if (fuelFields.includes(name)) {
      fuelConsumption[name] = value;
      continue;
    }
    if (numberFields[name]) {
      const num = Number(value);
      if (!Number.isFinite(num)) { errors.push(`${name} raqam bo'lishi kerak`); continue; }
      if (numberFields[name].min !== undefined && num < numberFields[name].min) { errors.push(`${name} minimal ${numberFields[name].min}`); continue; }
      if (numberFields[name].max !== undefined && num > numberFields[name].max) { errors.push(`${name} maksimal ${numberFields[name].max}`); continue; }
      generalValues[name] = num;
      continue;
    }
    generalValues[name] = value;
  }
  if (errors.length){
    // createToast("error", `${errors}`)
    console.log(errors);
    
  } else {
    elEditModal.close()
  }
  generalValues.fuelConsumption = fuelConsumption;
  editedElementId = elIDD;
  if (editedElementId) {
    generalValues.id = editedElementId;
    createToast("loading", "Tahrirlanmoqda...")
    editedElement(generalValues)
    .then((res) => {
        location.reload();
        editElementLocal(res);
    })
    .catch(() => {})
    .finally(() => {
        editedElementId = null;
        elEditModal.close()
        createToast("true", "Ma'lumot muvaffaqiyatli tahrirlandi")
    })
  }
  
  elEditForm.name.value = "";
  elEditForm.name.value = ""; 
  elEditForm.description.value = "";
  elEditForm.trim.value = "";
  elEditForm.generation.value = "";
  elEditForm.year.value = "";
  elEditForm.color.value = "";
  elEditForm.colorName.value = "";
  elEditForm.category.value = "";
  elEditForm.doorCount.value = "";
  elEditForm.seatCount.value = "";
  elEditForm.maxSpeed.value = "";
  elEditForm.acceleration.value = "";
  elEditForm.engine.value = ""; 
  elEditForm.horsepower.value = ""; 
  elEditForm.fuelType.value = ""; 
  elEditForm.country.value = "";
  elEditForm.city.value = "";
  elEditForm.highway.value = "";
  elEditForm.combined.value = "";
});
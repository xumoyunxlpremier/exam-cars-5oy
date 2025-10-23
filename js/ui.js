export function ui(data) {
    const elContainer = document.getElementById("carContainer")
    elContainer.innerHTML = null;
    data.forEach(element => {
        const clone = document.getElementById("cardTemplate")
            .cloneNode(true).content;

        const elTitle = clone.querySelector(".name");
        const elYear = clone.querySelector(".year");
        const elColor = clone.querySelector(".color");
        const elMaxSpeed = clone.querySelector(".maxSpeed");
        const elHorsePower = clone.querySelector(".horsepower");
        const elFuelType = clone.querySelector(".fuelType");
        const elDescription = clone.querySelector(".description");

        // Buttons
        const elDeleteBtn = clone.querySelector(".js-delete");
        const elInfoBtn = clone.querySelector(".js-info");

        // elTitle.innerText = element.name;
        const nameTrimmed = element.name?.trim() || "";
        elTitle.innerText = nameTrimmed.length === 0 ? "no-data" : nameTrimmed;
        // Year
        let vaqtinchaYil = element.year;
        try {
            const num = Number(vaqtinchaYil);
            if (!isNaN(num) && num > 1700 && num < 2025) {
                elYear.innerText = num;
            } else {
                elYear.innerText = "no-data";
            }
        } catch {
            elYear.innerText = "no-data";
        }
        // Color
        // elColor.style.background = element.color;
        const color = element.color;

    if (color && color.startsWith("#")) {
        elColor.style.background = color;
        elColor.innerText = ""; // yozuv chiqmasin
    } else {
        elColor.classList.remove("color")
        elColor.innerText = "no-data";
    }

        // Max Speed
        const maxSpeedTrimmed = element.maxSpeed?.trim() || "";
        if (maxSpeedTrimmed.length > 0 && maxSpeedTrimmed.endsWith("km/h")) {
            elMaxSpeed.innerText = maxSpeedTrimmed;
        } else {
            elMaxSpeed.innerText = "no-data"
        }
        // Horse Power
        let vaqtincha = element.horsepower;
        try {
            if (Number(vaqtincha) && vaqtincha > 0) {
                elHorsePower.innerText = vaqtincha
            }

            if (vaqtincha == undefined) {
                elHorsePower.innerText = "no-data"
            }

            if (vaqtincha.length == 0) {
                elHorsePower.innerText = "no-data"
            }
        } catch {
            elHorsePower.innerText = "no-data"
        }
        // Fuel Type
        const fuelTypeTrimmed = element.fuelType?.trim() || "";
        elFuelType.innerText = fuelTypeTrimmed.length === 0 ? "no-data" : fuelTypeTrimmed;
        
        //  ID
        elDeleteBtn.id = element.id;
        elInfoBtn.href = `/pages/details.html?id=${element.id}`;

        if (!element.description || element.description.trim() === "") {
           elDescription.innerText = "no-data" 
        } else {
            elDescription.innerText = element.description
        }

        elContainer.appendChild(clone);
    });
}

export function pagination(total, limit, skip) {
    const elPagination = document.getElementById("pagination");
    const remained = total % limit;
    const pageCount = (total - remained) / limit
    const activePage = (skip / limit) + 1;

    elPagination.innerHTML = ""
    for(let i = 1; i <= pageCount; i++){
        const button = document.createElement("button")
        button.classList.add("join-item", "btn", "js-page")
        if (activePage === i) {
            button.classList.add("btn-active")
        }
        button.innerText = i;
        button.dataset.limit = limit;
        
        if(i > 1){
            button.dataset.skip = (limit * i) - limit
        }
        elPagination.appendChild(button)
    }

    if (remained > 0) {
        const button = document.createElement("button")
        button.classList.add("join-item", "btn", "js-page")
        button.innerText = pageCount + 1;
        if (activePage === pageCount + 1) {
            button.classList.add("btn-active");
        }
        button.dataset.skip = pageCount * limit;
        elPagination.appendChild(button)
    }
}
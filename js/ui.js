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
        const elEditBtn = clone.querySelector(".js-edit");
        const elInfoBtn = clone.querySelector(".js-info");

        elTitle.innerText = element.name;
        elYear.innerText = element.year;
        elColor.style.background = element.color;
        elMaxSpeed.innerText = element.maxSpeed;
        elHorsePower.innerText = element.horsepower;
        elFuelType.innerText = element.fuelType;
        
        //  ID
        elDeleteBtn.id = element.id;
        elEditBtn.id = element.id;
        elInfoBtn.href = `/pages/details.html?id=${element.id}`;
        elDescription.innerText = element.description;
        
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
{/* <li class="toastli loadingToast" id="maintoast">
    <p class="message"></p>
</li> */}

const elToastContainer = document.getElementById("toastContainer")

export function createToast(mode, message) {
    elToastContainer.innerHTML = "";
    const p = document.createElement("p");
    const li = document.createElement("li");
    const span = document.createElement("span")
    const pTime = document.createElement("p")

    p.textContent = message;
    li.classList.add("toastli");
    pTime.textContent = "4"
    span.appendChild(pTime)
    

    if (mode === "true") {
        li.classList.add("true")
        li.appendChild(p)
        li.appendChild(span)
    } else if(mode === "error") {
        li.classList.add("error")
        li.appendChild(p)
        li.appendChild(span)
    } else if(mode === "loading") {
        li.classList.add("loadingToast")
        li.appendChild(p)
    }

    elToastContainer.appendChild(li)

    let i = 4;
    setInterval(() => {
        i = i - 1;

        pTime.textContent = i;
        
        if (i == 0) {
            elToastContainer.removeChild(li);
        }
    }, 1000)

}

export function deleteToast() {
    elToastContainer.innerHTML = "";
}
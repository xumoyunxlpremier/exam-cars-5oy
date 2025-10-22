const elTitle = document.getElementById("name")
const elDescription = document.getElementById("description")

async function getById(id) {
    document.title = "Yuklanmoqda..."
    try {
        const req = await fetch(`https://json-api.uz/api/project/fn44/cars/${id}`)
        const res = await req.json()
        return res
    } catch {
        throw new Error("Ma'lumotni olishda xatolik bo'ldi")
    }
}

function ui(data) {
    document.title = data.name;
    elTitle.innerText = data.name;
    elDescription.innerText = data.description;
}

window.addEventListener("DOMContentLoaded", () => {
    const data = new URLSearchParams(location.search);
    const id = data.get("id");
    
    getById(id)
    .then((res) => {
        ui(res);
    })
    .catch(() => {})
    .finally(() => {})

})
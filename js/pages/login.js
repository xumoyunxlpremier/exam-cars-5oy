// login.js
async function login(user) {
  try {
    const req = await fetch("https://json-api.uz/api/project/fn44/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const res = await req.json();
    return res;
  } catch {
    throw new Error("Royhattan otishda xatolik boldi");
  }
}

const elForm = document.getElementById("form");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(elForm);
  const result = {};
  formData.forEach((value, key) => (result[key] = value));

  login(result)
    .then((res) => {
      // 🔥 Tokenni saqlash
      localStorage.setItem("token", res.access.token);

      // 🔥 Sahifani yo‘naltirish
      window.location.href = "../../index.html";
    })
    .catch((err) => {
      console.error("Login xatosi:", err);
    });
});

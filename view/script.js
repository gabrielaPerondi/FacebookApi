const API_FACEBOOK = "http://localhost:5295/api/Facebook";
const API_POST = "http://localhost:5295/api/Post";

// cadastrar usuario
const usuarioForm = document.getElementById("usuarioForm");
usuarioForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch(`${API_FACEBOOK}/CriaUsuario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });


        if (!response.ok) throw new Error("Erro ao cadastrar usuário");

        alert("Usuário cadastrado com sucesso!");
        usuarioForm.reset();
    } catch (err) {
        alert(err.message);
    }
});
// login de usuario
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    try {
        const response = await fetch(`${API_FACEBOOK}/Login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email: email, Senha: senha })
        });

        if (!response.ok) throw new Error("Email ou senha incorretos");

        const usuario = await response.json();

        document.getElementById("loginStatus").innerText = `Logado como: ${usuario.nome}`;
        localStorage.setItem("usuarioId", usuario.id); // salva para criar posts depois
        loginForm.reset();
    } catch (err) {
        alert(err.message);
    }
});
/// postar
const postForm = document.getElementById("postForm");
postForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const legenda = document.getElementById("legenda").value;
    const usuarioId = localStorage.getItem("usuarioId"); // pega do login
    const foto = document.getElementById("foto").files[0];

    if (!usuarioId) {
        alert("Você precisa estar logado para postar!");
        return;
    }

    const formData = new FormData();
    formData.append("Legenda", legenda);
    formData.append("UsuarioId", usuarioId);
    if (foto) formData.append("file", foto);

    try {
        const response = await fetch(`${API_POST}/upload`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Erro ao criar post");

        alert("Post criado com sucesso");
        postForm.reset();
        carregarPosts();
    } catch (err) {
        alert(err.message);
    }
});


// 
async function carregarPosts() {
    const container = document.getElementById("postsContainer");
    container.innerHTML = "";

    try {
        const response = await fetch(API_POST);
        if (!response.ok) throw new Error("Erro ao buscar posts");

        const posts = await response.json();
        posts.forEach(post => {
            const div = document.createElement("div");
            div.style.border = "1px solid #000";
            div.style.padding = "10px";
            div.style.margin = "10px 0";

            div.innerHTML = `
             <p><strong>Usuário:</strong> ${post.usuario?.nome ?? "Desconhecido"}</p>
                <p><strong>Legenda:</strong> ${post.legenda}</p>
                ${post.fotoUrl ? `<img src="http://localhost:5295${post.fotoUrl}" width="200" />` : ""}
            `;

            container.appendChild(div);
        });
    } catch (err) {
        container.innerHTML = `<p>${err.message}</p>`;
    }
}
carregarPosts();

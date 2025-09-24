const apiUrl = "http://localhost:5295/api/post"; // GET todos os posts
const apiPostUpload = "http://localhost:5295/api/post/upload"; // POST criar post


// Função para criar usuário
const usuarioForm = document.getElementById("usuarioForm");
usuarioForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch(`${apiUrl}/Facebook/CriaUsuario`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        if (!response.ok) throw new Error("Erro ao criar usuário");

        alert("Usuário criado com sucesso!");
        usuarioForm.reset();
    } catch (err) {
        alert(err.message);
    }
});

// função para criar post
const postForm = document.getElementById("postForm");
postForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const legenda = document.getElementById("legenda").value;
    const usuarioId = document.getElementById("usuarioId").value;
    const foto = document.getElementById("foto").files[0];

    const formData = new FormData();
    formData.append("Legenda", legenda);
    formData.append("UsuarioId", usuarioId);
    if (foto) formData.append("file", foto);

    try {
        const response = await fetch(`${API_BASE}/Post/upload`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Erro ao criar post");

        alert("Post criado com sucesso!");
        postForm.reset();
        carregarPosts(); // atualizar lista de posts
    } catch (err) {
        alert(err.message);
    }
});

// --------------- Função para listar posts ---------------
async function carregarPosts() {
    const container = document.getElementById("postsContainer");
    container.innerHTML = "";

    try {
        const response = await fetch(`${API_BASE}/Post`);
        if (!response.ok) throw new Error("Erro ao buscar posts");

        const posts = await response.json();
        posts.forEach(post => {
            const div = document.createElement("div");
            div.style.border = "1px solid #000";
            div.style.padding = "10px";
            div.style.margin = "10px 0";

            div.innerHTML = `
                <p><strong>Legenda:</strong> ${post.legenda}</p>
                <p><strong>Usuário:</strong> ${post.usuario?.nome}</p>
                ${post.fotoUrl ? `<img src="http://localhost:5295${post.fotoUrl}" width="200" />` : ""}
            `;

            container.appendChild(div);
        });
    } catch (err) {
        container.innerHTML = `<p>${err.message}</p>`;
    }
}

// Carregar posts ao iniciar
carregarPosts();

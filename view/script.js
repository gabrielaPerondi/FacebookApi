// const API_FACEBOOK = "http://localhost:5295/api/Facebook";
// const API_POST = "http://localhost:5295/api/Post";

// // cadastrar usuario
// const usuarioForm = document.getElementById("usuarioForm");
// usuarioForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const nome = document.getElementById("nome").value;
//     const email = document.getElementById("email").value;
//     const senha = document.getElementById("senha").value;

//     try {
//         const response = await fetch(`${API_FACEBOOK}/CriaUsuario`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ nome, email, senha })
//         });


//         if (!response.ok) throw new Error("Erro ao cadastrar usuário");

//         alert("Usuário cadastrado com sucesso!");
//         usuarioForm.reset();
//     } catch (err) {
//         alert(err.message);
//     }
// });
// // login de usuario
// const loginForm = document.getElementById("loginForm");
// loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const email = document.getElementById("loginEmail").value;
//     const senha = document.getElementById("loginSenha").value;

//     try {
//         const response = await fetch(`${API_FACEBOOK}/Login`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ Email: email, Senha: senha })
//         });

//         if (!response.ok) throw new Error("Email ou senha incorretos");

//         const usuario = await response.json();

//         document.getElementById("loginStatus").innerText = `Logado como: ${usuario.nome}`;
//         if (response.ok) {
//             const usuario = await response.json();
//             localStorage.setItem("usuarioId", usuario.id);
//             window.location.href = "home.html"; // redireciona para feed
//         }
//         function logout() {
//             localStorage.removeItem("usuarioId");
//             window.location.href = "login.html";
//         }


//         loginForm.reset();
//     } catch (err) {
//         alert(err.message);
//     }
// });


// /// postar
// const postForm = document.getElementById("postForm");
// postForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const legenda = document.getElementById("legenda").value;
//     const usuarioId = localStorage.getItem("usuarioId"); // pega do login
//     const foto = document.getElementById("foto").files[0];

//     if (!usuarioId) {
//         alert("Você precisa estar logado para postar!");
//         return;
//     }

//     const formData = new FormData();
//     formData.append("Legenda", legenda);
//     formData.append("UsuarioId", usuarioId);
//     if (foto) formData.append("file", foto);

//     try {
//         const response = await fetch(`${API_POST}/upload`, {
//             method: "POST",
//             body: formData
//         });

//         if (!response.ok) throw new Error("Erro ao criar post");

//         alert("Post criado com sucesso");
//         postForm.reset();
//         carregarPosts();
//     } catch (err) {
//         alert(err.message);
//     }
// });


// // 
// async function carregarPosts() {
//     const container = document.getElementById("postsContainer");
//     container.innerHTML = "";

//     try {
//         const response = await fetch(API_POST);
//         if (!response.ok) throw new Error("Erro ao buscar posts");

//         const posts = await response.json();
//         posts.forEach(post => {
//             const div = document.createElement("div");
//             div.style.border = "1px solid #000";
//             div.style.padding = "10px";
//             div.style.margin = "10px 0";

//             div.innerHTML = `
//              <p><strong>Usuário:</strong> ${post.usuario?.nome ?? "Desconhecido"}</p>
//                 <p><strong>Legenda:</strong> ${post.legenda}</p>
//                 ${post.fotoUrl ? `<img src="http://localhost:5295${post.fotoUrl}" width="200" />` : ""}
//             `;

//             container.appendChild(div);
//         });
//     } catch (err) {
//         container.innerHTML = `<p>${err.message}</p>`;
//     }
// }
// carregarPosts();



// async function carregarPosts() {
//     const container = document.getElementById("postsContainer");
//     container.innerHTML = "";

//     try {
//         const response = await fetch(API_POST); // GET /api/Post
//         if (!response.ok) throw new Error("Erro ao buscar posts");

//         const posts = await response.json();
//         posts.forEach(post => {
//             const div = document.createElement("div");
//             div.style.border = "1px solid #000";
//             div.style.padding = "10px";
//             div.style.margin = "10px 0";

//             div.innerHTML = `
//                 <p><strong>Usuário:</strong> ${post.usuario?.nome ?? "Desconhecido"}</p>
//                 <p><strong>Legenda:</strong> ${post.legenda}</p>
//                 ${post.fotoUrl ? `<img src="http://localhost:5295${post.fotoUrl}" width="200" />` : ""}
//                 <div style="margin-top:8px;">
//                   <button type="button" class="btn-delete" data-id="${post.id}">Excluir</button>
//                 </div>
//             `;

//             container.appendChild(div);
//         });

//         // adiciona listeners aos botões de excluir (depois que foram adicionados ao DOM)
//         container.querySelectorAll('.btn-delete').forEach(btn => {
//             btn.addEventListener('click', async (e) => {
//                 const id = btn.getAttribute('data-id');
//                 await deletarPost(id);
//             });
//         });

//     } catch (err) {
//         container.innerHTML = `<p>${err.message}</p>`;
//     }
// }


// async function deletarPost(id) {
//     if (!confirm(`Deseja realmente excluir o post ${id}?`)) return;

//     try {
//         // rota correta: DELETE /api/Post/{id}
//         const response = await fetch(`${API_POST}/${id}`, {
//             method: "DELETE"
//         });

//         if (!response.ok) {
//             // tenta ler mensagem de erro vinda do servidor
//             const text = await response.text();
//             throw new Error(text || "Erro ao deletar post");
//         }

//         // se a API retornar JSON com { message: "..."}
//         let result;
//         try { result = await response.json(); } catch { result = null; }

//         alert(result?.message ?? "Post deletado com sucesso");
//         carregarPosts(); // atualiza lista
//     } catch (error) {
//         console.error(error);
//         alert(error.message || "Não foi possível deletar o post");
//     }
// }



const API_FACEBOOK = "http://localhost:5295/api/Facebook";
const API_POST = "http://localhost:5295/api/Post";


// CADASTRO
const usuarioForm = document.getElementById("usuarioForm");
if (usuarioForm) {
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
      alert("Usuário cadastrado!");
      window.location.href = "login.html"; // redireciona p/ login
    } catch (err) {
      alert(err.message);
    }
  });
}
// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
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

      localStorage.setItem("usuarioId", usuario.id);
      window.location.href = "perfil.html"; // vai para feed
    } catch (err) {
      alert(err.message);
    }
  });
}

//perfil.html
const postForm = document.getElementById("postForm");
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const legenda = document.getElementById("legenda").value;
    const usuarioId = localStorage.getItem("usuarioId");
    const foto = document.getElementById("foto").files[0];

    if (!usuarioId) {
      alert("Você precisa estar logado!");
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

      alert("Post criado!");
      postForm.reset();
      carregarPosts();
    } catch (err) {
      alert(err.message);
    }
  });

  carregarPosts();
}

//Carregar posts

async function carregarPosts() {
  const container = document.getElementById("postsContainer");
  if (!container) return;

  container.innerHTML = "";

  try {
    const response = await fetch(API_POST);
    if (!response.ok) throw new Error("Erro ao buscar posts");

    const posts = await response.json();
    posts.forEach(post => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <p><strong>Usuário:</strong> ${post.usuario?.nome ?? "Desconhecido"}</p>
        <p><strong>Legenda:</strong> ${post.legenda}</p>
        ${post.fotoUrl ? `<img src="http://localhost:5295${post.fotoUrl}" width="200" />` : ""}
        <button class="btn-delete" data-id="${post.id}">Excluir</button>
      `;
      container.appendChild(div);
    });

    // Botões de excluir
    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        await deletarPost(btn.dataset.id);
      });
    });
  } catch (err) {
    container.innerHTML = `<p>${err.message}</p>`;
  }
}

// Deletar post
async function deletarPost(id) {
  if (!confirm(`Deseja excluir o post ${id}?`)) return;

  try {
    const response = await fetch(`${API_POST}/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error("Erro ao deletar post");
    alert("Post deletado!");
    carregarPosts();
  } catch (err) {
    alert(err.message);
  }
}

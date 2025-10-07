const API_FACEBOOK = "http://localhost:5295/api/Facebook";
const API_POST = "http://localhost:5295/api/Post";
const API_INTERACAO = "http://localhost:5295/api/Interacoes";

//CADASTRO 
const toggleSenha = document.getElementById('toggleSenha');
const senhaInput = document.getElementById('senha');

if (toggleSenha && senhaInput) {
  toggleSenha.addEventListener('change', () => {
    senhaInput.type = toggleSenha.checked ? 'text' : 'password';
  });
}

const usuarioForm = document.getElementById("cadastroForm");
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
        body: JSON.stringify({ Nome: nome, Email: email, Senha: senha })
      });
      if (!response.ok) throw new Error("Erro ao cadastrar usuário");
      alert("Usuário cadastrado!");
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

//  LOGIN 
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
      window.location.href = "perfil.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// -POSTAR
const postForm = document.getElementById("postForm");
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const legenda = document.getElementById("legenda").value;
    const usuarioId = localStorage.getItem("usuarioId");
    const foto = document.getElementById("foto").files[0];

    if (!usuarioId) return alert("Você precisa estar logado");
    if (!legenda && !foto) return alert("Digite algo ou adicione uma foto");

    const formData = new FormData();
    if (legenda) formData.append("Legenda", legenda);
    formData.append("UsuarioId", usuarioId);
    if (foto) formData.append("file", foto);

    try {
      const response = await fetch(`${API_POST}/upload`, { method: "POST", body: formData });
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

//  PESQUISA
let searchTerm = "";
const searchInput = document.getElementById("searchUser");
const btnSearch = document.getElementById("btnSearchUser");
const clearBtn = document.getElementById("clearSearch");

if (btnSearch) {
  btnSearch.addEventListener("click", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    carregarPosts();
  });
}

if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchTerm = searchInput.value.trim().toLowerCase();
      carregarPosts();
    }
  });

  searchInput.addEventListener("input", () => {
    clearBtn.style.display = searchInput.value.length > 0 ? "inline" : "none";
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.style.display = "none";
    searchInput.focus();
    searchTerm = "";
    carregarPosts();
  });
}

// carredar post-
async function carregarPosts() {
  const container = document.getElementById("postsContainer");
  if (!container) return;

  container.innerHTML = "";
  const usuarioId = localStorage.getItem("usuarioId");

  try {
    const response = await fetch(API_POST);
    if (!response.ok) throw new Error("Erro ao buscar posts");

    let posts = await response.json();

    // Mostrar posts mais recentes primeiro
    posts = posts.reverse();

    for (const post of posts) {
      if (searchTerm && !(post.usuario?.nome ?? "").toLowerCase().includes(searchTerm)) continue;

      const interacoesResp = await fetch(`${API_INTERACAO}/post/${post.id}`);
      const interacoes = interacoesResp.ok ? await interacoesResp.json() : [];

      const curtidas = interacoes.filter(i => i.tipo === "curtida").length;
      const comentarios = interacoes.filter(i => i.tipo === "comentario");
      const usuarioCurtiu = interacoes.some(i => i.tipo === "curtida" && i.usuario?.id == usuarioId);

      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <div class="post-header">
          <div>
            <span class="username">${post.usuario?.nome ?? "Desconhecido"}</span><br>
            <span class="post-subtitle">${post.legenda}</span>
          </div>
        </div>

        ${post.fotoUrl ? `<img src="http://localhost:5295${post.fotoUrl}" alt="imagem do post" />` : ""}

        <div class="actions">
          <button class="btn-like ${usuarioCurtiu ? 'liked' : ''}" data-id="${post.id}">
            Curtir (${curtidas})
          </button>
          ${post.usuario?.id == usuarioId ? `<button class="btn-delete" data-id="${post.id}">Excluir</button>` : ""}
        </div>

        <div class="comentarios">
          ${comentarios.map(c => `
            <div class="comment">
              
              <span><strong>${c.usuario?.nome ?? "Desconhecido"}:</strong> ${c.texto}</span>
              ${c.usuario?.id == usuarioId ? `<button class="btn-delete-comentario" data-id="${c.id}">Excluir</button>` : ""}
            </div>
          `).join("")}
        </div>

        <div class="comentar-box">
          <input type="text" id="comentario-${post.id}" placeholder="Escreva um comentário..." />
          <button type="button" class="btn-comentar" data-id="${post.id}">Comentar</button>
        </div>
      `;

      container.appendChild(div);
    }

    //eventos
    container.querySelectorAll('.btn-like').forEach(btn => {
      btn.addEventListener('click', async () => await curtirPost(btn.dataset.id, usuarioId, btn));
    });

    container.querySelectorAll('.btn-comentar').forEach(btn => {
      btn.addEventListener('click', async () => {
        const postId = btn.dataset.id;
        const comentario = document.getElementById(`comentario-${postId}`).value;
        if (!comentario.trim()) return alert("Digite um comentário!");

        const scrollPos = window.scrollY;
        await comentarPost(postId, usuarioId, comentario);
        await carregarPosts();
        window.scrollTo(0, scrollPos);
      });
    });

    container.querySelectorAll('.btn-delete-comentario').forEach(btn => {
      btn.addEventListener('click', async () => {
        const comentarioId = btn.dataset.id;
        if (!confirm("Deseja excluir este comentário?")) return;
        try {
          const response = await fetch(`${API_INTERACAO}/${comentarioId}/${usuarioId}`, { method: "DELETE" });
          if (!response.ok) throw new Error("Erro ao deletar comentário");
          btn.parentElement.remove();
        } catch (err) {
          alert(err.message);
        }
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => await deletarPost(btn.dataset.id));
    });

  } catch (err) {
    container.innerHTML = `<p>${err.message}</p>`;
  }
}

// deletar 
async function deletarPost(id) {
  const usuarioId = localStorage.getItem("usuarioId");
  if (!confirm(`Deseja excluir o post ${id}?`)) return;

  try {
    const response = await fetch(`${API_POST}/${id}/${usuarioId}`, { method: "DELETE" });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Erro ao deletar post");
    }
    alert("Post deletado!");
    carregarPosts();
  } catch (err) {
    alert(err.message);
  }
}

// -curtr
async function curtirPost(postId, usuarioId, botao) {
  try {
    const interacoesResp = await fetch(`${API_INTERACAO}/post/${postId}`);
    const interacoes = interacoesResp.ok ? await interacoesResp.json() : [];

    const usuarioCurtiu = interacoes.some(i => i.tipo === "curtida" && i.usuario?.id == usuarioId);
    let novaContagem = interacoes.filter(i => i.tipo === "curtida").length;

    if (usuarioCurtiu) {
      const deleteResp = await fetch(`${API_INTERACAO}/descurtir/${postId}/${usuarioId}`, { method: "DELETE" });
      if (!deleteResp.ok) throw new Error("Erro ao remover curtida");
      novaContagem--;
      botao.classList.remove('liked');
    } else {
      const interacao = { Tipo: "curtida", Texto: null, PostId: postId, UsuarioId: usuarioId };
      const response = await fetch(API_INTERACAO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interacao)
      });
      if (!response.ok) throw new Error("Erro ao curtir post");
      novaContagem++;
      botao.classList.add('liked');
    }

    botao.textContent = `Curtir (${novaContagem})`;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// Comentar
async function comentarPost(postId, usuarioId, comentario) {
  try {
    const interacao = { tipo: "comentario", texto: comentario, postId, usuarioId };
    const response = await fetch(API_INTERACAO, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(interacao) });
    if (!response.ok) throw new Error("Erro ao comentar post");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

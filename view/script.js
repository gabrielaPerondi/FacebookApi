const API_FACEBOOK = "http://localhost:5295/api/Facebook";
const API_POST = "http://localhost:5295/api/Post";
const API_INTERACAO = "http://localhost:5295/api/Interacoes";

// CADASTRO
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
        body: JSON.stringify({
          Nome: nome,
          Email: email,
          Senha: senha
        })
      });
      if (!response.ok) throw new Error("Erro ao cadastrar usuário");
      alert("Usuário cadastrado!");
      window.location.href = "login.html"; // manda para o  login
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

// PERFIL (postar)
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

// Carregar posts
async function carregarPosts() {
  const container = document.getElementById("postsContainer");
  if (!container) return;

  container.innerHTML = "";

  try {
    const response = await fetch(API_POST);
    if (!response.ok) throw new Error("Erro ao buscar posts");

    const posts = await response.json();
    const usuarioId = localStorage.getItem("usuarioId");

    for (const post of posts) {
      const interacoesResp = await fetch(`${API_INTERACAO}/post/${post.id}`);
      const interacoes = interacoesResp.ok ? await interacoesResp.json() : [];

      const curtidas = interacoes.filter(i => i.tipo === "curtida").length;
      const comentarios = interacoes.filter(i => i.tipo === "comentario");
      const usuarioCurtiu = interacoes.some(
        i => i.tipo === "curtida" && i.usuario?.id == usuarioId
      );

      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <p><strong>Usuário:</strong> ${post.usuario?.nome ?? "Desconhecido"}</p>
        <p><strong>Legenda:</strong> ${post.legenda}</p>
        ${post.fotoUrl ? `<img src="http://localhost:5295${post.fotoUrl}" width="200" />` : ""}
        
        <button class="btn-like ${usuarioCurtiu ? 'liked' : ''}" data-id="${post.id}">
          Curtir (${curtidas})
        </button>

        <div class="comentarios">
          ${comentarios.map(c => `<p><strong>${c.usuario?.nome ?? "Desconhecido"}:</strong> ${c.texto}</p>`).join('')}
        </div>

        <input type="text" id="comentario-${post.id}" placeholder="Escreva um comentário..." />
        <button class="btn-comentar" data-id="${post.id}">Comentar</button>
        <div class="comentarios">
  ${comentarios.map(c => `
    <p>
      <strong>${c.usuario?.nome ?? "Desconhecido"}:</strong> ${c.texto}
      ${c.usuario?.id == usuarioId ? `<button class="btn-delete-comentario" data-id="${c.id}">x</button>` : ''}
    </p>
  `).join('')}
</div>


        <button class="btn-delete" data-id="${post.id}">Excluir</button>
      `;
      container.appendChild(div);
    }

    // Eventos
    container.querySelectorAll('.btn-like').forEach(btn => {
      btn.addEventListener('click', async () => {
        await curtirPost(btn.dataset.id, usuarioId, btn);
      });
    });

    container.querySelectorAll('.btn-comentar').forEach(btn => {
      btn.addEventListener('click', async () => {
        const postId = btn.dataset.id;
        const comentario = document.getElementById(`comentario-${postId}`).value;
        if (!comentario.trim()) {
          alert("Digite um comentário!");
          return;
        }
        await comentarPost(postId, usuarioId, comentario);
        carregarPosts();
      });
    });
    // Botões de deletar comentário
    container.querySelectorAll('.btn-delete-comentario').forEach(btn => {
      btn.addEventListener('click', async () => {
        const comentarioId = btn.dataset.id;
        if (!confirm("Deseja excluir este comentário?")) return;

        try {
          const response = await fetch(`${API_INTERACAO}/${comentarioId}/${usuarioId}`, {
            method: "DELETE"
          });

          if (!response.ok) throw new Error("Erro ao deletar comentário");
          console.log("Comentário deletado!");

          // Remove o comentário da tela sem recarregar tudo
          btn.parentElement.remove();
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
      });
    });

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
//Curtida do post no feed
async function curtirPost(postId, usuarioId, botao) {
  try {
    const interacoesResp = await fetch(`${API_INTERACAO}/post/${postId}`);// RECEBE O DB DE INTERAÇÃO
    const interacoes = interacoesResp.ok ? await interacoesResp.json() : [];//ESPERA A RESPOSTA DO JSON/DB

    const usuarioCurtiu = interacoes.some(
      i => i.tipo === "curtida" && i.usuario?.id == usuarioId
    );

    let novaContagem = interacoes.filter(i => i.tipo === "curtida").length;

    if (usuarioCurtiu) {
      // Chama o endpoint descurtir
      const deleteResp = await fetch(`${API_INTERACAO}/descurtir/${postId}/${usuarioId}`, {
        method: "DELETE"
      });
      if (!deleteResp.ok) throw new Error("Erro ao remover curtida");
      console.log("Curtida removida!");
      novaContagem--;
      botao.classList.remove('liked');
    } else {
      // Curtir
      const interacao = {
        Tipo: "curtida",
        Texto: null,
        PostId: postId,
        UsuarioId: usuarioId
      };

      const response = await fetch(API_INTERACAO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interacao)
      });

      if (!response.ok) throw new Error("Erro ao curtir post");
      console.log("Curtida adicionada!");
      novaContagem++;
      botao.classList.add('liked');
    }

    // Atualiza o texto do botão sem recarregar todos os posts
    botao.textContent = `Curtir (${novaContagem})`;

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}


// Comentar
async function comentarPost(postId, usuarioId, comentario) {
  const interacao = {
    tipo: "comentario",
    texto: comentario,
    postId: postId,
    usuarioId: usuarioId
  };

  const response = await fetch(API_INTERACAO, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(interacao)
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Comentário salvo:", data);
  } else {
    console.error("Erro ao comentar:", await response.text());
  }
}


const API_FACEBOOK = "http://localhost:5295/api/Facebook";
const API_POST = "http://localhost:5295/api/Post";
const API_INTERACAO = "http://localhost:5295/api/Interacoes";

// POST do perfil
const postFormPerfil = document.getElementById("postFormPerfil");
if (postFormPerfil) {
  postFormPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();
    const legenda = document.getElementById("legendaPerfil").value;
    const usuarioId = localStorage.getItem("usuarioId");
    const foto = document.getElementById("fotoPerfil").files[0];

    if (!usuarioId) return alert("Você precisa estar logado!");

    const formData = new FormData();
    formData.append("Legenda", legenda);
    formData.append("UsuarioId", usuarioId);
    if (foto) formData.append("file", foto);

    try {
      const response = await fetch(`${API_POST}/upload`, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Erro ao criar post");
      alert("Post criado!");
      postFormPerfil.reset();
      carregarMeusPosts();
    } catch (err) {
      alert(err.message);
    }
  });
}

// PERFIL: Carregar só os posts do usuário
async function carregarMeusPosts() {
  const container = document.getElementById("postsContainerPerfil");
  if (!container) return;

  container.innerHTML = "";
  const usuarioId = localStorage.getItem("usuarioId");

  try {
    const response = await fetch(API_POST);
    if (!response.ok) throw new Error("Erro ao buscar posts");

    const posts = await response.json();
    const meusPosts = posts.filter(post => post.usuario?.id == usuarioId);

    for (const post of meusPosts) {
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
          <button class="btn-delete" data-id="${post.id}">Excluir</button>
        </div>

        <div class="comentarios">
          ${comentarios.map(c => `
            <div class="comment">
              ${c.usuario?.fotoUrl
                ? `<img src="http://localhost:5295${c.usuario.fotoUrl}" class="avatar-small" alt="." />`
                : `<img src="https://via.placeholder.com/28" class="avatar-small" alt="." />`}
              <span><strong>${c.usuario?.nome ?? "Desconhecido"}:</strong> ${c.texto}</span>
              <button class="btn-delete-comentario" data-id="${c.id}">Excluir</button>
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

    // Event delegation: curtir, comentar, excluir comentário e excluir post
    container.addEventListener('click', async (e) => {
      const target = e.target;

      if (target.classList.contains('btn-like')) {
        await curtirPost(target.dataset.id, usuarioId, target);
      }

      if (target.classList.contains('btn-comentar')) {
        const postId = target.dataset.id;
        const comentario = document.getElementById(`comentario-${postId}`).value;
        if (!comentario.trim()) return alert("Digite um comentário!");
        const scrollPos = window.scrollY;
        await comentarPost(postId, usuarioId, comentario);
        await carregarMeusPosts();
        window.scrollTo(0, scrollPos);
      }

      if (target.classList.contains('btn-delete-comentario')) {
        const comentarioId = target.dataset.id;
        if (!confirm("Deseja excluir este comentário?")) return;
        try {
          const response = await fetch(`${API_INTERACAO}/${comentarioId}/${usuarioId}`, { method: "DELETE" });
          if (!response.ok) throw new Error("Erro ao deletar comentário");
          target.parentElement.remove();
        } catch (err) {
          alert(err.message);
        }
      }

      if (target.classList.contains('btn-delete')) {
        await deletarPost(target.dataset.id);
      }
    });

  } catch (err) {
    container.innerHTML = `<p>${err.message}</p>`;
  }
}

// Curtir
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
      const response = await fetch(API_INTERACAO, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(interacao) });
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
    const interacao = { tipo: "comentario", texto: comentario, postId: postId, usuarioId: usuarioId };
    const response = await fetch(API_INTERACAO, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(interacao) });
    if (!response.ok) throw new Error("Erro ao comentar post");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// Deletar post
async function deletarPost(id) {
  const usuarioId = localStorage.getItem("usuarioId");
  if (!confirm(`Deseja excluir o post ${id}?`)) return;

  try {
    const response = await fetch(`${API_POST}/${id}/${usuarioId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao deletar post");
    carregarMeusPosts();
  } catch (err) {
    alert(err.message);
  }
}

// Inicializa
if (postFormPerfil) {
  carregarMeusPosts();
}

const WHATSAPP = "258876128066";
const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString("pt-PT").replace(/\u00a0| /g, ".") + " MT";
const PH = "data:image/svg+xml;utf8," + encodeURIComponent(
 `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#fbe3f3'/><text x='50%' y='50%' font-size='70' text-anchor='middle' dy='.3em'>💄</text></svg>`);

let filtro = { marca: null, sub: null, q: "" };
let carrinho = JSON.parse(localStorage.getItem("beijoca24_cart") || "[]");

/* ---------- Menu superior ---------- */
function montarMenu() {
  const marcas = Object.keys(CATEGORIAS);
  const drop = m => `<ul class="drop">` + CATEGORIAS[m].map(s =>
    `<li><a href="#produtos" data-marca="${m}" data-sub="${s}">${s}</a></li>`).join("") + `</ul>`;
  $("#menu").innerHTML =
    `<li><a href="#inicio" class="on">🏠 Início</a></li>
     <li><a href="#sobre">Sobre Nós</a></li>
     <li><a href="#contacto">Contacto</a></li>
     <li class="sep"></li>` +
    marcas.map(m => `<li><a href="#produtos" data-marca="${m}">${m.toUpperCase() === "OUTRAS MARCAS" ? m : (m === "Desodorantes" ? m : m.toUpperCase())} ▾</a>${drop(m)}</li>`).join("");
}
$("#menu").addEventListener("click", e => {
  const a = e.target.closest("a"); if (!a) return;
  if (a.dataset.marca) { filtro = { marca: a.dataset.marca, sub: a.dataset.sub || null, q: "" }; $("#search").value = ""; render(); }
  $("#nav").classList.remove("open");
});

/* ---------- Banners das marcas ---------- */
function montarBanners() {
  $("#brandCards").innerHTML = Object.keys(CATEGORIAS).map(m => {
    const b = BANNERS[m];
    return `<div class="bcard" style="background:${b.bg}" data-marca="${m}">
      <h3>${m === "Outras Marcas" ? "Outras Marcas" : m.toUpperCase()}</h3><p>${b.slogan}</p>
      <span class="vb" style="background:${b.cor}">Ver Produtos →</span>
      <img src="images/banners/${PASTA(m)}.png" alt="" onerror="this.remove()">
    </div>`; }).join("");
}
$("#brandCards").addEventListener("click", e => {
  const c = e.target.closest("[data-marca]"); if (!c) return;
  filtro = { marca: c.dataset.marca, sub: null, q: "" }; render();
  $("#produtos").scrollIntoView();
});

/* ---------- Produtos ---------- */
function render() {
  $("#sideList").innerHTML =
    Object.keys(CATEGORIAS).map(m => `<li data-marca="${m}" class="${filtro.marca === m && !filtro.sub ? "on" : ""}">${m} <span>›</span></li>`).join("") +
    LATERAL.map(s => `<li data-lat="${s}" class="${!filtro.marca && filtro.sub === s ? "on" : ""}">${s} <span>›</span></li>`).join("");

  $("#subChips").innerHTML = filtro.marca ?
    `<button class="chip ${!filtro.sub ? "on" : ""}" data-s="">Todos</button>` +
    CATEGORIAS[filtro.marca].map(s => `<button class="chip ${filtro.sub === s ? "on" : ""}" data-s="${s}">${s}</button>`).join("") : "";

  const q = filtro.q.toLowerCase();
  const lista = PRODUTOS.filter(x =>
    (!filtro.marca || x.marca === filtro.marca) &&
    (!filtro.sub || x.sub === filtro.sub) &&
    (!q || (x.nome + x.marca + x.sub).toLowerCase().includes(q)));

  $("#titulo").textContent = (filtro.marca || filtro.sub || q)
    ? "🛍️ " + [filtro.marca, filtro.sub].filter(Boolean).join(" › ") + (q ? ` “${filtro.q}”` : "")
    : "★ Produtos em Destaque";

  $("#grid").innerHTML = lista.length ? lista.map(x => {
    const desc = x.antigo ? Math.round((1 - x.preco / x.antigo) * 100) : 0;
    return `<div class="card">
      ${desc ? `<span class="badge">-${desc}%</span>` : ""}
      <img src="${x.img}" alt="${x.nome}" loading="lazy" onerror="this.onerror=null;this.src='${PH}'">
      <div class="nome">${x.nome}</div>
      <div class="preco"><b>${fmt(x.preco)}</b>${x.antigo ? `<s>${fmt(x.antigo)}</s>` : ""}</div>
      <button data-add="${x.id}">🛒 Adicionar ao Carrinho</button>
    </div>`; }).join("") : `<p class="vazio">Nenhum produto encontrado.</p>`;
}
$("#sideList").addEventListener("click", e => {
  const li = e.target.closest("li"); if (!li) return;
  filtro = li.dataset.marca ? { marca: li.dataset.marca, sub: null, q: "" } : { marca: null, sub: li.dataset.lat, q: "" };
  $("#search").value = ""; render();
});
$("#subChips").addEventListener("click", e => {
  const b = e.target.closest("[data-s]"); if (b) { filtro.sub = b.dataset.s || null; render(); }
});
$("#search").addEventListener("input", e => { filtro.q = e.target.value; render(); if (filtro.q) $("#produtos").scrollIntoView(); });
$("#searchBtn").onclick = () => $("#produtos").scrollIntoView();
$("#verTodos").onclick = () => { filtro = { marca: null, sub: null, q: "" }; $("#search").value = ""; render(); };
document.querySelector("[data-all]").onclick = $("#verTodos").onclick;
$("#grid").addEventListener("click", e => {
  const b = e.target.closest("[data-add]"); if (b) { adicionar(b.dataset.add); abrirCarrinho(); }
});

/* ---------- Carrinho ---------- */
function salvar() { localStorage.setItem("beijoca24_cart", JSON.stringify(carrinho)); desenharCarrinho(); }
function adicionar(id) { const it = carrinho.find(c => c.id === id); it ? it.qtd++ : carrinho.push({ id, qtd: 1 }); salvar(); }
function alterar(id, d) {
  const it = carrinho.find(c => c.id === id); if (!it) return;
  it.qtd += d; if (it.qtd <= 0) carrinho = carrinho.filter(c => c.id !== id); salvar();
}
const total = () => carrinho.reduce((s, c) => s + c.qtd * PRODUTOS.find(p => p.id === c.id).preco, 0);
function desenharCarrinho() {
  carrinho = carrinho.filter(c => PRODUTOS.some(p => p.id === c.id));
  $("#cartCount").textContent = carrinho.reduce((s, c) => s + c.qtd, 0);
  $("#cartTotal").textContent = fmt(total());
  $("#cartItems").innerHTML = carrinho.length ? carrinho.map(c => {
    const x = PRODUTOS.find(p => p.id === c.id);
    return `<div class="item"><img src="${x.img}" onerror="this.onerror=null;this.src='${PH}'">
      <div class="d"><strong>${x.nome}</strong><br>${fmt(x.preco)}</div>
      <div class="qty"><button data-d="-1" data-id="${x.id}">−</button>${c.qtd}<button data-d="1" data-id="${x.id}">+</button></div></div>`;
  }).join("") : `<p class="vazio">O carrinho está vazio.</p>`;
}
$("#cartItems").addEventListener("click", e => { const b = e.target.closest("[data-d]"); if (b) alterar(b.dataset.id, +b.dataset.d); });
const abrirCarrinho = () => { $("#drawer").classList.add("open"); $("#overlay").classList.add("show"); };
const fecharCarrinho = () => { $("#drawer").classList.remove("open"); $("#overlay").classList.remove("show"); };
$("#cartBtn").onclick = abrirCarrinho; $("#cartBtn2").onclick = abrirCarrinho;
$("#closeCart").onclick = fecharCarrinho; $("#overlay").onclick = fecharCarrinho;
$("#menuBtn").onclick = () => $("#nav").classList.toggle("open");

/* ---------- Finalizar pedido ---------- */
$("#checkoutBtn").onclick = () => {
  if (!carrinho.length) return alert("O carrinho está vazio.");
  fecharCarrinho(); $("#modal").classList.add("show");
  document.querySelector("[name=dia]").min = new Date().toISOString().split("T")[0];
};
$("#cancelOrder").onclick = () => $("#modal").classList.remove("show");

$("#orderForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const dia = f.dia.split("-").reverse().join("/");
  const linhas = carrinho.map(c => {
    const x = PRODUTOS.find(p => p.id === c.id);
    return `• ${x.nome} (${c.qtd} un.) — ${fmt(c.qtd * x.preco)}`;
  }).join("\n");

  const msg =
`Olá! Acabei de fazer um pedido na BEIJOCA24. Aqui estão os detalhes da minha entrega:

📦 *Produtos:*
${linhas}
💰 *Total:* ${fmt(total())}

👤 *Nome:* ${f.nome}
📅 *Dia da Entrega:* ${dia}
🕒 *Horário:* ${f.hora}
📍 *Localização:* ${f.local}${f.maps ? "\n🗺️ *Mapa:* " + f.maps : ""}
📞 *Contacto para chamadas:* ${f.tel}
💬 *WhatsApp:* ${f.wpp}${f.obs ? "\n📝 *Obs.:* " + f.obs : ""}

💵 *Pagamento:* ${f.pagamento}

Obrigado por comprar na BEIJOCA24! 💜`;

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  carrinho = []; salvar(); e.target.reset(); $("#modal").classList.remove("show");
});

montarMenu(); montarBanners(); render(); desenharCarrinho();

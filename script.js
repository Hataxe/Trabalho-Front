const FACTS = [
  { cat: "Ciência", ico: "🍯", text: "O mel praticamente não estraga. Potes de mel milenares encontrados em tumbas egípcias ainda eram comestíveis." },
  { cat: "Ciência", ico: "🪐", text: "Em Vênus, um dia (uma rotação completa) dura mais que um ano: ~243 dias terrestres contra ~225 para dar a volta no Sol." },
  { cat: "Ciência", ico: "🍌", text: "Bananas são levemente radioativas, porque contêm potássio-40. A dose é inofensiva." },
  { cat: "Ciência", ico: "☀️", text: "A luz do Sol leva cerca de 8 minutos e 20 segundos para chegar até a Terra." },
  { cat: "Animais", ico: "🐙", text: "Os polvos têm três corações e sangue azul." },
  { cat: "Animais", ico: "🦩", text: "Flamingos nascem com penas cinzentas. A cor rosada vem dos pigmentos da alimentação." },
  { cat: "Animais", ico: "🦈", text: "Os tubarões existem há mais tempo que as árvores: surgiram há mais de 400 milhões de anos." },
  { cat: "Animais", ico: "🟫", text: "Vombates (wombats) produzem fezes em formato de cubo." },
  { cat: "Corpo humano", ico: "❤️", text: "O coração humano bate cerca de 100 mil vezes por dia." },
  { cat: "Corpo humano", ico: "🦴", text: "Um adulto tem 206 ossos, mas um bebê nasce com mais de 300, que vão se fundindo ao longo do crescimento." },
  { cat: "História", ico: "🏺", text: "Cleópatra viveu mais próxima, no tempo, da chegada do homem à Lua do que da construção da Grande Pirâmide de Gizé." },
  { cat: "História", ico: "🎓", text: "A Universidade de Oxford já tinha aulas antes de o Império Asteca ser fundado (Tenochtitlán, 1325)." },
  { cat: "Brasil", ico: "🌳", text: "O nome \"Brasil\" vem do pau-brasil, árvore cuja madeira produzia um corante vermelho muito valorizado." },
  { cat: "Brasil", ico: "🌊", text: "O Rio Amazonas é o rio de maior vazão do mundo, despejando mais água no oceano que qualquer outro." },
  { cat: "Tecnologia", ico: "📧", text: "O primeiro e-mail em rede foi enviado em 1971 por Ray Tomlinson, que também escolheu o símbolo @." },
  { cat: "Tecnologia", ico: "🌐", text: "O primeiro domínio .com registrado foi symbolics.com, em 1985." }
];

const $ = id => document.getElementById(id);
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Favoritos (localStorage opcional)
let favs = new Set();
try { favs = new Set(JSON.parse(localStorage.getItem("favs") || "[]")); } catch (e) {}
const saveFavs = () => { try { localStorage.setItem("favs", JSON.stringify([...favs])); } catch (e) {} };

const cats = ["Todas", "⭐ Favoritas", ...new Set(FACTS.map(f => f.cat))];
let activeCat = "Todas";
let query = "";

function renderChips() {
  $("chips").innerHTML = "";
  cats.forEach(c => {
    const b = document.createElement("button");
    b.className = "chip" + (c === activeCat ? " active" : "");
    b.textContent = c;
    b.onclick = () => { activeCat = c; renderChips(); renderGrid(); };
    $("chips").appendChild(b);
  });
}

function renderGrid() {
  const grid = $("grid");
  grid.innerHTML = "";
  const q = norm(query);
  const list = FACTS.map((f, i) => ({ ...f, id: i })).filter(f => {
    const catOk = activeCat === "Todas" || (activeCat === "⭐ Favoritas" ? favs.has(f.id) : f.cat === activeCat);
    return catOk && (!q || norm(f.text).includes(q) || norm(f.cat).includes(q));
  });
  list.forEach(f => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="top"><span class="ico">${f.ico}</span><button class="fav ${favs.has(f.id) ? "on" : ""}" aria-label="Favoritar" title="Favoritar">${favs.has(f.id) ? "★" : "☆"}</button></div>
      <span class="cat">${f.cat}</span>
      <p></p>`;
    card.querySelector("p").textContent = f.text;
    card.querySelector(".fav").onclick = () => {
      favs.has(f.id) ? favs.delete(f.id) : favs.add(f.id);
      saveFavs();
      renderGrid();
    };
    grid.appendChild(card);
  });
  $("empty").hidden = list.length > 0;
  $("count").textContent = list.length + (list.length === 1 ? " curiosidade" : " curiosidades");
}

// Curiosidade aleatória
let lastIdx = -1;
function showRandom() {
  let i;
  do { i = Math.floor(Math.random() * FACTS.length); } while (i === lastIdx && FACTS.length > 1);
  lastIdx = i;
  const f = FACTS[i];
  $("heroTag").textContent = f.cat;
  $("heroEmoji").textContent = f.ico;
  $("heroText").textContent = f.text;
  const hero = $("hero");
  hero.classList.remove("fade");
  void hero.offsetWidth;
  hero.classList.add("fade");
}

// Quiz de verdadeiro ou falso
const QUIZ = [
  { q: "O mel pode se conservar por milhares de anos.", a: true, why: "Verdade: baixa umidade e acidez impedem a proliferação de microrganismos." },
  { q: "Polvos têm apenas um coração.", a: false, why: "Falso: eles têm três corações." },
  { q: "Um dia em Vênus é mais curto que um dia na Terra.", a: false, why: "Falso: Vênus gira tão devagar que seu dia é mais longo que seu ano." },
  { q: "Flamingos já nascem rosados.", a: false, why: "Falso: nascem cinzentos e ficam rosados pela alimentação." },
  { q: "Os tubarões são mais antigos que as árvores.", a: true, why: "Verdade: tubarões surgiram há mais de 400 milhões de anos." },
  { q: "O símbolo @ foi escolhido para e-mails por Ray Tomlinson.", a: true, why: "Verdade: ele enviou o primeiro e-mail em rede em 1971." },
  { q: "Um adulto humano tem cerca de 300 ossos.", a: false, why: "Falso: adultos têm 206. Os bebês é que nascem com mais de 300." },
  { q: "A luz do Sol chega à Terra em cerca de 8 minutos.", a: true, why: "Verdade: aproximadamente 8 minutos e 20 segundos." }
];
let qi = -1, hits = 0, total = 0, answered = false;
const order = [...QUIZ.keys()].sort(() => Math.random() - 0.5);

function nextQuiz() {
  qi = (qi + 1) % order.length;
  answered = false;
  $("quizQ").textContent = QUIZ[order[qi]].q;
  $("quizFeedback").textContent = "";
  $("quizNext").hidden = true;
  $("quizT").disabled = $("quizF").disabled = false;
}

function answer(v) {
  if (answered) return;
  answered = true;
  const item = QUIZ[order[qi]];
  total++;
  const right = v === item.a;
  if (right) hits++;
  $("quizFeedback").innerHTML = `<span class="${right ? "ok" : "no"}">${right ? "✅ Acertou!" : "❌ Errou!"}</span> ${item.why}`;
  $("quizScore").textContent = `Placar: ${hits} de ${total}`;
  $("quizT").disabled = $("quizF").disabled = true;
  $("quizNext").hidden = false;
}

$("randomBtn").onclick = showRandom;
$("search").oninput = e => { query = e.target.value; renderGrid(); };
$("quizT").onclick = () => answer(true);
$("quizF").onclick = () => answer(false);
$("quizNext").onclick = nextQuiz;

renderChips();
renderGrid();
showRandom();
nextQuiz();
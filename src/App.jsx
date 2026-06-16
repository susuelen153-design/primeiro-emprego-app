import { useState, useRef, useEffect } from "react";

const P = "#2563EB"; // azul profissional
const PL = "#EFF6FF";
const DARK = "#1E293B";
const GRAY = "#64748B";
const LGRAY = "#F1F5F9";
const WHITE = "#FFFFFF";
const GREEN = "#16A34A";
const BORDER = "#E2E8F0";

const STEPS = ["inicio", "perfil", "quiz", "curriculo"];

// ── QUIZ DE PERFIL ──────────────────────────────────────
const QUIZ = [
  {
    id: "q1",
    pergunta: "Quando tem um trabalho em grupo na escola, você geralmente:",
    opcoes: [
      { texto: "Organiza as tarefas e cuida dos prazos", comps: ["organizacao", "lideranca"] },
      { texto: "Anima o grupo e mantém todo mundo motivado", comps: ["comunicacao", "equipe"] },
      { texto: "Pesquisa e traz as melhores ideias", comps: ["criatividade", "aprendizado"] },
      { texto: "Garante que tudo seja feito direitinho", comps: ["responsabilidade", "organizacao"] },
    ],
  },
  {
    id: "q2",
    pergunta: "Quando surge um problema que ninguém sabe resolver, você:",
    opcoes: [
      { texto: "Toma a frente e propõe uma solução", comps: ["proatividade", "lideranca"] },
      { texto: "Conversa com todos para entender o problema", comps: ["comunicacao", "equipe"] },
      { texto: "Pesquisa sozinho até encontrar a resposta", comps: ["aprendizado", "responsabilidade"] },
      { texto: "Pensa em algo criativo e diferente", comps: ["criatividade", "proatividade"] },
    ],
  },
  {
    id: "q3",
    pergunta: "No seu dia a dia, o que as pessoas mais pedem sua ajuda?",
    opcoes: [
      { texto: "Para explicar ou ensinar algo", comps: ["comunicacao", "aprendizado"] },
      { texto: "Para organizar eventos ou atividades", comps: ["organizacao", "lideranca"] },
      { texto: "Para criar algo diferente ou bonito", comps: ["criatividade", "proatividade"] },
      { texto: "Para resolver problemas práticos", comps: ["responsabilidade", "equipe"] },
    ],
  },
  {
    id: "q4",
    pergunta: "Como você prefere aprender coisas novas?",
    opcoes: [
      { texto: "Assistindo tutoriais e praticando sozinho", comps: ["aprendizado", "proatividade"] },
      { texto: "Com alguém me ensinando e tirando dúvidas", comps: ["comunicacao", "equipe"] },
      { texto: "Tentando e errando até acertar", comps: ["responsabilidade", "criatividade"] },
      { texto: "Lendo e me organizando com anotações", comps: ["organizacao", "aprendizado"] },
    ],
  },
  {
    id: "q5",
    pergunta: "Quando você tem um prazo para entregar algo importante:",
    opcoes: [
      { texto: "Já começo antes do tempo e entrego cedo", comps: ["proatividade", "organizacao"] },
      { texto: "Me organizo bem e entrego no prazo certo", comps: ["responsabilidade", "organizacao"] },
      { texto: "Peço ajuda se precisar e termino junto", comps: ["equipe", "comunicacao"] },
      { texto: "Me concentro e dou meu melhor até o fim", comps: ["responsabilidade", "aprendizado"] },
    ],
  },
  {
    id: "q6",
    pergunta: "O que você mais gosta de fazer no tempo livre?",
    opcoes: [
      { texto: "Criar conteúdo, desenhar ou inventar coisas", comps: ["criatividade", "proatividade"] },
      { texto: "Ajudar amigos ou família com algo", comps: ["equipe", "responsabilidade"] },
      { texto: "Aprender algo novo por conta própria", comps: ["aprendizado", "proatividade"] },
      { texto: "Organizar, planejar ou montar algo", comps: ["organizacao", "lideranca"] },
    ],
  },
];

const COMP_INFO = {
  comunicacao:     { label: "Comunicação",            emoji: "🗣️", desc: "Você sabe se expressar com clareza, seja falando ou escrevendo. Isso é muito valorizado em atendimento, vendas e trabalho em equipe." },
  equipe:          { label: "Trabalho em Equipe",     emoji: "🤝", desc: "Você colabora bem com outras pessoas e sabe que juntos chegamos mais longe. Empresas adoram quem constrói boas relações." },
  organizacao:     { label: "Organização",            emoji: "📋", desc: "Você planeja, prioriza e cumpre prazos. Essa competência é essencial em qualquer área profissional." },
  proatividade:    { label: "Proatividade",           emoji: "🚀", desc: "Você age antes de ser pedido e vai além do esperado. Profissionais proativos se destacam rapidamente." },
  criatividade:    { label: "Criatividade",           emoji: "💡", desc: "Você pensa fora da caixa e encontra soluções inovadoras. Muito valorizado em empresas modernas." },
  responsabilidade:{ label: "Responsabilidade",       emoji: "✅", desc: "Você assume compromissos e os cumpre. Confiabilidade é a base de toda relação profissional." },
  lideranca:       { label: "Liderança",              emoji: "👑", desc: "Você inspira e guia pessoas naturalmente. Mesmo sem cargo, líderes fazem a diferença em qualquer time." },
  aprendizado:     { label: "Facilidade p/ Aprender", emoji: "🧠", desc: "Você absorve conhecimento rápido e se adapta. No mercado de hoje, quem aprende rápido sempre se destaca." },
};

const CURSOS = [
  { nome: "Escola Virtual Bradesco", url: "https://www.ev.org.br/cursos", areas: "Informática, Administração, IA, Inglês — +88 cursos gratuitos", badge: "Gratuito" },
  { nome: "SENAI Play", url: "https://play.senai.br/cursos", areas: "Tecnologia, Indústria, Qualidade", badge: "Gratuito" },
  { nome: "Google Skillshop", url: "https://skillshop.withgoogle.com", areas: "Marketing Digital, Analytics, IA — certificado Google", badge: "Gratuito" },
  { nome: "Microsoft Learn", url: "https://learn.microsoft.com/pt-br/training/browse", areas: "Office, Power BI, Azure, IA", badge: "Gratuito" },
  { nome: "IBM SkillsBuild", url: "https://skillsbuild.org/pt-BR", areas: "IA, Dados, Cibersegurança, Cloud", badge: "Gratuito" },
  { nome: "Khan Academy", url: "https://pt.khanacademy.org", areas: "Matemática, Programação, Ciências", badge: "Gratuito" },
  { nome: "SEBRAE Online", url: "https://www.sebrae.com.br/sites/PortalSebrae/cursosonline", areas: "Empreendedorismo, Vendas, Gestão", badge: "Gratuito" },
  { nome: "Coursera (Google)", url: "https://www.coursera.org/google", areas: "TI, Dados, UX, Cibersegurança — bolsas disponíveis", badge: "Gratuito" },
];

const DICAS_ENTREVISTA = [
  { icon: "✨", titulo: "Vista o que te faz sentir bem", dica: "Não existe roupa certa ou errada. O que importa é você se sentir confortável e confiante. Só evita boné e bermuda, que passam uma ideia de descuido." },
  { icon: "⏰", titulo: "Chega antes do horário", dica: "Apareça uns 10 minutinhos antes. Pesquise o caminho com antecedência para não ter surpresa no dia." },
  { icon: "🔍", titulo: "Pesquise a empresa antes", dica: "Dá uma olhada no site ou Instagram deles. Quando perguntarem por que você quer trabalhar lá, você vai ter o que responder de verdade." },
  { icon: "💬", titulo: "Suas histórias reais valem ouro", dica: "Você não precisa ter trabalhado antes. Conta sobre algo que organizou, vendeu, ensinou ou ajudou. Isso é experiência de verdade." },
  { icon: "👀", titulo: "Olha nos olhos e relaxa", dica: "Nervoso é normal, todo mundo fica. Respira fundo, fala com calma e olha pra pessoa. Isso já passa muita confiança." },
  { icon: "❓", titulo: "Pergunta sobre a vaga", dica: "No final, pergunta algo como: quais são as principais tarefas do dia a dia? Mostra que você está interessado de verdade." },
  { icon: "🤐", titulo: "Sem falar mal de ninguém", dica: "Nem de escola, professores ou colegas. Não precisa fingir que tudo foi perfeito, mas guarda as críticas pra você." },
  { icon: "🙏", titulo: "Manda uma mensagem depois", dica: "Um recado no WhatsApp ou e-mail agradecendo a conversa. Quase ninguém faz isso e quem faz fica na memória." },
];

// ── API ─────────────────────────────────────────────────
async function callIA(messages, systemPrompt) {
  const res = await fetch("/api/gerar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, systemPrompt }),
  });
  const data = await res.json();
  return data?.text || "Erro ao gerar resposta.";
}

// ── GERAÇÃO DO CURRÍCULO (template local) ───────────────
function gerarCurriculoTexto(dados, comps, respostasQuiz) {
  const nome = dados.nome || "";
  const contato = [dados.cidade, dados.telefone, dados.email].filter(Boolean).join("  |  ");
  const formacao = dados.tipoFormacao && dados.serie
    ? `${dados.tipoFormacao} — ${dados.serie}${dados.escola ? ` | ${dados.escola}` : ""}`
    : dados.escola || "";

  const compsList = comps.map(id => COMP_INFO[id]?.label).filter(Boolean);

  return `${nome}
${contato}
${"─".repeat(60)}

OBJETIVO PROFISSIONAL
Busco minha primeira oportunidade profissional para aplicar minhas habilidades, aprender com profissionais experientes e contribuir com os resultados da equipe.

${"─".repeat(60)}

FORMAÇÃO ACADÊMICA
${formacao || "A preencher"}
${dados.cursos ? `\nCURSOS E CERTIFICAÇÕES\n${dados.cursos}` : ""}

${"─".repeat(60)}

COMPETÊNCIAS
${compsList.map(c => `• ${c}`).join("\n")}

${"─".repeat(60)}

INFORMAÇÕES COMPLEMENTARES
Disponibilidade: A combinar
${dados.cidade ? `Localização: ${dados.cidade}` : ""}`;
}

// ── COMPONENTS ──────────────────────────────────────────

function ProgressBar({ step }) {
  const steps = [
    { key: "inicio", label: "Início" },
    { key: "perfil", label: "Perfil" },
    { key: "quiz", label: "Quiz" },
    { key: "curriculo", label: "Currículo" },
  ];
  const idx = steps.findIndex(s => s.key === step);
  const pct = Math.round((idx / (steps.length - 1)) * 100);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        {steps.map((s, i) => (
          <span key={s.key} style={{ fontSize: 11, fontWeight: i <= idx ? 700 : 400, color: i <= idx ? P : GRAY }}>{s.label}</span>
        ))}
      </div>
      <div style={{ height: 4, background: BORDER, borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: P, borderRadius: 99, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

function Btn({ children, onClick, disabled, outline, small }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? WHITE : disabled ? "#CBD5E1" : P,
      color: outline ? P : WHITE,
      border: outline ? `2px solid ${P}` : "none",
      borderRadius: 10,
      padding: small ? "9px 16px" : "13px 24px",
      fontSize: small ? 13 : 15,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
    }}>{children}</button>
  );
}

// ── TELA INÍCIO ─────────────────────────────────────────
function Inicio({ onNext }) {
  return (
    <div style={{ textAlign: "center", padding: "12px 0 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 8 }}>🚀</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK, margin: "0 0 8px" }}>PrimeiroEmprego</h1>
      <p style={{ fontSize: 15, color: GRAY, marginBottom: 28, lineHeight: 1.6 }}>
        Descubra suas competências, monte seu currículo<br />e se prepare pra arrasar na entrevista!
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
        {[
          { emoji: "🧩", label: "Quiz de perfil" },
          { emoji: "📄", label: "Currículo com IA" },
          { emoji: "🎤", label: "Dicas de entrevista" },
        ].map((f, i) => (
          <div key={i} style={{ background: PL, borderRadius: 12, padding: "14px 8px" }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{f.emoji}</div>
            <div style={{ fontSize: 12, color: P, fontWeight: 700 }}>{f.label}</div>
          </div>
        ))}
      </div>
      <button onClick={onNext} style={{ background: P, color: WHITE, border: "none", borderRadius: 12, padding: "14px", fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%" }}>
        Começar agora →
      </button>
    </div>
  );
}

// ── TELA PERFIL ─────────────────────────────────────────
const TIPOS_FORMACAO = ["Ensino Fundamental", "Ensino Médio", "Ensino Médio Técnico", "EJA", "Curso Técnico", "Graduação"];
const SERIES = {
  "Ensino Fundamental": ["6º ano", "7º ano", "8º ano", "9º ano", "Concluído"],
  "Ensino Médio": ["1º ano", "2º ano", "3º ano", "Concluído"],
  "Ensino Médio Técnico": ["1º ano", "2º ano", "3º ano", "Concluído"],
  "EJA": ["1ª etapa", "2ª etapa", "3ª etapa", "Concluído"],
  "Curso Técnico": ["1º semestre", "2º semestre", "3º semestre", "4º semestre", "Concluído"],
  "Graduação": ["1º semestre", "2º semestre", "3º semestre", "4º semestre", "5º semestre", "6º semestre", "7º semestre", "8º semestre", "Concluído"],
};

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: `1.5px solid ${BORDER}`, fontSize: 14, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box", background: WHITE,
};
const selectStyle = {
  ...inputStyle, appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748B' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", cursor: "pointer",
};

function Label({ children }) {
  return <label style={{ fontSize: 12, fontWeight: 700, color: DARK, display: "block", marginBottom: 4 }}>{children}</label>;
}

function Perfil({ dados, onChange, onNext, onBack }) {
  const canNext = dados.nome && dados.email;
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK, marginBottom: 4 }}>Seus dados 👤</h2>
      <p style={{ color: GRAY, fontSize: 13, marginBottom: 20 }}>Essas informações vão para o seu currículo.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ gridColumn: "span 2" }}>
          <Label>Nome completo *</Label>
          <input style={inputStyle} placeholder="Seu nome completo" value={dados.nome || ""} onChange={e => onChange("nome", e.target.value)} />
        </div>
        <div>
          <Label>Idade</Label>
          <input style={inputStyle} type="number" placeholder="Ex: 16" value={dados.idade || ""} onChange={e => onChange("idade", e.target.value)} />
        </div>
        <div>
          <Label>Cidade/Estado</Label>
          <input style={inputStyle} placeholder="Ex: São Paulo/SP" value={dados.cidade || ""} onChange={e => onChange("cidade", e.target.value)} />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <Label>E-mail *</Label>
          <input style={inputStyle} type="email" placeholder="seuemail@gmail.com" value={dados.email || ""} onChange={e => onChange("email", e.target.value)} />
        </div>
        <div>
          <Label>WhatsApp/Telefone</Label>
          <input style={inputStyle} placeholder="(11) 9 9999-9999" value={dados.telefone || ""} onChange={e => onChange("telefone", e.target.value)} />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <Label>Escola</Label>
          <input style={inputStyle} placeholder="Nome da sua escola" value={dados.escola || ""} onChange={e => onChange("escola", e.target.value)} />
        </div>
        <div>
          <Label>Tipo de formação</Label>
          <select style={selectStyle} value={dados.tipoFormacao || ""} onChange={e => { onChange("tipoFormacao", e.target.value); onChange("serie", ""); }}>
            <option value="" disabled>Selecione...</option>
            {TIPOS_FORMACAO.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <Label>Ano/Série</Label>
          <select style={selectStyle} value={dados.serie || ""} onChange={e => onChange("serie", e.target.value)} disabled={!dados.tipoFormacao}>
            <option value="" disabled>{dados.tipoFormacao ? "Selecione..." : "Escolha o tipo primeiro"}</option>
            {(SERIES[dados.tipoFormacao] || []).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <Label>Cursos que já fez (opcional)</Label>
          <input style={inputStyle} placeholder="Ex: Excel básico, inglês, informática..." value={dados.cursos || ""} onChange={e => onChange("cursos", e.target.value)} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn outline onClick={onBack} small>← Voltar</Btn>
        <button onClick={onNext} disabled={!canNext} style={{ flex: 1, background: canNext ? P : "#CBD5E1", color: WHITE, border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 700, cursor: canNext ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
          Próximo: Quiz de perfil →
        </button>
      </div>
    </div>
  );
}

// ── QUIZ ────────────────────────────────────────────────
function Quiz({ onFinalizar, onBack }) {
  const [atual, setAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);

  const pergunta = QUIZ[atual];
  const progresso = Math.round((atual / QUIZ.length) * 100);

  const avancar = () => {
    if (selecionada === null) return;
    const novas = [...respostas, { questao: pergunta.id, comps: selecionada }];
    if (atual + 1 < QUIZ.length) {
      setRespostas(novas);
      setAtual(atual + 1);
      setSelecionada(null);
    } else {
      // Contar competências
      const contagem = {};
      novas.forEach(r => r.comps.forEach(c => { contagem[c] = (contagem[c] || 0) + 1; }));
      const ordenadas = Object.entries(contagem).sort((a, b) => b[1] - a[1]).map(([id]) => id);
      onFinalizar(ordenadas.slice(0, 5), novas);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK, marginBottom: 4 }}>Quiz de perfil 🧩</h2>
      <p style={{ color: GRAY, fontSize: 13, marginBottom: 16 }}>Responda com sinceridade — não tem certo ou errado!</p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 6, background: BORDER, borderRadius: 99 }}>
          <div style={{ height: "100%", width: `${progresso}%`, background: P, borderRadius: 99, transition: "width 0.4s" }} />
        </div>
        <span style={{ fontSize: 12, color: GRAY, fontWeight: 600 }}>{atual + 1}/{QUIZ.length}</span>
      </div>

      <div style={{ background: PL, borderRadius: 14, padding: "18px 16px", marginBottom: 16 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: 0, lineHeight: 1.5 }}>{pergunta.pergunta}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {pergunta.opcoes.map((op, i) => {
          const sel = selecionada === op.comps;
          return (
            <div key={i} onClick={() => setSelecionada(op.comps)} style={{
              border: `2px solid ${sel ? P : BORDER}`,
              borderRadius: 12, padding: "13px 16px", cursor: "pointer",
              background: sel ? PL : WHITE, transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${sel ? P : BORDER}`, background: sel ? P : WHITE, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {sel && <div style={{ width: 8, height: 8, borderRadius: "50%", background: WHITE }} />}
              </div>
              <span style={{ fontSize: 14, color: DARK, lineHeight: 1.4 }}>{op.texto}</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {atual > 0 && <Btn outline onClick={() => { setAtual(atual - 1); setSelecionada(null); }} small>← Voltar</Btn>}
        <button onClick={avancar} disabled={selecionada === null} style={{ flex: 1, background: selecionada ? P : "#CBD5E1", color: WHITE, border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 700, cursor: selecionada ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
          {atual + 1 === QUIZ.length ? "Ver meu perfil e currículo! 🚀" : "Próxima →"}
        </button>
      </div>
    </div>
  );
}

// ── CHAT ────────────────────────────────────────────────
function Chat({ dados, comps }) {
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: `Oi${dados.nome ? " " + dados.nome.split(" ")[0] : ""}! 👋 Sou seu assistente de carreira. Pode me perguntar sobre entrevistas, profissões, cursos ou qualquer dúvida sobre o mercado de trabalho!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput("");
    setLoading(true);
    const system = `Você é um assistente de carreira para adolescentes brasileiros. Perfil: ${dados.nome}, ${dados.idade || ""} anos, competências: ${comps.map(id => COMP_INFO[id]?.label).join(", ")}. Responda de forma jovem, motivadora e prática. Máximo 3 parágrafos curtos. Use emojis moderadamente.`;
    const history = newMsgs.slice(1).map(m => ({ role: m.role, content: m.content }));
    try {
      const text = await callIA(history, system);
      setMsgs(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", content: "Ops! Problema de conexão. Tenta de novo 😅" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ background: P, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🤖</span>
        <div style={{ color: WHITE, fontWeight: 700, fontSize: 14 }}>Assistente de Carreira</div>
        <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#4ADE80" }} />
      </div>
      <div style={{ height: 200, overflowY: "auto", padding: "12px", background: LGRAY, display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", background: m.role === "user" ? P : WHITE, color: m.role === "user" ? WHITE : DARK, border: m.role === "assistant" ? `1px solid ${BORDER}` : "none", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "9px 13px", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ display: "flex" }}><div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: "14px 14px 14px 4px", padding: "9px 13px", fontSize: 13, color: GRAY }}>Digitando...</div></div>}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px", borderTop: `1px solid ${BORDER}`, background: WHITE }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Pergunte sobre carreira, entrevistas, vagas..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={send} disabled={!input.trim() || loading} style={{ background: P, color: WHITE, border: "none", borderRadius: 8, padding: "0 14px", cursor: "pointer", fontSize: 16 }}>→</button>
      </div>
    </div>
  );
}

// ── CURRÍCULO ───────────────────────────────────────────
function Curriculo({ dados, comps, respostasQuiz }) {
  const [tab, setTab] = useState("curriculo");
  const [curriculo, setCurriculo] = useState("");
  const [dicas, setDicas] = useState("");
  const [loading, setLoading] = useState(true);

  const compLabels = comps.map(id => COMP_INFO[id]?.label).filter(Boolean);
  const compDescs = comps.map(id => COMP_INFO[id]).filter(Boolean);

  useEffect(() => {
    const gerar = async () => {
      const base = gerarCurriculoTexto(dados, comps, respostasQuiz);

      const promptCV = `Melhore e complete este currículo para um jovem buscando o primeiro emprego. Use APENAS os dados fornecidos, nunca invente informações. Escreva um Objetivo Profissional e um Resumo de Perfil motivadores baseados nas competências identificadas. Mantenha formato profissional e neutro.

DADOS REAIS:
Nome: ${dados.nome}
${dados.idade ? `Idade: ${dados.idade}` : ""}
${dados.cidade ? `Cidade: ${dados.cidade}` : ""}
Email: ${dados.email}
${dados.telefone ? `Telefone: ${dados.telefone}` : ""}
${dados.escola ? `Escola: ${dados.escola}` : ""}
${dados.tipoFormacao ? `Formação: ${dados.tipoFormacao}${dados.serie ? ` — ${dados.serie}` : ""}` : ""}
${dados.cursos ? `Cursos: ${dados.cursos}` : ""}
Competências identificadas pelo quiz: ${compLabels.join(", ")}

ESTRUTURA OBRIGATÓRIA (use exatamente estes títulos em maiúsculas):
DADOS PESSOAIS
OBJETIVO PROFISSIONAL
RESUMO DE PERFIL
FORMAÇÃO ACADÊMICA
${dados.cursos ? "CURSOS E CERTIFICAÇÕES" : ""}
COMPETÊNCIAS
INFORMAÇÕES COMPLEMENTARES

Regra absoluta: não invente cursos, experiências, datas ou qualquer dado não fornecido acima.`;

      const promptDicas = `Este jovem fez um quiz e suas principais competências são: ${compLabels.join(", ")}.

Crie 4 dicas PERSONALIZADAS de como contar a história dele na entrevista, usando exemplos concretos do dia a dia de um adolescente brasileiro para demonstrar cada competência. 

Para cada dica:
1. Diga qual competência ela demonstra
2. Sugira uma situação real que o jovem pode ter vivido (escola, família, comunidade, hobbies)
3. Mostre como transformar isso em resposta profissional na entrevista

Use linguagem jovem e motivadora. Seja específico e prático.`;

      try {
        const [cv, d] = await Promise.all([
          callIA([{ role: "user", content: promptCV }], "Você é especialista em RH e cria currículos profissionais para jovens no Brasil. Responda apenas com o currículo formatado, sem comentários. Use linguagem profissional e neutra."),
          callIA([{ role: "user", content: promptDicas }], "Você é coach de carreira para adolescentes brasileiros. Seja prático, motivador e use linguagem jovem."),
        ]);
        setCurriculo(cv);
        setDicas(d);
      } catch {
        setCurriculo(base);
        setDicas("Não foi possível gerar dicas personalizadas. Tente novamente.");
      }
      setLoading(false);
    };
    gerar();
  }, []);

  const baixarWord = () => {
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'><style>
body{font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:2.5cm;color:#1E293B}
h1{font-size:18pt;color:#1E293B;margin:0 0 4pt;border-bottom:2pt solid #2563EB;padding-bottom:4pt}
.contato{font-size:10pt;color:#64748B;margin:0 0 14pt}
.secao{font-size:9pt;font-weight:bold;color:#2563EB;text-transform:uppercase;letter-spacing:1pt;border-bottom:1pt solid #E2E8F0;padding-bottom:3pt;margin:14pt 0 6pt}
p{margin:2pt 0;line-height:1.5}
</style></head><body>
${curriculo.split("\n").map(line => {
  if (!line.trim()) return "<br/>";
  const isHeader = /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]{3,}$/.test(line.trim());
  if (isHeader) return `<div class="secao">${line.trim()}</div>`;
  return `<p>${line}</p>`;
}).join("")}
</body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `curriculo_${(dados.nome || "meu").split(" ")[0].toLowerCase()}.doc`;
    a.click();
  };

  const tabs = [
    { key: "curriculo", label: "📄 Currículo" },
    { key: "competencias", label: "🧠 Perfil" },
    { key: "dicas", label: "💡 Entrevista" },
    { key: "guia", label: "📚 Cursos" },
    { key: "chat", label: "🤖 Chat" },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK, marginBottom: 4 }}>Seu perfil completo 🌟</h2>
      <p style={{ color: GRAY, fontSize: 13, marginBottom: 16 }}>
        Olá, <strong>{dados.nome?.split(" ")[0]}</strong>! Tudo pronto. Explore as abas abaixo!
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ whiteSpace: "nowrap", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${tab === t.key ? P : BORDER}`, background: tab === t.key ? PL : WHITE, color: tab === t.key ? P : GRAY, fontSize: 12, fontWeight: tab === t.key ? 700 : 500, cursor: "pointer", fontFamily: "inherit" }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: GRAY }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>Gerando seu currículo com IA...</p>
          <p style={{ fontSize: 12 }}>Isso pode levar alguns segundos</p>
        </div>
      )}

      {!loading && tab === "curriculo" && (
        <div>
          {/* Preview visual do CV */}
          <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px", marginBottom: 12, maxHeight: 420, overflowY: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {curriculo.split("\n").map((line, i) => {
              if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
              const isNome = i === 0;
              const isSecao = /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]{3,}$/.test(line.trim()) && !isNome;
              if (isNome) return <h2 key={i} style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: "0 0 2px", borderBottom: `2px solid ${P}`, paddingBottom: 6 }}>{line}</h2>;
              if (isSecao) return <div key={i} style={{ fontSize: 10, fontWeight: 800, color: P, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${BORDER}`, paddingBottom: 3, marginTop: 14, marginBottom: 6 }}>{line}</div>;
              return <p key={i} style={{ fontSize: 13, color: DARK, lineHeight: 1.7, margin: "2px 0" }}>{line}</p>;
            })}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={baixarWord} style={{ flex: 2, background: P, color: WHITE, border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              ⬇️ Baixar como Word (.doc)
            </button>
            <button onClick={() => { navigator.clipboard?.writeText(curriculo); alert("Copiado! 📋"); }} style={{ flex: 1, background: WHITE, color: P, border: `2px solid ${P}`, borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              📋 Copiar
            </button>
          </div>
        </div>
      )}

      {!loading && tab === "competencias" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 13, color: GRAY, margin: "0 0 8px" }}>Suas <strong>{compDescs.length} principais competências</strong> identificadas pelo quiz:</p>
          {compDescs.map((comp, i) => (
            <div key={i} style={{ background: WHITE, border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px", borderLeft: `4px solid ${P}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }}>{comp.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: DARK }}>{comp.label}</div>
                  <div style={{ fontSize: 12, color: P, fontWeight: 600 }}>Competência #{i + 1}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: GRAY, margin: 0, lineHeight: 1.5 }}>{comp.desc}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "dicas" && (
        <div>
          <div style={{ background: PL, border: `1px solid ${P}20`, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: P, fontWeight: 700, margin: "0 0 4px" }}>💡 Como contar sua história</p>
            <p style={{ fontSize: 12, color: GRAY, margin: 0 }}>Dicas personalizadas baseadas no seu perfil para se destacar na entrevista</p>
          </div>
          <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px", maxHeight: 380, overflowY: "auto", whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.7, color: DARK }}>
            {dicas}
          </div>
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 10 }}>🎤 Dicas gerais de entrevista:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DICAS_ENTREVISTA.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 12, background: LGRAY, borderRadius: 10, padding: "10px 12px" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{d.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: DARK, marginBottom: 2 }}>{d.titulo}</div>
                    <div style={{ fontSize: 12, color: GRAY, lineHeight: 1.5 }}>{d.dica}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && tab === "guia" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto" }}>
          <p style={{ fontSize: 13, color: GRAY, margin: "0 0 8px" }}>🎓 Cursos gratuitos com certificado reconhecido:</p>
          {CURSOS.map((c, i) => (
            <div key={i} style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: DARK, marginBottom: 2 }}>{c.nome}</div>
                <div style={{ fontSize: 12, color: GRAY }}>{c.areas}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <span style={{ background: "#DCFCE7", color: GREEN, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>{c.badge}</span>
                <a href={c.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: P, fontWeight: 600, textDecoration: "none" }}>Acessar →</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "chat" && <Chat dados={dados} comps={comps} />}

      {!loading && (
        <button onClick={() => window.location.reload()} style={{ width: "100%", marginTop: 14, padding: "10px", borderRadius: 10, border: `1.5px solid ${BORDER}`, background: WHITE, color: GRAY, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          🔄 Recomeçar do início
        </button>
      )}
    </div>
  );
}

// ── APP ─────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("inicio");
  const [dados, setDados] = useState({});
  const [comps, setComps] = useState([]);
  const [respostasQuiz, setRespostasQuiz] = useState([]);

  const upd = (k, v) => setDados(p => ({ ...p, [k]: v }));

  return (
    <div style={{ maxWidth: 580, margin: "0 auto", padding: "16px 16px 48px", fontFamily: "'Inter', system-ui, sans-serif", background: WHITE, minHeight: "100vh" }}>
      {step !== "inicio" && <ProgressBar step={step} />}
      {step === "inicio" && <Inicio onNext={() => setStep("perfil")} />}
      {step === "perfil" && <Perfil dados={dados} onChange={upd} onNext={() => setStep("quiz")} onBack={() => setStep("inicio")} />}
      {step === "quiz" && <Quiz onFinalizar={(c, r) => { setComps(c); setRespostasQuiz(r); setStep("curriculo"); }} onBack={() => setStep("perfil")} />}
      {step === "curriculo" && <Curriculo dados={dados} comps={comps} respostasQuiz={respostasQuiz} />}
    </div>
  );
}

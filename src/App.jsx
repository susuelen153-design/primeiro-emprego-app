import { useState, useRef, useEffect } from "react";

// ── TEMA DARK / GAME ────────────────────────────────────
const C = {
  bg:      "#0F0F1A",
  card:    "#1A1A2E",
  card2:   "#16213E",
  border:  "#2D2D5E",
  purple:  "#9B5CF6",
  purpleD: "#7C3AED",
  cyan:    "#06B6D4",
  green:   "#22C55E",
  yellow:  "#EAB308",
  pink:    "#EC4899",
  red:     "#EF4444",
  white:   "#F1F5F9",
  gray:    "#94A3B8",
  grayD:   "#475569",
  xp:      "#F59E0B",
};

const STEPS = ["inicio", "perfil", "quiz", "curriculo"];

const XP_POR_STEP = { perfil: 150, quiz: 300, curriculo: 500 };

// ── QUIZ ────────────────────────────────────────────────
const QUIZ = [
  {
    id: "q1",
    pergunta: "Rolou um trabalho em grupo na escola. O que você faz?",
    opcoes: [
      { texto: "Já organizo tudo, divido as tarefas e garanto que vai sair no prazo", comps: ["organizacao", "lideranca"] },
      { texto: "Animo o grupo, jogo energia e deixo todo mundo motivado", comps: ["comunicacao", "equipe"] },
      { texto: "Pesquiso, trago as ideias mais criativas e diferentes", comps: ["criatividade", "aprendizado"] },
      { texto: "Fico de olho nos detalhes pra não sair nada errado", comps: ["responsabilidade", "organizacao"] },
    ],
  },
  {
    id: "q2",
    pergunta: "Surgiu um problema que ninguém sabe resolver. E aí?",
    opcoes: [
      { texto: "Tomo a frente e já proponho uma solução", comps: ["proatividade", "lideranca"] },
      { texto: "Converso com todo mundo pra entender melhor antes de agir", comps: ["comunicacao", "equipe"] },
      { texto: "Vou pesquisar sozinho até achar a resposta", comps: ["aprendizado", "responsabilidade"] },
      { texto: "Penso em algo criativo que ninguém pensou ainda", comps: ["criatividade", "proatividade"] },
    ],
  },
  {
    id: "q3",
    pergunta: "As pessoas te pedem ajuda pra quê com mais frequência?",
    opcoes: [
      { texto: "Explicar ou ensinar algo que eu sei bem", comps: ["comunicacao", "aprendizado"] },
      { texto: "Organizar evento, aniversário, rolê com a galera", comps: ["organizacao", "lideranca"] },
      { texto: "Criar algo diferente, bonito ou original", comps: ["criatividade", "proatividade"] },
      { texto: "Resolver um problema prático que tá travado", comps: ["responsabilidade", "equipe"] },
    ],
  },
  {
    id: "q4",
    pergunta: "Como você aprende melhor as paradas novas?",
    opcoes: [
      { texto: "Tutorial no YouTube e praticando sozinho até pegar o jeito", comps: ["aprendizado", "proatividade"] },
      { texto: "Com alguém me ensinando e podendo tirar dúvida na hora", comps: ["comunicacao", "equipe"] },
      { texto: "Tentando, errando e tentando de novo até funcionar", comps: ["responsabilidade", "criatividade"] },
      { texto: "Lendo tudo, fazendo anotações e me organizando direito", comps: ["organizacao", "aprendizado"] },
    ],
  },
  {
    id: "q5",
    pergunta: "Você tem um prazo pra entregar algo importante. Como age?",
    opcoes: [
      { texto: "Começo antes do tempo e entrego adiantado", comps: ["proatividade", "organizacao"] },
      { texto: "Me organizo bem e entrego certinho no prazo", comps: ["responsabilidade", "organizacao"] },
      { texto: "Peço ajuda se travar e termino com a galera", comps: ["equipe", "comunicacao"] },
      { texto: "Me foco e dou o máximo até o final", comps: ["responsabilidade", "aprendizado"] },
    ],
  },
  {
    id: "q6",
    pergunta: "No tempo livre, o que você mais curte fazer?",
    opcoes: [
      { texto: "Criar conteúdo, desenhar, inventar parada nova", comps: ["criatividade", "proatividade"] },
      { texto: "Ajudar alguém da família ou um amigo com algo", comps: ["equipe", "responsabilidade"] },
      { texto: "Aprender uma skill nova por conta própria", comps: ["aprendizado", "proatividade"] },
      { texto: "Organizar, planejar ou montar algo do zero", comps: ["organizacao", "lideranca"] },
    ],
  },
];

const COMP_INFO = {
  comunicacao:      { label: "Comunicação",            emoji: "🗣️", cor: C.cyan,   desc: "Você sabe se expressar bem, tanto falando quanto escrevendo. Isso abre muita porta em atendimento, vendas e trabalho em equipe." },
  equipe:           { label: "Trabalho em Equipe",     emoji: "🤝", cor: C.purple, desc: "Você funciona bem junto com outras pessoas e entende que em time o resultado é maior. Toda empresa valoriza isso." },
  organizacao:      { label: "Organização",            emoji: "📋", cor: C.green,  desc: "Você planeja, prioriza e cumpre o que prometeu. Em qualquer área isso faz diferença desde o primeiro dia." },
  proatividade:     { label: "Proatividade",           emoji: "🚀", cor: C.yellow, desc: "Você age sem precisar ser mandado e vai além do esperado. Quem tem isso se destaca rápido em qualquer lugar." },
  criatividade:     { label: "Criatividade",           emoji: "💡", cor: C.pink,   desc: "Você pensa diferente e encontra saídas que outros não viram. Empresas modernas adoram quem traz ideias novas." },
  responsabilidade: { label: "Responsabilidade",       emoji: "✅", cor: C.green,  desc: "Você assume o que prometeu e cumpre. Confiança é a base de qualquer relação profissional." },
  lideranca:        { label: "Liderança",              emoji: "👑", cor: C.yellow, desc: "Você influencia pessoas de forma natural. Mesmo sem cargo, líderes fazem o time andar pra frente." },
  aprendizado:      { label: "Aprende Rápido",         emoji: "🧠", cor: C.cyan,   desc: "Você absorve conhecimento novo com facilidade e se adapta. No mercado de hoje essa é uma das skills mais valorizadas." },
};

const TURNOS = ["Manhã", "Tarde", "Noite", "Manhã e Tarde", "Tarde e Noite", "Qualquer horário", "Fins de semana", "Período integral"];

const CURSOS = [
  { nome: "Escola Virtual Bradesco", url: "https://www.ev.org.br/cursos", areas: "Informática, Administração, IA, Inglês — +88 cursos gratuitos", badge: "TOP" },
  { nome: "FIAP — Eu Capacito", url: "https://on.fiap.com.br/local/programaeucapacito/", areas: "Tecnologia, IA, Programação, Segurança — +250 cursos gratuitos", badge: "FIAP" },
  { nome: "FGV Online", url: "https://educacao-executiva.fgv.br/cursos/gratuitos", areas: "Negócios, Gestão, Finanças, Direito, IA — +200 cursos gratuitos", badge: "FGV" },
  { nome: "Harvard — HarvardX", url: "https://www.edx.org/school/harvardx", areas: "Computação, IA, Negócios, Dados — legendas em português", badge: "Harvard" },
  { nome: "Google Skillshop", url: "https://skillshop.withgoogle.com", areas: "Marketing Digital, Analytics, IA — certificado Google", badge: "Google" },
  { nome: "Microsoft Learn", url: "https://learn.microsoft.com/pt-br/training/browse", areas: "Office, Power BI, Azure, IA", badge: "Microsoft" },
  { nome: "IBM SkillsBuild", url: "https://skillsbuild.org/pt-BR", areas: "IA, Dados, Cibersegurança, Cloud", badge: "IBM" },
  { nome: "SENAI Play", url: "https://play.senai.br/cursos", areas: "Tecnologia, Indústria, Qualidade", badge: "SENAI" },
  { nome: "Khan Academy", url: "https://pt.khanacademy.org", areas: "Matemática, Programação, Ciências — 100% gratuito", badge: "Khan" },
  { nome: "SEBRAE Online", url: "https://www.sebrae.com.br/sites/PortalSebrae/cursosonline", areas: "Empreendedorismo, Vendas, Gestão", badge: "SEBRAE" },
];

const DICAS_ENTREVISTA = [
  { icon: "✨", titulo: "Veste o que te faz sentir bem", dica: "Não tem roupa certa nem errada. O que importa é você se sentir confortável e confiante. Só evita boné e bermuda, que passam a ideia de descuido." },
  { icon: "⏰", titulo: "Chega antes do horário", dica: "Uns 10 minutinhos antes já basta. Pesquisa o caminho com antecedência pra não ter surpresa." },
  { icon: "🔍", titulo: "Pesquisa a empresa antes", dica: "Dá uma olhada no site ou Instagram deles. Quando perguntarem por que você quer trabalhar lá, você vai ter o que responder de verdade." },
  { icon: "💬", titulo: "Suas histórias valem ouro", dica: "Não precisa ter trabalhado antes. Conta sobre algo que organizou, vendeu, ensinou ou ajudou. Isso é experiência de verdade." },
  { icon: "👀", titulo: "Olha nos olhos e relaxa", dica: "Nervoso é normal, todo mundo fica. Respira fundo, fala com calma e olha pra pessoa. Isso já passa muita confiança." },
  { icon: "❓", titulo: "Pergunta sobre a vaga", dica: "No final, pergunta algo tipo: quais são as principais tarefas do dia a dia? Mostra que você quer entender de verdade." },
  { icon: "🤐", titulo: "Sem falar mal de ninguém", dica: "Nem de escola, professores ou colegas. Não precisa fingir que tudo foi perfeito, só guarda as críticas pra você." },
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

// ── ESTILOS BASE ────────────────────────────────────────
const cardStyle = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: `1.5px solid ${C.border}`,
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  background: C.card2,
  color: C.white,
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  cursor: "pointer",
};

function Label({ children }) {
  return <label style={{ fontSize: 12, fontWeight: 700, color: C.gray, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{children}</label>;
}

function GradBtn({ children, onClick, disabled, outline }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? C.grayD : outline ? "transparent" : `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
      color: C.white,
      border: outline ? `2px solid ${C.purple}` : "none",
      borderRadius: 12,
      padding: "13px 20px",
      fontSize: 15,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      width: "100%",
      opacity: disabled ? 0.5 : 1,
    }}>{children}</button>
  );
}

// ── XP BAR ──────────────────────────────────────────────
function XPBar({ xp }) {
  const max = 950;
  const pct = Math.min((xp / max) * 100, 100);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.xp }}>⚡ {xp} XP</span>
        <span style={{ fontSize: 11, color: C.gray }}>Nível {xp < 150 ? 1 : xp < 450 ? 2 : xp < 950 ? 3 : 4}</span>
      </div>
      <div style={{ height: 6, background: C.border, borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.purple}, ${C.cyan})`, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

// ── TELA INÍCIO ─────────────────────────────────────────
function Inicio({ onNext }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0 28px" }}>
      <div style={{ fontSize: 64, marginBottom: 10 }}>🎮</div>
      <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 6px", background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        PrimeiroEmprego
      </h1>
      <p style={{ fontSize: 14, color: C.gray, marginBottom: 28, lineHeight: 1.7 }}>
        Descobre suas skills, monta seu currículo<br />e chega na entrevista preparado 🚀
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
        {[
          { emoji: "🧩", label: "Quiz de perfil", cor: C.purple },
          { emoji: "📄", label: "Currículo com IA", cor: C.cyan },
          { emoji: "🎤", label: "Dicas de entrevista", cor: C.green },
        ].map((f, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${f.cor}40`, borderRadius: 14, padding: "16px 8px" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{f.emoji}</div>
            <div style={{ fontSize: 11, color: f.cor, fontWeight: 700 }}>{f.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20, textAlign: "left" }}>
        <div style={{ fontSize: 12, color: C.gray, marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>📍 Sua missão</div>
        {["Complete seu perfil", "Faça o quiz e descubra suas skills", "Gere seu currículo e se prepare"].map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 8 : 0 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${C.purple}30`, border: `1px solid ${C.purple}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.purple, flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 13, color: C.white }}>{m}</span>
          </div>
        ))}
      </div>

      <GradBtn onClick={onNext}>Começar a jornada ⚡</GradBtn>
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
  "Graduação": ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º semestre", "Concluído"],
};

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const ANOS = Array.from({length: 10}, (_, i) => String(new Date().getFullYear() - i));
const TIPOS_EXP = ["Emprego com carteira assinada","Estágio","Jovem Aprendiz","Freela / Autônomo","Trabalho em negócio da família","Voluntariado","Outro"];

function ExperienciaCard({ exp, idx, onChange, onRemove }) {
  const chg = (k, v) => onChange(idx, { ...exp, [k]: v });
  return (
    <div style={{ background: C.card2, border: `1.5px solid ${C.purple}40`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.purple }}>Experiência #{idx + 1}</span>
        <button onClick={onRemove} style={{ background: "transparent", border: "none", color: C.gray, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>✕</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ gridColumn: "span 2" }}>
          <Label>Tipo de experiência</Label>
          <select style={selectStyle} value={exp.tipo || ""} onChange={e => chg("tipo", e.target.value)}>
            <option value="" disabled>Selecione...</option>
            {TIPOS_EXP.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <Label>Cargo / Função</Label>
          <input style={inputStyle} placeholder="Ex: Atendente, Designer, Assistente..." value={exp.cargo || ""} onChange={e => chg("cargo", e.target.value)} />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <Label>Empresa / Cliente / Local</Label>
          <input style={inputStyle} placeholder="Ex: Lanchonete X, Freela p/ clientes, Negócio da família..." value={exp.empresa || ""} onChange={e => chg("empresa", e.target.value)} />
        </div>
        <div>
          <Label>Início</Label>
          <div style={{ display: "flex", gap: 6 }}>
            <select style={{ ...selectStyle, flex: 1 }} value={exp.inicioMes || ""} onChange={e => chg("inicioMes", e.target.value)}>
              <option value="" disabled>Mês</option>
              {MESES.map((m, i) => <option key={m} value={String(i+1).padStart(2,"0")}>{m}</option>)}
            </select>
            <select style={{ ...selectStyle, flex: 1 }} value={exp.inicioAno || ""} onChange={e => chg("inicioAno", e.target.value)}>
              <option value="" disabled>Ano</option>
              {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label>Fim</Label>
          <div style={{ display: "flex", gap: 6 }}>
            {exp.atual ? (
              <div style={{ flex: 1, padding: "10px 12px", background: `${C.green}20`, border: `1.5px solid ${C.green}40`, borderRadius: 8, fontSize: 13, color: C.green, fontWeight: 600 }}>Atual</div>
            ) : (
              <>
                <select style={{ ...selectStyle, flex: 1 }} value={exp.fimMes || ""} onChange={e => chg("fimMes", e.target.value)}>
                  <option value="" disabled>Mês</option>
                  {MESES.map((m, i) => <option key={m} value={String(i+1).padStart(2,"0")}>{m}</option>)}
                </select>
                <select style={{ ...selectStyle, flex: 1 }} value={exp.fimAno || ""} onChange={e => chg("fimAno", e.target.value)}>
                  <option value="" disabled>Ano</option>
                  {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </>
            )}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={exp.atual || false} onChange={e => chg("atual", e.target.checked)} style={{ accentColor: C.purple }} />
            <span style={{ fontSize: 12, color: C.gray }}>Trabalho atual</span>
          </label>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <Label>O que você fazia? (opcional)</Label>
          <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60, lineHeight: 1.5 }}
            placeholder="Descreva brevemente suas tarefas e o que aprendeu..."
            value={exp.descricao || ""}
            onChange={e => chg("descricao", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function Perfil({ dados, onChange, onNext, onBack }) {
  const canNext = dados.nome && dados.email;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 24 }}>👤</span>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.white, margin: 0 }}>Fase 1: Seu perfil</h2>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: C.xp, background: `${C.xp}20`, padding: "3px 10px", borderRadius: 99 }}>+150 XP</span>
      </div>
      <p style={{ color: C.gray, fontSize: 13, marginBottom: 20 }}>Essas info vão pro seu currículo. Os * são obrigatórios.</p>

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
          <Label>WhatsApp</Label>
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
            <option value="" disabled>{dados.tipoFormacao ? "Selecione..." : "Escolha o tipo"}</option>
            {(SERIES[dados.tipoFormacao] || []).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <Label>Disponibilidade para trabalhar</Label>
          <select style={selectStyle} value={dados.turno || ""} onChange={e => onChange("turno", e.target.value)}>
            <option value="" disabled>Selecione o turno...</option>
            {TURNOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <Label>Cursos que já fez (opcional)</Label>
          <input style={inputStyle} placeholder="Ex: Excel básico, inglês, informática..." value={dados.cursos || ""} onChange={e => onChange("cursos", e.target.value)} />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <Label>Já trabalhou ou fez algum freela?</Label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Sim", "Não"].map(op => (
              <button key={op} type="button" onClick={() => onChange("temExperiencia", op)}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: `2px solid ${dados.temExperiencia === op ? C.purple : C.border}`, background: dados.temExperiencia === op ? `${C.purple}20` : C.card2, color: dados.temExperiencia === op ? C.purple : C.gray, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                {op === "Sim" ? "✅ Sim" : "❌ Ainda não"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {dados.temExperiencia === "Sim" && (
        <div style={{ marginBottom: 16 }}>
          {(dados.experiencias || []).map((exp, idx) => (
            <ExperienciaCard
              key={idx}
              exp={exp}
              idx={idx}
              onChange={(i, val) => {
                const novas = [...(dados.experiencias || [])];
                novas[i] = val;
                onChange("experiencias", novas);
              }}
              onRemove={() => {
                const novas = (dados.experiencias || []).filter((_, i) => i !== idx);
                onChange("experiencias", novas);
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => onChange("experiencias", [...(dados.experiencias || []), {}])}
            style={{ width: "100%", padding: "11px", borderRadius: 10, border: `2px dashed ${C.purple}60`, background: "transparent", color: C.purple, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 4 }}
          >
            + Adicionar experiência
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack} style={{ padding: "13px 18px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: "transparent", color: C.gray, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>← Voltar</button>
        <div style={{ flex: 1 }}>
          <GradBtn onClick={onNext} disabled={!canNext}>Próxima fase → 🧩</GradBtn>
        </div>
      </div>
    </div>
  );
}

// ── QUIZ ────────────────────────────────────────────────
function Quiz({ onFinalizar, onBack }) {
  const [atual, setAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [animating, setAnimating] = useState(false);

  const pergunta = QUIZ[atual];
  const progresso = Math.round(((atual) / QUIZ.length) * 100);

  const avancar = () => {
    if (!selecionada || animating) return;
    setAnimating(true);
    setTimeout(() => {
      const novas = [...respostas, { questao: pergunta.id, comps: selecionada }];
      if (atual + 1 < QUIZ.length) {
        setRespostas(novas);
        setAtual(atual + 1);
        setSelecionada(null);
        setAnimating(false);
      } else {
        const contagem = {};
        novas.forEach(r => r.comps.forEach(c => { contagem[c] = (contagem[c] || 0) + 1; }));
        const ordenadas = Object.entries(contagem).sort((a, b) => b[1] - a[1]).map(([id]) => id);
        onFinalizar(ordenadas.slice(0, 5), novas);
      }
    }, 300);
  };

  const cores = [C.purple, C.cyan, C.green, C.pink];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 24 }}>🧩</span>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.white, margin: 0 }}>Fase 2: Descobrir suas skills</h2>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: C.xp, background: `${C.xp}20`, padding: "3px 10px", borderRadius: 99 }}>+300 XP</span>
      </div>
      <p style={{ color: C.gray, fontSize: 13, marginBottom: 16 }}>Responde com sinceridade. Não tem certo nem errado!</p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ flex: 1, height: 8, background: C.border, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progresso}%`, background: `linear-gradient(90deg, ${C.purple}, ${C.cyan})`, borderRadius: 99, transition: "width 0.4s" }} />
        </div>
        <span style={{ fontSize: 12, color: C.gray, fontWeight: 700, flexShrink: 0 }}>{atual + 1} / {QUIZ.length}</span>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {QUIZ.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < atual ? C.purple : i === atual ? C.cyan : C.border, transition: "background 0.3s" }} />
        ))}
      </div>

      <div style={{ ...cardStyle, marginBottom: 16, borderColor: C.purple + "60" }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: C.white, margin: 0, lineHeight: 1.5 }}>{pergunta.pergunta}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {pergunta.opcoes.map((op, i) => {
          const sel = JSON.stringify(selecionada) === JSON.stringify(op.comps);
          return (
            <div key={i} onClick={() => setSelecionada(op.comps)} style={{
              border: `2px solid ${sel ? cores[i] : C.border}`,
              borderRadius: 14,
              padding: "14px 16px",
              cursor: "pointer",
              background: sel ? `${cores[i]}15` : C.card2,
              transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${sel ? cores[i] : C.grayD}`, background: sel ? cores[i] : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                {sel && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.white }} />}
              </div>
              <span style={{ fontSize: 14, color: sel ? C.white : C.gray, lineHeight: 1.4, transition: "color 0.2s" }}>{op.texto}</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {atual > 0 && (
          <button onClick={() => { setAtual(atual - 1); setSelecionada(null); }} style={{ padding: "13px 18px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: "transparent", color: C.gray, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>← Voltar</button>
        )}
        <div style={{ flex: 1 }}>
          <GradBtn onClick={avancar} disabled={!selecionada}>
            {atual + 1 === QUIZ.length ? "Ver minhas skills! 🚀" : "Próxima →"}
          </GradBtn>
        </div>
      </div>
    </div>
  );
}

// ── CHAT ────────────────────────────────────────────────
function Chat({ dados, comps }) {
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: `E aí${dados.nome ? " " + dados.nome.split(" ")[0] : ""}! 👋 Pode mandar suas dúvidas sobre emprego, entrevistas, vagas ou carreira que eu te ajudo!` }
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
    const system = `Você é um amigo mais velho ajudando ${dados.nome || "um jovem"} a conseguir o primeiro emprego no Brasil. Skills identificadas: ${comps.map(id => COMP_INFO[id]?.label).filter(Boolean).join(", ")}. Fale de forma natural, direta e descontraída como um amigo de verdade. Sem frases motivacionais forçadas, sem travessões excessivos, sem formalidade. Seja breve e prático. Use emojis com moderação.`;
    const history = newMsgs.slice(1).map(m => ({ role: m.role, content: m.content }));
    try {
      const text = await callIA(history, system);
      setMsgs(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", content: "Ops, tive um problema aqui. Tenta de novo! 😅" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ background: `linear-gradient(135deg, ${C.purpleD}, #1a1a2e)`, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🤖</span>
        <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>Assistente de Carreira</div>
        <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: C.green }} />
      </div>
      <div style={{ height: 220, overflowY: "auto", padding: "12px", background: C.bg, display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", background: m.role === "user" ? `linear-gradient(135deg, ${C.purple}, ${C.purpleD})` : C.card, color: C.white, border: m.role === "assistant" ? `1px solid ${C.border}` : "none", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "9px 13px", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "14px 14px 14px 4px", padding: "9px 13px", color: C.gray, fontSize: 13 }}>Digitando...</div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px", borderTop: `1px solid ${C.border}`, background: C.card }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Manda sua dúvida aqui..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={send} disabled={!input.trim() || loading} style={{ background: C.purple, color: C.white, border: "none", borderRadius: 8, padding: "0 16px", cursor: "pointer", fontSize: 16 }}>→</button>
      </div>
    </div>
  );
}

// ── CURRICULO ───────────────────────────────────────────
function Curriculo({ dados, comps, xp, onAddXP }) {
  const [tab, setTab] = useState("curriculo");
  const [curriculo, setCurriculo] = useState("");
  const [dicas, setDicas] = useState("");
  const [loading, setLoading] = useState(true);
  const [xpAdded, setXpAdded] = useState(false);

  const compLabels = comps.map(id => COMP_INFO[id]?.label).filter(Boolean);
  const compDescs = comps.map(id => COMP_INFO[id]).filter(Boolean);

  useEffect(() => {
    const gerar = async () => {
      const promptCV = `Crie um currículo profissional para jovem buscando o primeiro emprego.

DADOS REAIS (use SOMENTE estes, nunca invente):
Nome: ${dados.nome}
${dados.idade ? `Idade: ${dados.idade}` : ""}
${dados.cidade ? `Cidade: ${dados.cidade}` : ""}
Email: ${dados.email}
${dados.telefone ? `Telefone: ${dados.telefone}` : ""}
${dados.escola ? `Escola: ${dados.escola}` : ""}
${dados.tipoFormacao ? `Formação: ${dados.tipoFormacao}${dados.serie ? ` — ${dados.serie}` : ""}` : ""}
${dados.turno ? `Disponibilidade: ${dados.turno}` : ""}
${dados.cursos ? `Cursos: ${dados.cursos}` : ""}
Skills identificadas: ${compLabels.join(", ")}
${dados.temExperiencia === "Sim" && dados.experiencias?.length ? `Experiências anteriores:
${(dados.experiencias || []).map((e, i) => `${i+1}. ${e.tipo || ""} | ${e.cargo || ""} | ${e.empresa || ""} | ${e.inicioMes ? MESES[parseInt(e.inicioMes)-1] : ""}/${e.inicioAno || ""} até ${e.atual ? "Atual" : `${e.fimMes ? MESES[parseInt(e.fimMes)-1] : ""}/${e.fimAno || ""}`}${e.descricao ? ` | ${e.descricao}` : ""}`).join("\n")}` : ""}

ESTRUTURA OBRIGATÓRIA (siga exatamente esta ordem):
- Primeira linha: apenas o nome completo da pessoa, sem nenhum título antes
- Segunda linha: cidade, telefone e email separados por | 
- Depois as seções em maiúsculas nesta ordem: OBJETIVO PROFISSIONAL, RESUMO DE PERFIL${dados.temExperiencia === "Sim" && dados.experiencias?.length ? ", EXPERIÊNCIA PROFISSIONAL" : ""}, FORMAÇÃO ACADÊMICA${dados.cursos ? ", CURSOS E CERTIFICAÇÕES" : ""}, HABILIDADES, DISPONIBILIDADE, INFORMAÇÕES COMPLEMENTARES

${dados.temExperiencia === "Sim" && dados.experiencias?.length ? "Na seção EXPERIÊNCIA PROFISSIONAL: use exatamente os dados informados (cargo, empresa, período). Escreva de forma profissional valorizando qualquer tipo de experiência, formal ou informal. Não invente nada." : "Não inclua seção de experiência profissional."}
NÃO coloque "DADOS PESSOAIS" como título antes do nome. O nome já é o cabeçalho.

Escreve de forma humana e direta. Sem frases genéricas de IA, sem travessões decorativos. Objetivo e resumo devem soar como uma pessoa real falando sobre si mesma.`;

      const promptDicas = `${dados.nome || "Este jovem"} fez um quiz e as principais skills são: ${compLabels.join(", ")}.

Cria 4 dicas de como contar a história dele numa entrevista. Para cada skill, sugere uma situação concreta que um adolescente brasileiro pode ter vivido de verdade, focando em:
- Projetos escolares relevantes (feiras, apresentações, trabalhos que deram resultado)
- Criação de conteúdo digital (edição, redes sociais, design, programação)
- Geração de renda própria (venda de produtos, serviços, freelas)
- Voluntariado e ação comunitária (igreja, ONG, projeto social, campanha)
- Ensinar ou ajudar alguém (reforço escolar, tutoriais, suporte técnico)
- Aprendizado autônomo (cursos online, tutoriais, projetos pessoais)
- Liderança informal (organizar grupo, mediar conflito, coordenar algo)

Não dê exemplos específicos nem nichos como "feira de ciências" ou "venda de bolo". Em vez disso, sugere perguntas que a pessoa pode se fazer pra lembrar de algo que viveu: "você já organizou alguma coisa?", "já ajudou alguém a resolver um problema?", "já aprendeu algo por conta própria?".

O objetivo é abrir a memória da pessoa, não dar um roteiro pronto. Cada dica deve terminar com uma dica de como transformar qualquer situação que ela lembrar numa resposta natural na entrevista.

Escreve como um amigo mais velho, sem frases motivacionais, sem travessões excessivos e sem exemplos que nicham demais.`;

      try {
        const [cv, d] = await Promise.all([
          callIA([{ role: "user", content: promptCV }], "Você cria currículos para jovens brasileiros. Responda apenas com o currículo formatado, sem comentários. Linguagem humana e direta, sem clichês de IA, sem travessões decorativos. Evite palavras como 'discutir', 'anseio', 'vislumbrar', 'almejo' e outras que soam artificiais. Use frases naturais como 'trocar ideias', 'contribuir com', 'aprender com a equipe', 'fazer parte de'."),
          callIA([{ role: "user", content: promptDicas }], "Você é um amigo mais velho ajudando um adolescente brasileiro a se preparar para entrevistas. Linguagem natural, direta e descontraída."),
        ]);
        setCurriculo(cv);
        setDicas(d);
      } catch {
        setCurriculo(`${dados.nome || ""}\n${[dados.cidade, dados.telefone, dados.email].filter(Boolean).join("  |  ")}\n\nOBJETIVO PROFISSIONAL\nBusco minha primeira oportunidade de trabalho para aprender, crescer e contribuir com a equipe.\n\nFORMAÇÃO ACADÊMICA\n${dados.tipoFormacao || ""}${dados.serie ? " — " + dados.serie : ""}${dados.escola ? " | " + dados.escola : ""}\n\nHABILIDADES\n${compLabels.map(c => "• " + c).join("\n")}\n\nDISPONIBILIDADE\n${dados.turno || "A combinar"}`);
        setDicas("Sem conexão com a IA no momento. Tenta gerar de novo!");
      }
      setLoading(false);
      if (!xpAdded) { onAddXP(500); setXpAdded(true); }
    };
    gerar();
  }, []);

  const baixarWord = () => {
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'><style>
body{font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:2.5cm;color:#1E293B;line-height:1.5}
.nome{font-size:26pt;font-weight:900;color:#1E293B;text-align:center;margin:0 0 2pt;border:none}
.subdados{font-size:8pt;color:#94A3B8;text-align:center;text-transform:uppercase;letter-spacing:1pt;border-bottom:2pt solid #2563EB;padding-bottom:6pt;margin:0 0 14pt}
.contato{font-size:10pt;color:#475569;text-align:center;margin:4pt 0 6pt}
.secao{font-size:9pt;font-weight:bold;color:#2563EB;text-transform:uppercase;letter-spacing:1pt;border-bottom:1pt solid #E2E8F0;padding-bottom:3pt;margin:14pt 0 6pt}
p{margin:2pt 0}
</style></head><body>
${curriculo.split("\n").map((line, i) => {
  if (!line.trim()) return "<br/>";
  if (i === 0) return `<div class="nome">${line}</div>`;
  if (i === 1 && (line.includes("@") || line.includes("|"))) return `<div class="contato">${line}</div>`;
  const isSecao = /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]{3,}$/.test(line.trim());
  if (isSecao) return `<div class="secao">${line.trim()}</div>`;
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
    { key: "skills", label: "⚡ Skills" },
    { key: "entrevista", label: "🎤 Entrevista" },
    { key: "cursos", label: "🎓 Cursos" },
    { key: "chat", label: "🤖 Chat" },
  ];

  return (
    <div>
      <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${C.purpleD}30, ${C.cyan}20)`, border: `1px solid ${C.purple}40`, marginBottom: 16, textAlign: "center", padding: "16px" }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>🏆</div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: C.white, margin: "0 0 4px" }}>
          Parabéns, {dados.nome?.split(" ")[0]}!
        </h2>
        <p style={{ fontSize: 13, color: C.gray, margin: 0 }}>Seu perfil tá pronto. Explora as abas abaixo!</p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ whiteSpace: "nowrap", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${tab === t.key ? C.purple : C.border}`, background: tab === t.key ? `${C.purple}20` : C.card2, color: tab === t.key ? C.purple : C.gray, fontSize: 12, fontWeight: tab === t.key ? 700 : 500, cursor: "pointer", fontFamily: "inherit" }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.white }}>Gerando seu currículo...</p>
          <p style={{ fontSize: 12, color: C.gray }}>A IA tá trabalhando por você!</p>
        </div>
      )}

      {!loading && tab === "curriculo" && (
        <div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "28px 24px", marginBottom: 12, maxHeight: 440, overflowY: "auto" }}>
            {curriculo.split("\n").map((line, i) => {
              if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
              const nonEmpty = curriculo.split("\n").filter(l => l.trim());
              const firstLine = nonEmpty[0];
              const secondLine = nonEmpty[1];
              const isNome = line.trim() === firstLine?.trim() && i === curriculo.split("\n").findIndex(l => l.trim());
              const isContato = line.trim() === secondLine?.trim() && (line.includes("@") || line.includes("|") || /^[A-Za-z].*\//.test(line));
              const isDadosPessoais = line.trim().toUpperCase() === "DADOS PESSOAIS";
              const isSecao = !isNome && !isContato && !isDadosPessoais && /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]{3,}$/.test(line.trim());
              if (isDadosPessoais) return null;
              if (isNome) return <div key={i} style={{ textAlign: "center", paddingBottom: 10, marginBottom: 6, borderBottom: "2px solid #2563EB" }}><h1 style={{ fontSize: 24, fontWeight: 900, color: "#1E293B", margin: 0 }}>{line}</h1></div>;
              if (isContato) return <p key={i} style={{ fontSize: 11, color: "#475569", textAlign: "center", margin: "4px 0 12px" }}>{line}</p>;
              if (isSecao) return <div key={i} style={{ fontSize: 9, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #E2E8F0", paddingBottom: 3, marginTop: 14, marginBottom: 6 }}>{line}</div>;
              return <p key={i} style={{ fontSize: 12, color: "#1E293B", lineHeight: 1.7, margin: "2px 0" }}>{line}</p>;
            })}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={baixarWord} style={{ flex: 2, background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, color: C.white, border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              ⬇️ Baixar Word (.doc)
            </button>
            <button onClick={() => { navigator.clipboard?.writeText(curriculo); alert("Copiado! 📋"); }} style={{ flex: 1, background: "transparent", color: C.purple, border: `2px solid ${C.purple}`, borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              📋 Copiar
            </button>
          </div>
        </div>
      )}

      {!loading && tab === "skills" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 13, color: C.gray, margin: "0 0 4px" }}>Suas <strong style={{ color: C.white }}>{compDescs.length} principais skills</strong> descobertas no quiz:</p>
          {compDescs.map((comp, i) => (
            <div key={i} style={{ ...cardStyle, borderLeft: `4px solid ${comp.cor}`, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }}>{comp.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.white }}>{comp.label}</div>
                  <div style={{ fontSize: 11, color: comp.cor, fontWeight: 700 }}>SKILL #{i + 1}</div>
                </div>
                <div style={{ marginLeft: "auto", background: `${comp.cor}20`, border: `1px solid ${comp.cor}40`, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: comp.cor }}>+{(5 - i) * 20} pts</div>
              </div>
              <p style={{ fontSize: 13, color: C.gray, margin: 0, lineHeight: 1.5 }}>{comp.desc}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "entrevista" && (
        <div>
          <div style={{ ...cardStyle, borderColor: C.cyan + "40", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: C.cyan, fontWeight: 700, margin: "0 0 4px" }}>💡 Como contar sua história</p>
            <p style={{ fontSize: 12, color: C.gray, margin: 0 }}>Dicas baseadas nas suas skills pra você arrasar na entrevista</p>
          </div>
          <div style={{ ...cardStyle, marginBottom: 16, maxHeight: 320, overflowY: "auto", whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.7, color: C.white }}>
            {dicas}
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.white, margin: "0 0 10px" }}>🎤 Dicas gerais:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DICAS_ENTREVISTA.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 12, ...cardStyle, padding: "12px 14px" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{d.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.white, marginBottom: 2 }}>{d.titulo}</div>
                  <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5 }}>{d.dica}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && tab === "cursos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 13, color: C.gray, margin: "0 0 4px" }}>🎓 Todos gratuitos e com certificado:</p>
          {CURSOS.map((c, i) => (
            <div key={i} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.white, marginBottom: 2 }}>{c.nome}</div>
                <div style={{ fontSize: 12, color: C.gray }}>{c.areas}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <span style={{ background: `${C.green}20`, color: C.green, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>{c.badge}</span>
                <a href={c.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: C.cyan, fontWeight: 600, textDecoration: "none" }}>Acessar →</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "chat" && <Chat dados={dados} comps={comps} />}

      {!loading && (
        <button onClick={() => window.location.reload()} style={{ width: "100%", marginTop: 14, padding: "10px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "transparent", color: C.gray, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          🔄 Recomeçar do zero
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
  const [xp, setXp] = useState(0);

  const upd = (k, v) => setDados(p => ({ ...p, [k]: v }));
  const addXP = (v) => setXp(p => p + v);

  const goStep = (s, xpGain) => {
    if (xpGain) addXP(xpGain);
    setStep(s);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 48px", fontFamily: "'Inter', system-ui, sans-serif", background: C.bg, minHeight: "100vh", color: C.white, width: "100%" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { background: #0F0F1A; min-height: 100vh; width: 100%; }
        input::placeholder { color: #475569; }
        select option { background: #1A1A2E; color: #F1F5F9; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1A1A2E; }
        ::-webkit-scrollbar-thumb { background: #2D2D5E; border-radius: 99px; }
      `}</style>

      {step !== "inicio" && <XPBar xp={xp} />}

      {step === "inicio" && <Inicio onNext={() => setStep("perfil")} />}
      {step === "perfil" && <Perfil dados={dados} onChange={upd} onNext={() => goStep("quiz", 150)} onBack={() => setStep("inicio")} />}
      {step === "quiz" && <Quiz onFinalizar={(c, r) => { setComps(c); setRespostasQuiz(r); goStep("curriculo", 300); }} onBack={() => setStep("perfil")} />}
      {step === "curriculo" && <Curriculo dados={dados} comps={comps} xp={xp} onAddXP={addXP} />}
    </div>
  );
}

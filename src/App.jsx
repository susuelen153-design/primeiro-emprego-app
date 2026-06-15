import { useState, useRef, useEffect } from "react";

const COLORS = {
  purple: "#7C3AED",
  purpleLight: "#EDE9FE",
  pink: "#EC4899",
  pinkLight: "#FDF2F8",
  yellow: "#F59E0B",
  yellowLight: "#FFFBEB",
  green: "#10B981",
  greenLight: "#ECFDF5",
  blue: "#3B82F6",
  blueLight: "#EFF6FF",
  orange: "#F97316",
  orangeLight: "#FFF7ED",
};

const STEPS = ["inicio", "perfil", "interesses", "competencias", "curriculo"];

const INTERESSE_AREAS = [
  { id: "tecnologia", label: "Tecnologia & Games", emoji: "💻", desc: "Programação, design digital, redes, suporte técnico" },
  { id: "pessoas", label: "Trabalhar com Pessoas", emoji: "🤝", desc: "Atendimento, vendas, recursos humanos, ensino" },
  { id: "criatividade", label: "Criatividade & Arte", emoji: "🎨", desc: "Design, comunicação, moda, publicidade" },
  { id: "numeros", label: "Números & Negócios", emoji: "📊", desc: "Financeiro, administrativo, contabilidade, logística" },
  { id: "natureza", label: "Natureza & Saúde", emoji: "🌿", desc: "Biologia, nutrição, esportes, meio ambiente" },
  { id: "comunicacao", label: "Comunicação & Mídia", emoji: "📱", desc: "Redes sociais, jornalismo, marketing, influência" },
];

const COMPETENCIAS = [
  {
    id: "comunicacao",
    label: "Comunicação",
    emoji: "🗣️",
    desc: "Saber expressar ideias de forma clara, oral ou escrita.",
    exemplos: ["Apresentações na escola", "Vender produtos para amigos/família", "Gravar vídeos ou stories"],
  },
  {
    id: "equipe",
    label: "Trabalho em equipe",
    emoji: "👥",
    desc: "Colaborar com outras pessoas para alcançar um objetivo.",
    exemplos: ["Trabalhos em grupo na escola", "Times esportivos", "Projetos da igreja ou comunidade"],
  },
  {
    id: "organizacao",
    label: "Organização",
    emoji: "📋",
    desc: "Planejar tarefas, cumprir prazos e manter tudo em ordem.",
    exemplos: ["Organizar eventos", "Cuidar de irmãos/casa", "Administrar próprio estudo"],
  },
  {
    id: "proatividade",
    label: "Proatividade",
    emoji: "🚀",
    desc: "Tomar iniciativa sem esperar ser mandado.",
    exemplos: ["Aprender algo novo sozinho", "Montar um negócio próprio", "Ajudar sem ser pedido"],
  },
  {
    id: "criatividade",
    label: "Criatividade",
    emoji: "💡",
    desc: "Pensar em soluções novas e diferentes.",
    exemplos: ["Projetos pessoais", "Artes manuais", "Criação de conteúdo"],
  },
  {
    id: "responsabilidade",
    label: "Responsabilidade",
    emoji: "✅",
    desc: "Cumprir compromissos e assumir as consequências.",
    exemplos: ["Cumprir horários", "Entregar trabalhos no prazo", "Cuidar de alguém da família"],
  },
  {
    id: "lideranca",
    label: "Liderança",
    emoji: "👑",
    desc: "Inspirar e guiar outras pessoas em direção a um objetivo.",
    exemplos: ["Representante de turma", "Capitão de time", "Organizar grupo de amigos"],
  },
  {
    id: "aprendizado",
    label: "Facilidade p/ aprender",
    emoji: "🧠",
    desc: "Absorver novos conhecimentos e se adaptar rápido.",
    exemplos: ["Cursos por conta própria", "Aprender a usar apps novos", "Interesse em temas variados"],
  },
];

const CURSOS_GRATUITOS = [
  { nome: "Escola Virtual Bradesco", url: "https://www.ev.org.br/cursos", areas: "Informática, Administração, IA, Inglês — +88 cursos gratuitos com certificado", badge: "🏆 Certificado" },
  { nome: "SENAI Play", url: "https://play.senai.br/cursos", areas: "Tecnologia, Indústria, Qualidade — cursos rápidos online", badge: "🔧 Técnico" },
  { nome: "Google Skillshop", url: "https://skillshop.withgoogle.com", areas: "Marketing Digital, Google Ads, Analytics, IA — certificado Google", badge: "📱 Google" },
  { nome: "Cursos Google (Coursera)", url: "https://www.coursera.org/google", areas: "TI, Cibersegurança, Dados, UX — bolsas disponíveis", badge: "🌍 Internacional" },
  { nome: "SEBRAE Cursos Online", url: "https://www.sebrae.com.br/sites/PortalSebrae/cursosonline", areas: "Empreendedorismo, Vendas, Gestão — todos gratuitos", badge: "💼 Negócios" },
  { nome: "Khan Academy", url: "https://pt.khanacademy.org/search?referer=%2F&page_search_query=curso", areas: "Matemática, Programação, Ciências — 100% gratuito", badge: "📚 Educação" },
  { nome: "Microsoft Learn", url: "https://learn.microsoft.com/pt-br/training/browse", areas: "Azure, Office, Power BI, IA — certificações Microsoft", badge: "💻 Microsoft" },
  { nome: "IBM SkillsBuild", url: "https://skillsbuild.org/pt-BR", areas: "IA, Dados, Cibersegurança, Cloud — certificado IBM", badge: "🤖 IBM" },
];

const DICAS_ENTREVISTA = [
  { titulo: "Vista-se com conforto e cuidado", icon: "✨", dica: "Use o que te deixa confortável e confiante! Só evite bonés, regatas e chinelos — prefira algo arrumado que mostre respeito pelo momento.", cor: COLORS.purple },
  { titulo: "Chega antes do horário", icon: "⏰", dica: "Apareça 10-15 min antes. Atrasar é péssima impressão — pesquise o trajeto antes!", cor: COLORS.blue },
  { titulo: "Pesquise a empresa", icon: "🔍", dica: "Saiba o que ela faz, seus valores. Isso mostra interesse real e te diferencia.", cor: COLORS.green },
  { titulo: "Olho no olho & aperto firme", icon: "👋", dica: "Cumprimento firme e contato visual transmite confiança. Treine antes!", cor: COLORS.orange },
  { titulo: "Fala dos seus exemplos reais", icon: "💬", dica: "Use situações reais: escola, voluntariado, vendas, família. Experiência não é só CLT!", cor: COLORS.pink },
  { titulo: "Não fale mal de ninguém", icon: "🤐", dica: "Mesmo de escola, família, amigo. Mostra maturidade e profissionalismo.", cor: COLORS.yellow },
  { titulo: "Pergunte sobre a vaga", icon: "❓", dica: "\"Quais as maiores qualidades que buscam?\" Mostra que você está engajado.", cor: COLORS.purple },
  { titulo: "Agradeça após a entrevista", icon: "🙏", dica: "Um WhatsApp ou e-mail agradecendo deixa boa impressão e poucos fazem isso!", cor: COLORS.green },
];

function callClaude(messages, systemPrompt) {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "x-api-key": localStorage.getItem("anthropic_key") || "",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  }).then((r) => r.json());
}

// ──────────────────────────────────────────────
// COMPONENTS
// ──────────────────────────────────────────────

function ProgressBar({ step }) {
  const idx = STEPS.indexOf(step);
  const pct = Math.round((idx / (STEPS.length - 1)) * 100);
  return (
    <div style={{ width: "100%", marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        {["Início", "Seu Perfil", "Interesses", "Competências", "Currículo"].map((l, i) => (
          <span key={i} style={{ fontSize: 11, color: i <= idx ? COLORS.purple : "#9CA3AF", fontWeight: i <= idx ? 600 : 400, transition: "color 0.3s" }}>{l}</span>
        ))}
      </div>
      <div style={{ height: 6, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.pink})`, borderRadius: 99, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function Badge({ text, color, bg }) {
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, letterSpacing: 0.3 }}>{text}</span>
  );
}



// ──────────────────────────────────────────────
// SCREENS
// ──────────────────────────────────────────────

function ConfigApiKey({ onSave }) {
  const [key, setKey] = useState(localStorage.getItem("anthropic_key") || "");
  const [erro, setErro] = useState("");

  const salvar = () => {
    if (!key.startsWith("sk-ant-")) {
      setErro("Chave inválida. Deve começar com sk-ant-...");
      return;
    }
    localStorage.setItem("anthropic_key", key);
    onSave();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🔑</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", marginBottom: 8 }}>Configure sua chave de IA</h2>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 6, lineHeight: 1.6 }}>
        Para gerar currículos com IA, você precisa de uma chave da Anthropic.<br/>
        É gratuita para começar — crie em{" "}
        <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: "#7C3AED", fontWeight: 700 }}>
          console.anthropic.com
        </a>
      </p>
      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", marginBottom: 16, textAlign: "left", fontSize: 12, color: "#92400E" }}>
        <b>Como pegar sua chave:</b><br/>
        1. Acesse console.anthropic.com → faça login<br/>
        2. Clique em "API Keys" → "Create Key"<br/>
        3. Copie a chave (começa com sk-ant-...) e cole abaixo
      </div>
      <input
        type="password"
        placeholder="sk-ant-api03-..."
        value={key}
        onChange={(e) => { setKey(e.target.value); setErro(""); }}
        style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${erro ? "#EF4444" : "#E5E7EB"}`, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 8 }}
      />
      {erro && <p style={{ color: "#EF4444", fontSize: 12, marginBottom: 8 }}>{erro}</p>}
      <button
        onClick={salvar}
        disabled={!key}
        style={{ background: key ? "linear-gradient(135deg, #7C3AED, #EC4899)" : "#D1D5DB", color: "#fff", border: "none", borderRadius: 12, padding: "13px 24px", fontSize: 15, fontWeight: 700, cursor: key ? "pointer" : "not-allowed", width: "100%" }}
      >
        Salvar e continuar ✨
      </button>
      <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 10 }}>
        🔒 Sua chave fica salva só no seu navegador, nunca é enviada a nenhum servidor nosso.
      </p>
    </div>
  );
}

function Inicio({ onNext }) {
  return (
    <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>🚀</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>
        PrimeiroEmprego
      </h1>
      <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>
        Sua jornada rumo ao primeiro emprego começa aqui! 🎯<br />
        Descubra suas habilidades, monte seu currículo e se prepare pra arrasar na entrevista.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { emoji: "🧠", label: "Descubra suas competências" },
          { emoji: "📄", label: "Currículo pronto com IA" },
          { emoji: "💡", label: "Dicas de entrevista" },
        ].map((f, i) => (
          <div key={i} style={{ background: COLORS.purpleLight, borderRadius: 12, padding: "16px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{f.emoji}</div>
            <div style={{ fontSize: 12, color: COLORS.purple, fontWeight: 600 }}>{f.label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        style={{ background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}
      >
        Começar agora! ✨
      </button>
    </div>
  );
}

const TIPOS_FORMACAO = [
  "Ensino Fundamental",
  "Ensino Médio",
  "Ensino Médio Técnico",
  "EJA (Educação de Jovens e Adultos)",
  "Curso Técnico",
  "Graduação (Faculdade)",
];

const SERIES_POR_TIPO = {
  "Ensino Fundamental": ["6º ano", "7º ano", "8º ano", "9º ano", "Concluído"],
  "Ensino Médio": ["1º ano", "2º ano", "3º ano", "Concluído"],
  "Ensino Médio Técnico": ["1º ano", "2º ano", "3º ano", "Concluído"],
  "EJA (Educação de Jovens e Adultos)": ["1ª etapa", "2ª etapa", "3ª etapa", "Concluído"],
  "Curso Técnico": ["1º semestre", "2º semestre", "3º semestre", "4º semestre", "Concluído"],
  "Graduação (Faculdade)": ["1º semestre", "2º semestre", "3º semestre", "4º semestre", "5º semestre", "6º semestre", "7º semestre", "8º semestre", "Concluído"],
};

const selectStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1.5px solid #E5E7EB",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  background: "#fff",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  cursor: "pointer",
};

function Perfil({ dados, onChange, onNext }) {
  const serieOpcoes = dados.tipoFormacao ? SERIES_POR_TIPO[dados.tipoFormacao] || [] : [];

  const textFields = [
    { key: "nome", label: "Nome completo", placeholder: "Seu nome aqui...", type: "text", span: 2 },
    { key: "idade", label: "Idade", placeholder: "Ex: 16", type: "number", span: 1 },
    { key: "cidade", label: "Cidade/Estado", placeholder: "Ex: São Paulo/SP", type: "text", span: 1 },
    { key: "email", label: "E-mail", placeholder: "seuemail@gmail.com", type: "email", span: 2 },
    { key: "telefone", label: "WhatsApp/Telefone", placeholder: "(11) 9 9999-9999", type: "text", span: 1 },
    { key: "escola", label: "Escola", placeholder: "Nome da sua escola", type: "text", span: 1 },
    { key: "cursos", label: "Cursos que já fez (opcional)", placeholder: "Ex: Excel básico, inglês, informática...", type: "text", span: 2 },
  ];

  const canNext = dados.nome && dados.idade && dados.email;
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", marginBottom: 4 }}>Sobre você 👤</h2>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>Essas informações vão para o seu currículo. Pode deixar campos opcionais em branco!</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {textFields.map((f) => (
          <div key={f.key} style={{ gridColumn: `span ${f.span}` }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={dados[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
              onFocus={(e) => (e.target.style.borderColor = COLORS.purple)}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>
        ))}

        <div style={{ gridColumn: "span 1" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>Tipo de formação</label>
          <select
            value={dados.tipoFormacao || ""}
            onChange={(e) => { onChange("tipoFormacao", e.target.value); onChange("serie", ""); }}
            style={{ ...selectStyle, borderColor: dados.tipoFormacao ? COLORS.purple : "#E5E7EB", color: dados.tipoFormacao ? "#1F2937" : "#9CA3AF" }}
          >
            <option value="" disabled>Selecione...</option>
            {TIPOS_FORMACAO.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ gridColumn: "span 1" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>Ano/Série</label>
          <select
            value={dados.serie || ""}
            onChange={(e) => onChange("serie", e.target.value)}
            disabled={!dados.tipoFormacao}
            style={{ ...selectStyle, borderColor: dados.serie ? COLORS.purple : "#E5E7EB", color: dados.serie ? "#1F2937" : "#9CA3AF", opacity: dados.tipoFormacao ? 1 : 0.5, cursor: dados.tipoFormacao ? "pointer" : "not-allowed" }}
          >
            <option value="" disabled>{dados.tipoFormacao ? "Selecione..." : "Escolha o tipo primeiro"}</option>
            {serieOpcoes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <button
        onClick={onNext}
        disabled={!canNext}
        style={{ background: canNext ? `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})` : "#D1D5DB", color: "#fff", border: "none", borderRadius: 12, padding: "13px 24px", fontSize: 15, fontWeight: 700, cursor: canNext ? "pointer" : "not-allowed", width: "100%" }}
      >
        Próximo: Seus interesses →
      </button>
    </div>
  );
}

function Interesses({ selecionados, onToggle, onNext, onBack }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", marginBottom: 4 }}>O que te agita? 🔥</h2>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>Selecione as áreas que mais combinam com você. Pode ser mais de uma!</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {INTERESSE_AREAS.map((area) => {
          const sel = selecionados.includes(area.id);
          return (
            <div
              key={area.id}
              onClick={() => onToggle(area.id)}
              style={{
                border: `2px solid ${sel ? COLORS.purple : "#E5E7EB"}`,
                borderRadius: 14,
                padding: "14px 12px",
                cursor: "pointer",
                background: sel ? COLORS.purpleLight : "#fff",
                transition: "all 0.2s",
                userSelect: "none",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>{area.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: sel ? COLORS.purple : "#1F2937", marginBottom: 2 }}>{area.label}</div>
              <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.4 }}>{area.desc}</div>
              {sel && <div style={{ fontSize: 11, color: COLORS.purple, fontWeight: 700, marginTop: 4 }}>✓ Selecionado</div>}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "2px solid #E5E7EB", background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#6B7280" }}>← Voltar</button>
        <button
          onClick={onNext}
          disabled={selecionados.length === 0}
          style={{ flex: 2, background: selecionados.length ? `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})` : "#D1D5DB", color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: selecionados.length ? "pointer" : "not-allowed" }}
        >
          Próximo: Minhas habilidades →
        </button>
      </div>
    </div>
  );
}

function Competencias({ selecionadas, onToggle, experiencias, onExpChange, onNext, onBack }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", marginBottom: 4 }}>Suas habilidades secretas 🧠</h2>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
        Selecione as que você tem — mesmo sem emprego formal! Depois conta como desenvolveu.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {COMPETENCIAS.map((comp) => {
          const sel = selecionadas.includes(comp.id);

          return (
            <div key={comp.id} style={{ border: `2px solid ${sel ? COLORS.purple : "#E5E7EB"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", background: sel ? COLORS.purpleLight : "#fff" }}
                onClick={() => { onToggle(comp.id); setExpanded(sel ? null : comp.id); }}
              >
                <span style={{ fontSize: 24 }}>{comp.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: sel ? COLORS.purple : "#1F2937" }}>{comp.label}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{comp.desc}</div>
                </div>
                <div style={{ fontSize: 18, color: sel ? COLORS.purple : "#D1D5DB" }}>{sel ? "✅" : "○"}</div>
              </div>
              {sel && (
                <div style={{ padding: "10px 16px", background: "#FAFAFA", borderTop: "1px solid #F3F4F6" }}>
                  <p style={{ fontSize: 12, color: COLORS.purple, fontWeight: 700, marginBottom: 6 }}>💡 Exemplos pra entrevista:</p>
                  <ul style={{ margin: "0 0 10px", paddingLeft: 16 }}>
                    {comp.exemplos.map((e, i) => <li key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>{e}</li>)}
                  </ul>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Como você demonstrou isso na sua vida? (vai pro currículo!)
                  </label>
                  <textarea
                    placeholder="Ex: Organizei as vendas de salgados para ajudar minha mãe no final de semana..."
                    value={experiencias[comp.id] || ""}
                    onChange={(e) => onExpChange(comp.id, e.target.value)}
                    rows={2}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 12, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "2px solid #E5E7EB", background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#6B7280" }}>← Voltar</button>
        <button
          onClick={onNext}
          disabled={selecionadas.length === 0}
          style={{ flex: 2, background: selecionadas.length ? `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})` : "#D1D5DB", color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: selecionadas.length ? "pointer" : "not-allowed" }}
        >
          Gerar meu currículo com IA ✨
        </button>
      </div>
    </div>
  );
}

function ChatAssistente({ dados, interesses, competencias, experiencias }) {
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: `Oi ${dados.nome ? dados.nome.split(" ")[0] : ""}! 👋 Sou seu assistente de carreira. Pode me perguntar sobre entrevistas, profissões, cursos, ou qualquer dúvida sobre o mercado de trabalho!` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput("");
    setLoading(true);

    const system = `Você é um assistente de carreira para adolescentes brasileiros buscando o primeiro emprego. 
Perfil do usuário: Nome: ${dados.nome}, Idade: ${dados.idade}, Cidade: ${dados.cidade}.
Interesses: ${interesses.join(", ")}.
Competências identificadas: ${competencias.join(", ")}.
Responda de forma descontraída, usando linguagem jovem mas profissional. Use emojis. Seja motivador e prático.
Máximo de 3 parágrafos curtos. Foque no contexto brasileiro.`;

    const history = newMsgs.slice(1).map((m) => ({ role: m.role, content: m.content }));
    try {
      const data = await callClaude(history, system);
      const reply = data.content?.find((b) => b.type === "text")?.text || "Opa, tive um problema técnico! Tenta de novo? 😅";
      setMsgs((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((prev) => [...prev, { role: "assistant", content: "Ops! Problema de conexão. Tenta de novo! 😅" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ border: "2px solid #E5E7EB", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>🤖</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Assistente de Carreira</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>Tire suas dúvidas!</div>
        </div>
        <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#34D399" }} />
      </div>
      <div style={{ height: 220, overflowY: "auto", padding: "12px 16px", background: "#FAFAFA", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%",
              background: m.role === "user" ? `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})` : "#fff",
              color: m.role === "user" ? "#fff" : "#1F2937",
              border: m.role === "assistant" ? "1px solid #E5E7EB" : "none",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              padding: "10px 14px",
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px 16px 16px 4px", padding: "10px 14px" }}>
              <span style={{ display: "inline-flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.purple, animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid #E5E7EB", background: "#fff" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Pergunte algo sobre carreira, vagas, entrevistas..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 13, outline: "none", fontFamily: "inherit" }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{ background: COLORS.purple, color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontSize: 16 }}
        >
          ➤
        </button>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }`}</style>
    </div>
  );
}

function GerarCurriculo({ dados, interesses, competencias, experiencias }) {
  const [curriculo, setCurriculo] = useState("");
  const [dicas, setDicas] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("curriculo");
  const [gerado, setGerado] = useState(false);

  const gerar = async () => {
    setLoading(true);
    setGerado(false);
    const compsLabels = COMPETENCIAS.filter((c) => competencias.includes(c.id)).map((c) => c.label);
    const expsTexto = COMPETENCIAS.filter((c) => competencias.includes(c.id) && experiencias[c.id])
      .map((c) => `${c.label}: ${experiencias[c.id]}`).join("\n");
    const interLabels = INTERESSE_AREAS.filter((a) => interesses.includes(a.id)).map((a) => a.label);

    const temCursos = !!(dados.cursos && dados.cursos.trim());
    const temExperiencias = !!(expsTexto && expsTexto.trim());
    const temEscola = !!(dados.escola && dados.escola.trim());
    const temTelefone = !!(dados.telefone && dados.telefone.trim());
    const temCidade = !!(dados.cidade && dados.cidade.trim());

    const prompt = `Crie um currículo profissional para jovem em busca do primeiro emprego.

REGRA ABSOLUTA: Use APENAS as informações abaixo. NUNCA invente, complete ou suponha dados que não estão aqui. Se um campo estiver ausente, simplesmente não inclua aquela informação nem aquela seção.

DADOS FORNECIDOS:
Nome: ${dados.nome}
${dados.idade ? `Idade: ${dados.idade}` : ""}
${temCidade ? `Cidade: ${dados.cidade}` : ""}
Email: ${dados.email}
${temTelefone ? `Telefone: ${dados.telefone}` : ""}
${temEscola ? `Escola: ${dados.escola}` : ""}
${dados.tipoFormacao ? `Tipo de formação: ${dados.tipoFormacao}` : ""}
${dados.serie ? `Série/Ano: ${dados.serie}` : ""}
${temCursos ? `Cursos realizados: ${dados.cursos}` : ""}

Áreas de interesse: ${interLabels.length ? interLabels.join(", ") : "Não informado"}
Competências selecionadas: ${compsLabels.length ? compsLabels.join(", ") : "Não informado"}
${temExperiencias ? `Experiências reais relatadas pela pessoa:\n${expsTexto}` : ""}

SEÇÕES OBRIGATÓRIAS (sempre incluir):
1. DADOS PESSOAIS — apenas os dados fornecidos acima
2. OBJETIVO PROFISSIONAL — 1 parágrafo baseado nos interesses e competências reais informados
3. RESUMO DE PERFIL — 2-3 frases destacando o potencial com base apenas no que foi informado
4. FORMAÇÃO ACADÊMICA — apenas se escola ou tipo de formação foram informados
5. HABILIDADES E COMPETÊNCIAS — apenas as competências que a pessoa selecionou, com uma frase curta sobre cada

SEÇÕES CONDICIONAIS (incluir SOMENTE se houver dado real):
- CURSOS E CERTIFICAÇÕES — incluir SOMENTE se "Cursos realizados" estiver preenchido acima
- PROJETOS E ATIVIDADES RELEVANTES — incluir SOMENTE se houver "Experiências reais relatadas" acima; transforme em linguagem profissional sem adicionar nada além do que foi dito

Formate cada seção com o título em MAIÚSCULAS seguido de uma linha em branco e o conteúdo.
NÃO adicione seções extras, NÃO invente cursos, datas, empresas, projetos ou qualquer informação não fornecida.`;

    const promptDicas = `Com base no perfil desta pessoa (${dados.nome}, ${dados.idade} anos, interesses em ${interLabels.join(", ")}, competências: ${compsLabels.join(", ")}), 
crie 5 dicas personalizadas para ela se sair bem em entrevistas de emprego, específicas para o perfil dela.
Também sugira 3 vagas ideais (Jovem Aprendiz, Estágio) que combinam com o perfil.
Linguagem jovem, motivadora, com emojis.`;

    try {
      const [r1, r2] = await Promise.all([
        callClaude([{ role: "user", content: prompt }], "Você é especialista em RH e cria currículos para jovens em busca do primeiro emprego no Brasil. Responda apenas com o currículo formatado, sem comentários adicionais."),
        callClaude([{ role: "user", content: promptDicas }], "Você é um coach de carreira jovem e motivador para adolescentes brasileiros. Use linguagem acessível e emojis."),
      ]);
      setCurriculo(r1.content?.find((b) => b.type === "text")?.text || "Erro ao gerar.");
      setDicas(r2.content?.find((b) => b.type === "text")?.text || "Erro ao gerar.");
      setGerado(true);
    } catch {
      setCurriculo("Erro de conexão. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div>
      {!gerado && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>✨</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", marginBottom: 8 }}>Hora de montar seu currículo!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>
            Nossa IA vai usar tudo que você contou pra criar um currículo incrível e dicas personalizadas pra você!
          </p>
          <button
            onClick={gerar}
            disabled={loading}
            style={{ background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`, color: "#fff", border: "none", borderRadius: 14, padding: "16px 36px", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.4)", width: "100%" }}
          >
            {loading ? "🔄 Gerando com IA..." : "🚀 Gerar meu currículo!"}
          </button>
          {loading && (
            <p style={{ color: COLORS.purple, fontSize: 13, marginTop: 12 }}>Isso pode levar alguns segundos... ⏳</p>
          )}
        </div>
      )}

      {gerado && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { key: "curriculo", label: "📄 Currículo" },
              { key: "dicas", label: "💡 Dicas IA" },
              { key: "entrevista", label: "🎤 Entrevista" },
              { key: "cursos", label: "📚 Cursos" },
              { key: "chat", label: "🤖 Chat" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{ flex: 1, padding: "9px 4px", borderRadius: 10, border: `2px solid ${tab === t.key ? COLORS.purple : "#E5E7EB"}`, background: tab === t.key ? COLORS.purpleLight : "#fff", color: tab === t.key ? COLORS.purple : "#6B7280", fontSize: 11, fontWeight: tab === t.key ? 700 : 500, cursor: "pointer" }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "curriculo" && (
            <div>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 22px", marginBottom: 12, maxHeight: 420, overflowY: "auto" }}>
                {curriculo.split("\n").map((line, i) => {
                  const isHeader = /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]{4,}:/.test(line.trim()) || /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]{4,}$/.test(line.trim());
                  const isEmpty = line.trim() === "";
                  if (isEmpty) return <div key={i} style={{ height: 8 }} />;
                  if (isHeader) return (
                    <div key={i} style={{ fontSize: 11, fontWeight: 800, color: COLORS.purple, letterSpacing: 1, textTransform: "uppercase", borderBottom: `2px solid ${COLORS.purpleLight}`, paddingBottom: 4, marginTop: 14, marginBottom: 6 }}>
                      {line.trim().replace(/:$/, "")}
                    </div>
                  );
                  return <p key={i} style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: "2px 0" }}>{line}</p>;
                })}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    const html = `
                      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                      <head><meta charset='utf-8'><title>Currículo</title>
                      <style>
                        body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; margin: 2cm; color: #1a1a1a; }
                        h1 { font-size: 18pt; color: #7C3AED; margin-bottom: 2pt; }
                        .sub { font-size: 10pt; color: #6B7280; margin-bottom: 16pt; }
                        .secao { font-size: 10pt; font-weight: bold; color: #7C3AED; text-transform: uppercase; letter-spacing: 1pt; border-bottom: 1pt solid #EDE9FE; padding-bottom: 3pt; margin-top: 14pt; margin-bottom: 6pt; }
                        p { font-size: 11pt; margin: 2pt 0; line-height: 1.5; }
                        hr { border: none; border-top: 1pt solid #E5E7EB; }
                      </style></head><body>
                      ${curriculo.split("\n").map((line) => {
                        const isHeader = /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]{4,}:/.test(line.trim()) || /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]{4,}$/.test(line.trim());
                        if (line.trim() === "") return "<br/>";
                        if (isHeader) return `<div class="secao">${line.trim().replace(/:$/, "")}</div>`;
                        return `<p>${line}</p>`;
                      }).join("")}
                      </body></html>`;
                    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `curriculo_${(dados.nome || "meu").split(" ")[0].toLowerCase()}.doc`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  style={{ flex: 2, background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  ⬇️ Baixar como Word (.doc)
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(curriculo) || (() => {
                      const el = document.createElement("textarea");
                      el.value = curriculo;
                      document.body.appendChild(el);
                      el.select();
                      document.execCommand("copy");
                      document.body.removeChild(el);
                    })();
                    alert("Copiado! 📋 Cole onde quiser.");
                  }}
                  style={{ flex: 1, background: "#fff", color: COLORS.purple, border: `2px solid ${COLORS.purple}`, borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  📋 Copiar
                </button>
              </div>
            </div>
          )}

          {tab === "dicas" && (
            <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, padding: "16px", whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.7, color: "#1F2937", maxHeight: 420, overflowY: "auto" }}>
              {dicas}
            </div>
          )}

          {tab === "entrevista" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto" }}>
              {DICAS_ENTREVISTA.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 12, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "12px 14px", borderLeft: `4px solid ${d.cor}` }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{d.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", marginBottom: 2 }}>{d.titulo}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{d.dica}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "cursos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto" }}>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 8px" }}>🎓 Plataformas com cursos gratuitos e certificados reconhecidos no mercado:</p>
              {CURSOS_GRATUITOS.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.purple, marginBottom: 2 }}>{c.nome}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{c.areas}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <Badge text={c.badge} color={COLORS.purple} bg={COLORS.purpleLight} />
                    <a href={c.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: COLORS.blue, textDecoration: "none", fontWeight: 600 }}>Acessar →</a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "chat" && (
            <ChatAssistente dados={dados} interesses={interesses} competencias={competencias} experiencias={experiencias} />
          )}

          <button
            onClick={gerar}
            style={{ width: "100%", marginTop: 12, padding: "10px", borderRadius: 10, border: `2px solid ${COLORS.purple}`, background: "#fff", color: COLORS.purple, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            🔄 Regenerar currículo
          </button>
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────

export default function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("anthropic_key") || "");
  const [step, setStep] = useState("inicio");
  const [dados, setDados] = useState({});
  const [interesses, setInteresses] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [experiencias, setExperiencias] = useState({});

  const updateDados = (key, val) => setDados((p) => ({ ...p, [key]: val }));
  const toggleInteresse = (id) => setInteresses((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleComp = (id) => setCompetencias((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const updateExp = (id, val) => setExperiencias((p) => ({ ...p, [id]: val }));

  const go = (s) => setStep(s);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px 16px 40px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <h2 className="sr-only">PrimeiroEmprego — Plataforma de orientação de carreira para adolescentes</h2>

      {!apiKey && <ConfigApiKey onSave={() => setApiKey(localStorage.getItem("anthropic_key") || "")} />}

      {apiKey && (
        <>
          {step !== "inicio" && <ProgressBar step={step} />}
          {step === "inicio" && <Inicio onNext={() => go("perfil")} />}
          {step === "perfil" && <Perfil dados={dados} onChange={updateDados} onNext={() => go("interesses")} />}
          {step === "interesses" && <Interesses selecionados={interesses} onToggle={toggleInteresse} onNext={() => go("competencias")} onBack={() => go("perfil")} />}
          {step === "competencias" && <Competencias selecionadas={competencias} onToggle={toggleComp} experiencias={experiencias} onExpChange={updateExp} onNext={() => go("curriculo")} onBack={() => go("interesses")} />}
          {step === "curriculo" && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", marginBottom: 4 }}>Seu perfil completo 🌟</h2>
              <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 16 }}>
                Olá, <strong>{dados.nome?.split(" ")[0]}</strong>! Geramos tudo pra você. Explore as abas abaixo!
              </p>
              <GerarCurriculo dados={dados} interesses={interesses} competencias={competencias} experiencias={experiencias} />
            </>
          )}
        </>
      )}
    </div>
  );
}

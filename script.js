/* ===== PERSONALIZAÇÃO: NOME E CONTATOS ===== */
const CONFIG = {
  nomeClinica: 'Clínica Odontológica',
  numeroWhatsApp: '5581', // Substituir pelo número oficial, com DDI e DDD, somente dígitos
  endereco: 'Rua Silvino Macedo, 192',
  horario: 'De Seg. à Sab. das 09 às 18:00',
  instagram: 'https://www.instagram.com/', // Substituir pelo perfil verdadeiro
  telefoneExibicao: '81 90000-0000',
  responsavelTecnico: 'Doutor João Lima',
  cro: ''
};

/* ===== FOTOGRAFIAS: TROQUE CADA URL PELO ARQUIVO LOCAL =====
 * Exemplo: hero: 'images/hero.jpg'
 * As URLs demonstrativas abaixo exigem conexão com internet.
 * Os arquivos de imagem não foram incluídos no ZIP.
 */
const FOTOGRAFIAS = {
  hero: 'https://images.pexels.com/photos/6812570/pexels-photo-6812570.jpeg?auto=compress&cs=tinysrgb&w=1800',
  atendimento: 'https://images.pexels.com/photos/6627534/pexels-photo-6627534.jpeg?auto=compress&cs=tinysrgb&w=500',
  equipe: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=500',
  tratamentos: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1000',
  consultorio: 'https://images.pexels.com/photos/6627534/pexels-photo-6627534.jpeg?auto=compress&cs=tinysrgb&w=1100'
};

function atualizarDados() {
  document.querySelectorAll('[data-clinic-name]').forEach(el => el.textContent = CONFIG.nomeClinica);
  document.getElementById('address-text').textContent = CONFIG.endereco;
  document.getElementById('hours-text').textContent = CONFIG.horario;
  document.getElementById('cro-text').textContent = `Responsável técnico: ${CONFIG.responsavelTecnico} | CRO: ${CONFIG.cro}`;
  document.getElementById('footer-whatsapp').textContent = `WhatsApp: ${CONFIG.telefoneExibicao}`;
  document.getElementById('instagram-link').href = CONFIG.instagram;
  document.getElementById('year').textContent = new Date().getFullYear();
  document.querySelectorAll('[data-photo]').forEach(img => {
    const caminho = FOTOGRAFIAS[img.dataset.photo];
    if (caminho) img.src = caminho;
  });
}

function criarLinkWhatsApp(mensagem) {
  return `https://wa.me/${CONFIG.numeroWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
}

function abrirWhatsApp(mensagem) {
  const url = criarLinkWhatsApp(mensagem);
  // O clique do usuário inicia a navegação; se o navegador bloquear a nova aba, abre na aba atual.
  const novaAba = window.open(url, '_blank', 'noopener,noreferrer');
  if (!novaAba) window.location.href = url;
}

function configurarBotoesContato() {
  const mensagem = `Olá! Gostaria de saber mais e solicitar um agendamento na ${CONFIG.nomeClinica}.`;
  document.querySelectorAll('.js-whatsapp').forEach(link => {
    link.href = criarLinkWhatsApp(mensagem);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  const rodape = document.getElementById('footer-whatsapp');
  rodape.href = criarLinkWhatsApp(mensagem);
  rodape.target = '_blank';
  rodape.rel = 'noopener noreferrer';
  document.querySelectorAll('[data-service]').forEach(link => {
    const servico = link.dataset.service;
    link.href = criarLinkWhatsApp(`Olá! Tenho interesse em ${servico} e gostaria de solicitar uma avaliação na ${CONFIG.nomeClinica}.`);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}

function configurarMenu() {
  const botao = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const fechar = () => {
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('open');
    menu.inert = true;
  };
  botao.addEventListener('click', () => {
    const aberto = botao.getAttribute('aria-expanded') !== 'true';
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('open', aberto);
    menu.inert = !aberto;
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', fechar));
  document.addEventListener('keydown', evento => { if (evento.key === 'Escape') fechar(); });
  document.addEventListener('click', evento => {
    if (!menu.contains(evento.target) && !botao.contains(evento.target)) fechar();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 850) fechar(); });
}

function dataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}
function exibirErro(campo, mensagem) {
  campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
  document.getElementById(`error-${campo.name}`).textContent = mensagem;
}
function configurarAgendamento() {
  const form = document.getElementById('booking-form');
  const nome = form.elements.name;
  const tratamento = form.elements.treatment;
  const data = form.elements.date;
  const horario = form.elements.time;
  const observacoes = form.elements.notes;
  const status = document.getElementById('form-status');
  data.min = dataLocalISO();

  [nome, tratamento, data, horario].forEach(campo => {
    campo.addEventListener('input', () => exibirErro(campo, ''));
    campo.addEventListener('change', () => exibirErro(campo, ''));
  });

  form.addEventListener('submit', evento => {
    evento.preventDefault();
    data.min = dataLocalISO();
    let valido = true;
    const nomeLimpo = nome.value.trim().replace(/\s+/g, ' ');
    const validacoes = [
      [nome, nomeLimpo.length < 3 ? 'Informe seu nome completo (mínimo 3 caracteres).' : ''],
      [tratamento, !tratamento.value ? 'Selecione um tratamento.' : ''],
      [data, !data.value ? 'Selecione uma data.' : (data.value < dataLocalISO() ? 'Escolha uma data de hoje em diante.' : '')],
      [horario, !horario.value ? 'Selecione um horário ou turno.' : '']
    ];
    validacoes.forEach(([campo, erro]) => {
      exibirErro(campo, erro);
      if (erro) { valido = false; }
    });
    if (!valido) {
      status.textContent = 'Revise os campos destacados para continuar.';
      const primeiro = validacoes.find(([, erro]) => erro);
      if (primeiro) primeiro[0].focus();
      return;
    }
    const [ano, mes, dia] = data.value.split('-');
    const mensagem = [
      `Olá! Gostaria de solicitar um agendamento na ${CONFIG.nomeClinica}.`,
      '',
      `Nome: ${nomeLimpo}`,
      `Tratamento: ${tratamento.value}`,
      `Data desejada: ${dia}/${mes}/${ano}`,
      `Horário preferencial: ${horario.value}`,
      `Observações: ${observacoes.value.trim() || 'Nenhuma'}`,
      '',
      'Aguardo a confirmação da disponibilidade. Obrigado(a)!'
    ].join('\n');
    status.textContent = 'Abrindo o WhatsApp para enviar sua solicitação. A consulta ainda não está confirmada.';
    abrirWhatsApp(mensagem);
  });
}

function configurarAnimacoes() {
  const elementos = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    elementos.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -25px 0px' });
  elementos.forEach(el => observer.observe(el));
}

atualizarDados();
configurarBotoesContato();
configurarMenu();
configurarAgendamento();
configurarAnimacoes();

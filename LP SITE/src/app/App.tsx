import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, ExternalLink, Feather, Menu, PlayCircle, Search, Sparkles, X } from "lucide-react";

type DifficultyKey = "easy" | "medium" | "hard";

type Topic = {
  title: string;
  short: string;
  mental: string;
  map: string;
  recognition: string;
  question: string;
  clues: string[];
  steps: string[];
  examples: { sentence: string; note: string }[];
};

type Category = { title: string; description: string; topics: Topic[] };
type VideoResource = { category: string; title: string; teacher: string; description: string; url: string };
type ExerciseQuestion = {
  difficulty: DifficultyKey;
  prompt: string;
  highlighted: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string;
};

const slug = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const normalizeSearch = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const topic = (
  title: string,
  short: string,
  mental: string,
  question: string,
  clues: string[],
  examples: { sentence: string; note: string }[],
): Topic => ({
  title,
  short,
  mental,
  map: "Leia como se fosse uma cena: quem faz algo, o que acontece e qual pedaço da frase completa essa ideia.",
  recognition: "Procure o verbo, observe o conectivo e pergunte que função a segunda oração exerce dentro da frase.",
  question,
  clues,
  steps: ["Ache os verbos.", "Veja se uma oração depende da outra.", "Use a pergunta-chave para descobrir a função."],
  examples,
});

const CATEGORIES: Category[] = [
  {
    title: "Oração Absoluta",
    description: "Uma frase com uma só cena verbal. Ela começa e termina sem precisar de outra oração.",
    topics: [
      topic(
        "Oração Absoluta",
        "É uma oração que aparece sozinha no período.",
        "Imagine uma cena única no palco: não entra outra ação para completar o sentido.",
        "A frase fica completa com esse único verbo?",
        ["um verbo principal", "ideia completa", "sem conectivo ligando outra oração"],
        [
          { sentence: "O estudante revisou a matéria.", note: "Só há uma ação: revisou." },
          { sentence: "Choveu durante a noite.", note: "A cena inteira cabe em um único verbo: choveu." },
        ],
      ),
    ],
  },
  {
    title: "Orações Coordenadas",
    description: "Orações independentes colocadas lado a lado. Uma não vira peça obrigatória da outra.",
    topics: [
      topic("Oração Coordenada Assindética", "Coordenação sem conjunção.", "São vagões ligados por vírgula, ponto e vírgula ou dois-pontos.", "As duas partes têm sentido próprio mesmo sem uma palavra de ligação?", ["vírgula", "ponto e vírgula", "duas ações independentes"], [{ sentence: "Cheguei cedo, organizei os livros.", note: "As duas ações ficam lado a lado, sem conjunção." }]),
      topic("Oração Coordenada Sindética Aditiva", "Soma uma informação à anterior.", "É o sinal de + entre duas ideias.", "A segunda oração acrescenta algo?", ["e", "nem", "também", "além disso"], [{ sentence: "Ela leu o texto e respondeu às questões.", note: "Responder soma uma nova ação ao que ela fez." }]),
      topic("Oração Coordenada Sindética Adversativa", "Mostra oposição ou contraste.", "É como uma placa de 'virada' no caminho.", "A segunda oração contraria uma expectativa?", ["mas", "porém", "contudo", "todavia", "entretanto"], [{ sentence: "Estudei bastante, mas esqueci uma regra.", note: "Depois de estudar, esperava-se lembrar; o 'mas' cria contraste." }]),
      topic("Oração Coordenada Sindética Alternativa", "Apresenta escolha ou alternância.", "É uma bifurcação: caminho A ou caminho B.", "A frase oferece opções?", ["ou", "ora... ora", "quer... quer", "seja... seja"], [{ sentence: "Ou você revisa hoje, ou deixa para amanhã.", note: "Há duas possibilidades." }]),
      topic("Oração Coordenada Sindética Conclusiva", "Mostra conclusão.", "É a seta que sai de uma ideia e chega a um resultado.", "A segunda oração parece consequência lógica da primeira?", ["logo", "portanto", "por isso", "assim", "então"], [{ sentence: "O prazo acabou, portanto entreguei o trabalho.", note: "A entrega aparece como conclusão da situação." }]),
      topic("Oração Coordenada Sindética Explicativa", "Explica ou justifica a oração anterior.", "É como abrir um balão dizendo o motivo do pedido ou afirmação.", "A segunda oração responde 'por quê?' para a primeira?", ["porque", "pois", "que"], [{ sentence: "Feche a janela, porque está ventando.", note: "A segunda oração explica o pedido." }]),
    ],
  },
  {
    title: "Orações Subordinadas Substantivas",
    description: "Funcionam como um substantivo: podem ser sujeito, objeto, complemento, predicativo ou aposto.",
    topics: [
      topic("Oração Subordinada Substantiva Subjetiva", "Faz papel de sujeito.", "A oração inteira ocupa a cadeira do sujeito.", "O que é necessário, provável, bom ou importante?", ["é necessário que", "convém que", "parece que"], [{ sentence: "É importante que você participe.", note: "O que é importante? Que você participe." }]),
      topic("Oração Subordinada Substantiva Objetiva Direta", "Completa verbo sem preposição.", "Ela responde diretamente ao verbo.", "O sujeito disse, percebeu, viu ou desejou o quê?", ["que", "se", "verbos como dizer, saber, perceber"], [{ sentence: "Percebi que ele estava nervoso.", note: "Percebi o quê? Que ele estava nervoso." }]),
      topic("Oração Subordinada Substantiva Objetiva Indireta", "Completa verbo com preposição.", "Antes de entrar, ela passa pela portinha da preposição.", "O verbo pede de, em, a, com ou por antes da ideia?", ["de que", "em que", "a que", "com que"], [{ sentence: "Lembrei-me de que havia prova.", note: "Quem lembra, lembra-se de algo." }]),
      topic("Oração Subordinada Substantiva Completiva Nominal", "Completa o sentido de um nome.", "Não completa um verbo; completa uma palavra carente de sentido.", "Que palavra precisa de complemento: certeza, medo, vontade, necessidade?", ["certeza de que", "medo de que", "necessidade de que"], [{ sentence: "Tenho certeza de que ele virá.", note: "A oração completa o nome 'certeza'." }]),
      topic("Oração Subordinada Substantiva Predicativa", "Funciona como predicativo do sujeito.", "Ela fica depois de um verbo de ligação e diz o que o sujeito é.", "Depois de ser, estar, parecer ou continuar, a oração define o sujeito?", ["é que", "verbo de ligação", "ideia de identidade"], [{ sentence: "A verdade é que todos entenderam.", note: "A oração explica qual é a verdade." }]),
      topic("Oração Subordinada Substantiva Apositiva", "Explica um termo anterior.", "É uma etiqueta explicativa depois de dois-pontos, vírgula ou travessão.", "A oração esclarece uma palavra antes dela?", ["dois-pontos", "isto:", "um desejo:", "uma certeza:"], [{ sentence: "Só quero uma coisa: que você tente.", note: "A oração explica qual é a coisa." }]),
    ],
  },
  {
    title: "Orações Subordinadas Adjetivas",
    description: "Caracterizam um substantivo, como se fossem um adjetivo expandido.",
    topics: [
      topic("Oração Subordinada Adjetiva Explicativa", "Acrescenta uma explicação sobre o termo anterior.", "É um comentário entre pausas.", "A informação poderia sair sem mudar quem está sendo identificado?", ["vírgulas", "que", "o qual", "comentário extra"], [{ sentence: "Meu irmão, que mora longe, chegou ontem.", note: "A oração comenta algo sobre meu irmão." }]),
      topic("Oração Subordinada Adjetiva Restritiva", "Limita ou identifica o termo anterior.", "É um filtro: mostra exatamente de qual ser estamos falando.", "Sem essa oração, a referência fica ampla demais?", ["sem vírgulas", "que", "quem", "onde"], [{ sentence: "Os alunos que estudaram passaram.", note: "Não são todos os alunos; só os que estudaram." }]),
    ],
  },
  {
    title: "Orações Subordinadas Adverbiais",
    description: "Indicam circunstâncias da ação: causa, tempo, condição, finalidade e outras relações de sentido.",
    topics: [
      topic("Oração Subordinada Adverbial Causal", "Mostra o motivo do acontecimento.", "A causa empurra a consequência.", "Por que isso aconteceu?", ["porque", "como", "já que", "visto que"], [{ sentence: "Fiquei em casa porque estava doente.", note: "A doença é o motivo de ficar em casa." }]),
      topic("Oração Subordinada Adverbial Comparativa", "Cria comparação.", "Coloca duas ideias numa balança.", "A frase compara uma ação ou qualidade com outra?", ["como", "mais que", "menos que", "tanto quanto"], [{ sentence: "Ela corre como uma atleta treina.", note: "A ação é comparada a outra." }]),
      topic("Oração Subordinada Adverbial Concessiva", "Mostra obstáculo que não impede a ação.", "É um 'apesar disso' dentro da frase.", "Mesmo com um problema, a ação aconteceu?", ["embora", "ainda que", "mesmo que", "apesar de que"], [{ sentence: "Embora estivesse cansado, terminou a tarefa.", note: "O cansaço não impediu a conclusão." }]),
      topic("Oração Subordinada Adverbial Condicional", "Mostra condição.", "É a porta com uma placa: só passa se a condição acontecer.", "A ação depende de algo?", ["se", "caso", "desde que", "contanto que"], [{ sentence: "Se chover, ficaremos em casa.", note: "Ficar em casa depende da chuva." }]),
      topic("Oração Subordinada Adverbial Conformativa", "Indica acordo ou conformidade.", "A ação segue uma regra, fala ou orientação.", "A ação foi feita conforme algo?", ["conforme", "como", "segundo", "consoante"], [{ sentence: "Fiz o resumo conforme o professor pediu.", note: "O resumo seguiu a orientação." }]),
      topic("Oração Subordinada Adverbial Consecutiva", "Mostra resultado ou efeito.", "A consequência nasce da intensidade anterior.", "O que aconteceu como resultado?", ["tão... que", "tanto... que", "de modo que"], [{ sentence: "Falou tão baixo que ninguém ouviu.", note: "Ninguém ouvir foi consequência de falar baixo." }]),
      topic("Oração Subordinada Adverbial Final", "Mostra finalidade.", "É o alvo da ação.", "Para que a ação foi feita?", ["para que", "a fim de que", "que"], [{ sentence: "Expliquei novamente para que todos entendessem.", note: "A finalidade era o entendimento." }]),
      topic("Oração Subordinada Adverbial Proporcional", "Mostra crescimento ou mudança simultânea.", "Duas barras sobem ou descem juntas.", "Uma coisa muda à medida que outra muda?", ["à medida que", "à proporção que", "quanto mais"], [{ sentence: "Quanto mais lia, mais entendia.", note: "A compreensão cresce junto com a leitura." }]),
      topic("Oração Subordinada Adverbial Temporal", "Marca tempo.", "É o relógio da frase.", "Quando a ação aconteceu?", ["quando", "assim que", "enquanto", "logo que"], [{ sentence: "Quando a aula começou, todos silenciaram.", note: "A oração indica o momento." }]),
    ],
  },
  {
    title: "Orações Reduzidas",
    description: "Orações sem conjunção e com verbo em forma nominal: infinitivo, gerúndio ou particípio.",
    topics: [
      topic("Oração Reduzida de Infinitivo", "Usa verbo terminado em -r.", "O verbo aparece em estado de dicionário: estudar, fazer, sair.", "O verbo está no infinitivo e poderia virar uma oração com conjunção?", ["estudar", "fazer", "sair", "para"], [{ sentence: "Ao chegar, avise-me.", note: "Equivale a: quando chegar, avise-me." }]),
      topic("Oração Reduzida de Gerúndio", "Usa verbo terminado em -ndo.", "Mostra ação em andamento.", "O verbo termina em -ndo?", ["chegando", "falando", "estudando"], [{ sentence: "Estudando todos os dias, você melhora.", note: "Equivale a: se estudar todos os dias." }]),
      topic("Oração Reduzida de Particípio", "Usa particípio.", "A ação aparece como algo já concluído.", "O verbo parece terminado: feito, visto, concluído?", ["feito", "visto", "terminado", "concluído"], [{ sentence: "Terminada a prova, os alunos saíram.", note: "Equivale a: quando a prova terminou." }]),
    ],
  },
  {
    title: "Outras Classificações",
    description: "Casos especiais que aparecem no meio do período e interrompem momentaneamente a fala.",
    topics: [
      topic("Oração Intercalada (ou Interferente)", "Entra no meio da frase como comentário.", "É uma voz que interrompe a cena principal para comentar algo.", "Se eu remover esse comentário, a frase principal continua?", ["disse ele", "creio eu", "penso eu", "travessões"], [{ sentence: "A prova — disse a professora — será amanhã.", note: "A fala intercalada comenta quem disse." }]),
    ],
  },
];

const ALL_TOPICS = CATEGORIES.flatMap((category) => category.topics.map((item) => ({ ...item, category: category.title })));

const findTopicBySlug = (topicSlug: string) => ALL_TOPICS.find((item) => slug(item.title) === topicSlug);

const VIDEOS: VideoResource[] = [
  { category: "Visão geral", title: "Período simples e composto", teacher: "Professor Noslen", description: "Ótimo começo para separar uma oração de várias orações no período.", url: "https://www.youtube.com/watch?v=TTgDePB-IVo" },
  { category: "Orações coordenadas", title: "Orações coordenadas", teacher: "Professor Noslen", description: "Explica coordenação e diferenças entre os principais tipos.", url: "https://www.youtube.com/watch?v=UbrR7An5ZfY" },
  { category: "Orações coordenadas", title: "Playlist de orações coordenadas", teacher: "Professor Noslen", description: "Sequência de aulas para revisar com calma.", url: "https://www.youtube.com/playlist?list=PLVyIxkvuIqxo2x1oYEdyrfLbE9hc1dHWL" },
  { category: "Subordinadas substantivas", title: "Orações subordinadas substantivas", teacher: "Professor Noslen", description: "Mostra como a oração pode funcionar como sujeito, objeto e complemento.", url: "https://www.youtube.com/watch?v=_kzTFOzf-_w" },
  { category: "Subordinadas substantivas", title: "Substantiva subjetiva", teacher: "Professor Noslen", description: "Foco na oração que ocupa o lugar de sujeito.", url: "https://www.youtube.com/watch?v=_1n0nhz4miQ" },
  { category: "Subordinadas substantivas", title: "Substantiva objetiva direta", teacher: "Professor Noslen", description: "Ajuda a enxergar a pergunta 'o quê?' depois do verbo.", url: "https://www.youtube.com/watch?v=nB8Hpc5yvIU" },
  { category: "Subordinadas substantivas", title: "Substantiva objetiva indireta", teacher: "Professor Noslen", description: "Mostra o papel da preposição antes da oração.", url: "https://www.youtube.com/watch?v=0UbTvkq7S7U" },
  { category: "Subordinadas adverbiais", title: "Orações subordinadas adverbiais", teacher: "Professor Noslen", description: "Boa aula para reconhecer causa, condição, tempo, finalidade e contraste.", url: "https://www.youtube.com/watch?v=tCoaqWAaOKk" },
  { category: "Subordinadas adverbiais", title: "Exercícios de orações adverbiais", teacher: "Professor Noslen", description: "Treino prático para diferenciar sentidos parecidos.", url: "https://www.youtube.com/watch?v=XezyCSp7DtI" },
  { category: "Playlist", title: "Playlist de orações subordinadas", teacher: "Professor Noslen", description: "Conjunto de vídeos para estudar por partes.", url: "https://www.youtube.com/playlist?list=PLFGkfA7AyBRm6F3ZWZdIZ91py7lMS96Pl" },
];

const EXERCISES: ExerciseQuestion[] = [
  { difficulty: "easy", prompt: "Classifique a oração destacada.", highlighted: "O estudante revisou a matéria.", options: ["Oração Absoluta", "Oração Coordenada Adversativa", "Oração Subordinada Temporal", "Oração Substantiva Apositiva"], correctIndex: 0, explanation: "Há apenas uma cena verbal: revisou. A frase já fica completa sozinha.", source: "Questão autoral baseada em modelos introdutórios de classificação de período simples." },
  { difficulty: "easy", prompt: "Qual é a relação indicada pelo conectivo?", highlighted: "Ela estudou e fez anotações.", options: ["Adição", "Conclusão", "Oposição", "Condição"], correctIndex: 0, explanation: "O 'e' soma duas ações independentes: estudar + fazer anotações.", source: "Questão autoral inspirada em exercícios básicos de coordenação." },
  { difficulty: "easy", prompt: "O conectivo mostra qual ideia?", highlighted: "Fiquei em casa porque estava doente.", options: ["Causa", "Comparação", "Tempo", "Finalidade"], correctIndex: 0, explanation: "A doença é o motivo de ficar em casa.", source: "Questão autoral baseada em modelos de Brasil Escola e Toda Matéria sobre orações adverbiais." },
  { difficulty: "easy", prompt: "Identifique a oração que funciona como explicação de um termo anterior.", highlighted: "Tenho um desejo: que você seja feliz.", options: ["Substantiva Apositiva", "Adjetiva Restritiva", "Coordenada Alternativa", "Adverbial Condicional"], correctIndex: 0, explanation: "A oração depois dos dois-pontos explica qual é o desejo.", source: "Questão autoral baseada em modelos de substantivas." },
  { difficulty: "easy", prompt: "A oração destacada limita o sentido de qual grupo?", highlighted: "Os alunos que estudaram passaram.", options: ["Adjetiva Restritiva", "Adjetiva Explicativa", "Substantiva Subjetiva", "Coordenada Conclusiva"], correctIndex: 0, explanation: "Não são todos os alunos; apenas os que estudaram.", source: "Questão autoral baseada em exercícios escolares sobre adjetivas." },
  { difficulty: "easy", prompt: "Qual ideia aparece no início da frase?", highlighted: "Quando a aula começou, todos silenciaram.", options: ["Tempo", "Causa", "Concessão", "Comparação"], correctIndex: 0, explanation: "'Quando' marca o momento em que todos silenciaram.", source: "Questão autoral baseada em modelos educativos sobre adverbiais." },
  { difficulty: "easy", prompt: "Que forma verbal aparece na oração reduzida?", highlighted: "Ao chegar, avise-me.", options: ["Infinitivo", "Gerúndio", "Particípio", "Indicativo"], correctIndex: 0, explanation: "'Chegar' está no infinitivo e equivale a 'quando chegar'.", source: "Questão autoral baseada em modelos de orações reduzidas." },

  { difficulty: "medium", prompt: "A oração subordinada completa diretamente o sentido do verbo. Classifique-a.", highlighted: "Percebi que ele estava nervoso.", options: ["Substantiva Objetiva Direta", "Substantiva Subjetiva", "Adverbial Causal", "Adjetiva Explicativa"], correctIndex: 0, explanation: "Percebi o quê? Que ele estava nervoso. A oração é objeto direto.", source: "Questão autoral inspirada em exercícios de Toda Matéria sobre substantivas." },
  { difficulty: "medium", prompt: "Observe a preposição antes da oração e classifique.", highlighted: "Lembrei-me de que havia prova.", options: ["Substantiva Objetiva Indireta", "Substantiva Objetiva Direta", "Coordenada Explicativa", "Adverbial Temporal"], correctIndex: 0, explanation: "Quem se lembra, lembra-se de algo. A preposição 'de' indica objeto indireto.", source: "Questão autoral baseada em modelos de regência e oração substantiva." },
  { difficulty: "medium", prompt: "A oração completa o sentido de um nome, não de um verbo.", highlighted: "Tenho certeza de que ele virá.", options: ["Substantiva Completiva Nominal", "Substantiva Predicativa", "Adjetiva Restritiva", "Coordenada Conclusiva"], correctIndex: 0, explanation: "A oração completa o nome 'certeza'.", source: "Questão autoral inspirada em exercícios de Brasil Escola sobre substantivas." },
  { difficulty: "medium", prompt: "Classifique a oração após o verbo de ligação.", highlighted: "A verdade é que todos entenderam.", options: ["Substantiva Predicativa", "Substantiva Apositiva", "Adverbial Final", "Coordenada Assindética"], correctIndex: 0, explanation: "Depois de 'é', a oração explica o que é 'a verdade'.", source: "Questão autoral baseada em modelos de predicativas." },
  { difficulty: "medium", prompt: "A oração entre vírgulas acrescenta comentário sobre o termo anterior.", highlighted: "Meu irmão, que mora longe, chegou ontem.", options: ["Adjetiva Explicativa", "Adjetiva Restritiva", "Substantiva Subjetiva", "Adverbial Concessiva"], correctIndex: 0, explanation: "Entre vírgulas, ela comenta algo sobre 'meu irmão'.", source: "Questão autoral baseada em exercícios de adjetivas explicativas." },
  { difficulty: "medium", prompt: "Identifique a relação de sentido.", highlighted: "Embora estivesse cansado, terminou a tarefa.", options: ["Concessão", "Condição", "Causa", "Finalidade"], correctIndex: 0, explanation: "O cansaço era obstáculo, mas não impediu a ação.", source: "Questão autoral inspirada em modelos de orações adverbiais." },
  { difficulty: "medium", prompt: "Classifique a oração reduzida.", highlighted: "Estudando todos os dias, você melhora.", options: ["Reduzida de Gerúndio", "Reduzida de Infinitivo", "Reduzida de Particípio", "Adjetiva Explicativa"], correctIndex: 0, explanation: "'Estudando' termina em -ndo e indica circunstância.", source: "Questão autoral baseada em exercícios sobre reduzidas." },

  { difficulty: "hard", prompt: "O conectivo 'como' pode ter sentidos diferentes. Classifique pelo sentido da primeira oração.", highlighted: "Como o relatório apresentou inconsistências, a banca solicitou nova análise dos dados.", options: ["Adverbial Causal", "Adverbial Comparativa", "Adverbial Conformativa", "Coordenada Explicativa"], correctIndex: 0, explanation: "Aqui 'como' equivale a 'porque/já que'. A inconsistência causou a nova análise.", source: "Questão autoral com modelo de pegadinha comum em vestibulares: mesmo conectivo, sentidos diferentes." },
  { difficulty: "hard", prompt: "Classifique pelo sentido, não apenas pela palavra 'que'.", highlighted: "Falou tão baixo que ninguém compreendeu a explicação.", options: ["Adverbial Consecutiva", "Substantiva Objetiva Direta", "Adjetiva Restritiva", "Coordenada Explicativa"], correctIndex: 0, explanation: "A segunda oração mostra o resultado de falar tão baixo.", source: "Questão autoral inspirada em exercícios de consequência de cursinhos pré-vestibulares." },
  { difficulty: "hard", prompt: "A oração introduzida por 'que' exerce função sintática dentro da principal.", highlighted: "É provável que a reunião seja adiada.", options: ["Substantiva Subjetiva", "Substantiva Objetiva Direta", "Adverbial Condicional", "Adjetiva Explicativa"], correctIndex: 0, explanation: "O que é provável? Que a reunião seja adiada. A oração ocupa o papel de sujeito.", source: "Questão autoral baseada em modelos de ENEM e vestibulares sobre função sintática." },
  { difficulty: "hard", prompt: "Diferencie explicação extra de restrição necessária.", highlighted: "Os candidatos que chegaram atrasados perderam a prova.", options: ["Adjetiva Restritiva", "Adjetiva Explicativa", "Adverbial Temporal", "Substantiva Apositiva"], correctIndex: 0, explanation: "Sem vírgulas, a oração filtra quais candidatos perderam a prova.", source: "Questão autoral inspirada em exercícios de Brasil Escola sobre adjetivas." },
  { difficulty: "hard", prompt: "Classifique a relação estabelecida pela oração inicial.", highlighted: "Desde que apresente os documentos, o aluno poderá efetivar a matrícula.", options: ["Adverbial Condicional", "Adverbial Temporal", "Adverbial Causal", "Coordenada Conclusiva"], correctIndex: 0, explanation: "A matrícula depende da apresentação dos documentos.", source: "Questão autoral baseada em modelos de conectivos ambíguos em sites educativos." },
  { difficulty: "hard", prompt: "A oração intercalada interrompe a principal. Identifique a classificação.", highlighted: "A proposta — penso eu — precisa de ajustes antes da votação.", options: ["Oração Intercalada", "Oração Absoluta", "Substantiva Predicativa", "Adverbial Conformativa"], correctIndex: 0, explanation: "'Penso eu' é um comentário inserido no meio da frase. A oração principal continua sem ele.", source: "Questão autoral baseada em modelos de análise sintática de período composto." },
  { difficulty: "hard", prompt: "Classifique a oração reduzida pelo valor e pela forma verbal.", highlighted: "Concluída a investigação, o relatório foi arquivado.", options: ["Reduzida de Particípio", "Reduzida de Gerúndio", "Reduzida de Infinitivo", "Coordenada Assindética"], correctIndex: 0, explanation: "'Concluída' está no particípio e equivale a 'quando a investigação foi concluída'.", source: "Questão autoral inspirada em modelos de orações reduzidas de vestibulares." },
];

function NavigationMenu() {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Início", href: "/" },
    { label: "Área de estudo", href: "/comecar" },
    { label: "Vídeos", href: "/videos" },
    { label: "Exercícios", href: "/exercicios" },
  ];
  return (
    <>
      <button type="button" aria-label="Abrir navegação" onClick={() => setOpen(true)} className="fixed left-3 top-3 z-50 rounded-lg border border-white/15 bg-[#071324]/90 p-2.5 text-white shadow-lg backdrop-blur sm:left-4 sm:top-4">
        <Menu className="h-5 w-5" />
      </button>
      {open && <button type="button" aria-label="Fechar navegação" className="fixed inset-0 z-40 bg-black/45" onClick={() => setOpen(false)} />}
      <aside className={`fixed left-0 top-0 z-50 h-full w-[min(20rem,92vw)] overflow-y-auto border-r border-white/10 bg-[#071324] p-4 text-white shadow-2xl transition-transform sm:p-5 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-7 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a84c] sm:tracking-[0.35em]">Navegação</p>
          <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)} className="rounded-lg border border-white/10 p-2"><X className="h-4 w-4" /></button>
        </div>
        <nav className="grid gap-3">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-base transition hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/15">
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#102142] text-white">
      <NavigationMenu />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#ffffff10 1px, transparent 1px), linear-gradient(90deg, #ffffff10 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <section className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-8 sm:py-24">{children}</section>
    </main>
  );
}

function HomePage() {
  return (
    <PageFrame>
      <div className="mx-auto flex min-h-[72vh] max-w-4xl flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#d6b64f] text-[#142344] sm:mb-8 sm:h-16 sm:w-16"><Feather className="h-7 w-7 sm:h-8 sm:w-8" /></div>
        <div className="mb-7 max-w-full rounded-full border border-[#d6b64f]/45 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-[#d6b64f] sm:mb-8 sm:px-5 sm:text-xs sm:tracking-[0.35em]"><Sparkles className="mr-2 inline h-4 w-4" /> Plataforma educacional lusófona</div>
        <h1 className="text-4xl font-bold leading-tight sm:text-7xl" style={{ fontFamily: "'Playfair Display', serif" }}>Explore a <span className="italic text-[#d6b64f]">Língua</span><br />Portuguesa</h1>
        <a href="/comecar" target="_blank" rel="noreferrer" className="mt-9 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#9f1d17] px-8 py-4 font-semibold text-white transition hover:bg-[#b72a22] sm:w-auto">
          Começar agora <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </PageFrame>
  );
}

function StudyCard({ topic: item }: { topic: Topic }) {
  return (
    <article id={slug(item.title)} className="rounded-2xl border border-[#c9a84c]/30 bg-[#f7f0df] p-4 text-[#142344] shadow-xl sm:rounded-3xl sm:p-6">
      <p className="mb-3 break-words text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9f1d17] sm:text-xs sm:tracking-[0.35em]">{item.title}</p>
      <p className="text-lg leading-relaxed sm:text-xl">{item.short}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <InfoCard title="Pense assim" body={item.mental} />
        <InfoCard title="Como reconhecer" body={item.recognition} />
        <InfoCard title="Chave-chave" body={item.question} big />
        <div className="rounded-2xl border border-[#c9a84c]/40 bg-white/45 p-4 sm:p-5">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#9f1d17] sm:text-sm sm:tracking-[0.25em]">Pistas para procurar</h3>
          <div className="flex flex-wrap gap-2">{item.clues.map((clue) => <span key={clue} className="rounded-full border border-[#c9a84c]/45 bg-[#fff8e8] px-3 py-2 text-sm">{clue}</span>)}</div>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-[#c9a84c]/35 bg-white/45 p-4 sm:p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#9f1d17] sm:text-sm sm:tracking-[0.25em]">Passo a passo para não confundir</h3>
        <div className="grid gap-3 md:grid-cols-3">{item.steps.map((step, index) => <div key={step} className="rounded-2xl bg-white/65 p-4"><span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#9f1d17] font-bold text-white">{index + 1}</span><p>{step}</p></div>)}</div>
      </div>
      <div className="mt-5 rounded-2xl border border-[#c9a84c]/35 bg-white/45 p-4 sm:p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#9f1d17] sm:text-sm sm:tracking-[0.25em]">Exemplos na prática</h3>
        <div className="grid gap-4">{item.examples.map((example) => <div key={example.sentence} className="rounded-2xl border border-[#c9a84c]/30 bg-white/70 p-4"><p className="break-words text-lg font-semibold sm:text-xl">“{example.sentence}”</p><p className="mt-2 text-[#142344]/70">{example.note}</p></div>)}</div>
      </div>
    </article>
  );
}

function InfoCard({ title, body, big = false }: { title: string; body: string; big?: boolean }) {
  return (
    <div className="rounded-2xl border border-[#c9a84c]/40 bg-white/45 p-4 sm:p-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9f1d17] sm:text-sm sm:tracking-[0.25em]">{title}</h3>
      <p className={big ? "text-lg font-semibold leading-relaxed sm:text-xl" : "leading-relaxed"}>{body}</p>
    </div>
  );
}

function StudyPage() {
  const [query, setQuery] = useState("");
  const searchTerm = normalizeSearch(query);
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return CATEGORIES;
    return CATEGORIES
      .map((category) => ({
        ...category,
        topics: category.topics.filter((item) =>
          normalizeSearch(`${item.title} ${category.title} ${item.short} ${item.mental} ${item.clues.join(" ")}`).includes(searchTerm),
        ),
      }))
      .filter((category) => category.topics.length > 0);
  }, [searchTerm]);
  return (
    <PageFrame>
      <div className="mb-8 sm:mb-10">
        <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#d6b64f] sm:text-xs sm:tracking-[0.35em]">Área de estudo</p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>Escolha uma oração e entenda visualmente.</h1>
        <div className="mt-6 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 sm:mt-7">
          <Search className="h-5 w-5 shrink-0 text-[#d6b64f]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar: causal, objetiva direta..." className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/45 sm:text-base" />
        </div>
      </div>
      <div className="mb-10 grid gap-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:rounded-3xl sm:p-5">
        {filteredCategories.length === 0 && (
          <div className="rounded-2xl border border-[#d6b64f]/25 bg-white/[0.06] p-5 text-white/75">
            Nenhuma oração encontrada. Tente pesquisar por termos como “causal”, “objetiva direta”, “coordenada” ou “reduzida”.
          </div>
        )}
        {filteredCategories.map((category) => (
          <div key={category.title}>
            <h2 className="mb-3 break-words text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#d6b64f] sm:text-sm sm:tracking-[0.25em]">{category.title}</h2>
            <div className="flex flex-wrap gap-2">
              {category.topics.map((item) => (
                <a
                  key={item.title}
                  href={`/oracoes/${slug(item.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 w-full items-center justify-center rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-center text-sm leading-snug transition hover:border-[#d6b64f] sm:w-auto sm:rounded-full sm:py-2"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}

function TopicPage({ topicSlug }: { topicSlug: string }) {
  const selectedTopic = findTopicBySlug(topicSlug);

  if (!selectedTopic) {
    return (
      <PageFrame>
        <a href="/comecar" className="mb-5 inline-flex text-sm text-[#d6b64f] hover:text-[#f5dfa0]">← Voltar para a área de estudo</a>
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 sm:rounded-3xl sm:p-8">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#d6b64f] sm:text-xs sm:tracking-[0.35em]">Oração não encontrada</p>
          <h1 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>Essa aba não existe.</h1>
          <p className="mt-4 text-white/70">Volte para a área de estudo e escolha uma oração da lista.</p>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <a href="/comecar" className="mb-5 inline-flex text-sm text-[#d6b64f] hover:text-[#f5dfa0]">← Voltar para a área de estudo</a>
      <p className="mb-4 break-words text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#d6b64f] sm:text-xs sm:tracking-[0.35em]">{selectedTopic.category}</p>
      <h1 className="mb-7 max-w-4xl break-words text-3xl font-bold leading-tight sm:mb-8 sm:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
        {selectedTopic.title}
      </h1>
      <StudyCard topic={selectedTopic} />
    </PageFrame>
  );
}

function VideosPage() {
  return (
    <PageFrame>
      <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#d6b64f] sm:text-xs sm:tracking-[0.35em]">Vídeos</p>
      <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>Aulas em vídeo para reforçar o estudo.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {VIDEOS.map((video) => (
          <a key={video.url} href={video.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-white/[0.07] p-4 transition hover:border-[#d6b64f]/70 hover:bg-white/[0.1] sm:rounded-3xl sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4"><span className="rounded-full bg-[#d6b64f] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#142344]">{video.category}</span><ExternalLink className="h-5 w-5 text-white/50 group-hover:text-[#d6b64f]" /></div>
            <PlayCircle className="mb-5 h-9 w-9 text-[#d6b64f]" />
            <h2 className="break-words text-xl font-bold sm:text-2xl">{video.title}</h2>
            <p className="mt-2 text-sm text-[#d6b64f]">{video.teacher}</p>
            <p className="mt-3 text-white/70">{video.description}</p>
          </a>
        ))}
      </div>
    </PageFrame>
  );
}

function ExercisesPage() {
  const difficulties = [
    { key: "easy" as const, label: "Fácil", description: "Questões diretas, com conectivos visíveis e frases curtas." },
    { key: "medium" as const, label: "Média", description: "Questões medianas, com função sintática e classificações parecidas." },
    { key: "hard" as const, label: "Difícil", description: "Questões mais difíceis, com frases longas, conectivos ambíguos e pegadinhas de sentido." },
  ];
  const [difficulty, setDifficulty] = useState<DifficultyKey>("easy");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const questions = EXERCISES.filter((item) => item.difficulty === difficulty);
  const question = questions[index] ?? questions[0];
  const difficultyInfo = difficulties.find((item) => item.key === difficulty) ?? difficulties[0];
  const answered = selected !== null;
  const isCorrect = selected === question.correctIndex;

  function changeDifficulty(next: DifficultyKey) {
    setDifficulty(next);
    setIndex(0);
    setSelected(null);
  }

  function nextQuestion() {
    setIndex((value) => (value + 1) % questions.length);
    setSelected(null);
  }

  return (
    <PageFrame>
      <a href="/comecar" className="mb-5 inline-flex text-sm text-[#d6b64f] hover:text-[#f5dfa0]">← Voltar para a área de estudo</a>
      <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>Treine as orações por dificuldade.</h1>
      <p className="mt-4 max-w-3xl text-white/70">Questões autorais em formato de alternativas, organizadas por dificuldade e inspiradas em modelos de ENEM, cursinhos e sites educativos.</p>
      <div className="my-6 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        {difficulties.map((item) => (
          <button key={item.key} type="button" aria-pressed={difficulty === item.key} onClick={() => changeDifficulty(item.key)} className={`rounded-full border px-3 py-3 text-sm font-semibold transition sm:px-5 ${difficulty === item.key ? "border-[#d6b64f] bg-[#d6b64f] text-[#142344]" : "border-white/15 bg-white/5 text-white/75 hover:border-[#d6b64f]/70"}`}>
            {item.label}
          </button>
        ))}
      </div>
      <p className="mb-6 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-sm text-white/70 sm:px-5"><span className="font-semibold text-[#d6b64f]">{difficultyInfo.label}:</span> {difficultyInfo.description}</p>
      <article key={`${difficulty}-${index}`} className="rounded-2xl border border-[#c9a84c]/25 bg-[#f7f0df] p-4 text-[#142344] shadow-xl sm:rounded-3xl sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9f1d17] sm:text-xs sm:tracking-[0.22em]">{difficultyInfo.label} · questão {index + 1} de {questions.length}</p>
          <span className="w-fit rounded-full bg-[#142344] px-4 py-2 text-sm font-semibold text-[#f5dfa0]">Alternativa</span>
        </div>
        <div className="rounded-2xl border border-[#c9a84c]/40 bg-white/60 p-4 sm:p-5">
          <p className="mb-3 font-semibold text-[#142344]/75">{question.prompt}</p>
          <p className="break-words rounded-xl bg-[#142344] p-4 text-base leading-relaxed text-white sm:p-5 sm:text-xl">“{question.highlighted}”</p>
          <p className="mt-4 rounded-xl border border-[#c9a84c]/35 bg-[#fffaf0] px-4 py-3 text-sm text-[#142344]/70"><span className="font-semibold text-[#9f1d17]">Fonte/modelo:</span> {question.source}</p>
        </div>
        <div className="mt-6 grid gap-3">
          {question.options.map((option, optionIndex) => (
            <button key={option} type="button" disabled={answered} onClick={() => setSelected(optionIndex)} className={`flex items-start rounded-2xl border p-4 text-left transition ${answered && optionIndex === question.correctIndex ? "border-green-500 bg-green-100 text-green-900" : answered && optionIndex === selected ? "border-red-500 bg-red-100 text-red-900" : "border-[#c9a84c]/35 bg-white/55 hover:border-[#9f1d17]/45"}`}>
              <span className="mr-3 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#142344] text-sm font-bold text-white">{String.fromCharCode(65 + optionIndex)}</span>
              <span className="min-w-0 break-words">{option}</span>
            </button>
          ))}
        </div>
        {answered && (
          <div className={`mt-6 rounded-2xl border p-4 sm:p-5 ${isCorrect ? "border-green-500 bg-green-50 text-green-900" : "border-red-500 bg-red-50 text-red-900"}`}>
            <h3 className="text-xl font-bold">{isCorrect ? "Parabéns, você acertou!" : "Resposta incorreta"}</h3>
            {!isCorrect && <p className="mt-2 font-semibold">Alternativa correta: {String.fromCharCode(65 + question.correctIndex)} — {question.options[question.correctIndex]}</p>}
            <p className="mt-3">{question.explanation}</p>
            <button type="button" onClick={nextQuestion} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#9f1d17] px-5 py-3 text-sm font-semibold text-white">
              Próxima questão <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </article>
    </PageFrame>
  );
}

export default function App() {
  if (window.location.pathname.startsWith("/oracoes/")) return <TopicPage topicSlug={decodeURIComponent(window.location.pathname.replace("/oracoes/", ""))} />;
  if (window.location.pathname === "/comecar") return <StudyPage />;
  if (window.location.pathname === "/videos") return <VideosPage />;
  if (window.location.pathname === "/exercicios") return <ExercisesPage />;
  return <HomePage />;
}

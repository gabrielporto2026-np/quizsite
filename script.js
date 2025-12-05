// Sistema de Quiz Master

// Dados iniciais do sistema
let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [
    {
        id: 1,
        name: "Conhecimentos Gerais",
        description: "Teste seus conhecimentos sobre diversos temas",
        category: "conhecimentos-gerais",
        questions: [
            {
                id: 1,
                text: "Qual é a capital do Brasil?",
                options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
                correctAnswer: 2
            },
            {
                id: 2,
                text: "Quantos planetas existem no nosso sistema solar?",
                options: ["7", "8", "9", "10"],
                correctAnswer: 1
            },
            {
                id: 3,
                text: "Quem pintou a Mona Lisa?",
                options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                correctAnswer: 2
            }
        ],
        plays: 5,
        averageScore: 75
    },
    {
        id: 2,
        name: "História do Brasil",
        description: "Perguntas sobre a história do nosso país",
        category: "historia",
        questions: [
            {
                id: 1,
                text: "Em que ano o Brasil foi descoberto?",
                options: ["1492", "1500", "1502", "1498"],
                correctAnswer: 1
            },
            {
                id: 2,
                text: "Quem proclamou a independência do Brasil?",
                options: ["Dom Pedro I", "Dom Pedro II", "Tiradentes", "Princesa Isabel"],
                correctAnswer: 0
            },
            {
                id: 3,
                text: "Quando foi proclamada a República no Brasil?",
                options: ["1889", "1891", "1900", "1888"],
                correctAnswer: 0
            }
        ],
        plays: 3,
        averageScore: 60
    }
];

let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizTimer = null;
let quizStartTime = null;
let quizStats = JSON.parse(localStorage.getItem('quizStats')) || {
    totalPlays: 0,
    totalQuizzes: 0,
    averageScore: 0
};

// Elementos DOM principais
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const quizzesList = document.getElementById('quizzes-list');
const playQuizzesList = document.getElementById('play-quizzes-list');
const myQuizzesContainer = document.getElementById('my-quizzes-container');
const noQuizzesMessage = document.getElementById('no-quizzes-message');
const createQuizForm = document.getElementById('create-quiz-form');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question-btn');
const resetFormBtn = document.getElementById('reset-form-btn');
const quizSelection = document.getElementById('quiz-selection');
const quizGame = document.getElementById('quiz-game');
const quizTitle = document.getElementById('quiz-title');
const currentQuestionEl = document.getElementById('current-question');
const quizTimerEl = document.getElementById('quiz-timer');
const quizScoreEl = document.getElementById('quiz-score');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const prevQuestionBtn = document.getElementById('prev-question-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const submitQuizBtn = document.getElementById('submit-quiz-btn');
const resultContainer = document.getElementById('result-container');
const correctAnswersEl = document.getElementById('correct-answers');
const totalQuestionsEl = document.getElementById('total-questions');
const finalScoreEl = document.getElementById('final-score');
const scoreFill = document.getElementById('score-fill');
const playAgainBtn = document.getElementById('play-again-btn');
const backToQuizzesBtn = document.getElementById('back-to-quizzes-btn');
const totalQuizzesEl = document.getElementById('total-quizzes');
const totalPlaysEl = document.getElementById('total-plays');
const avgScoreEl = document.getElementById('avg-score');
const quizModal = document.getElementById('quiz-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalQuizName = document.getElementById('modal-quiz-name');
const editQuizBtn = document.getElementById('edit-quiz-btn');
const deleteQuizBtn = document.getElementById('delete-quiz-btn');
const playQuizBtn = document.getElementById('play-quiz-btn');
const currentYear = document.getElementById('current-year');

// Variáveis para controle do modal
let currentModalQuizId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar ano atual no footer
    currentYear.textContent = new Date().getFullYear();
    
    // Carregar estatísticas
    updateStats();
    
    // Carregar quizzes na página inicial
    loadQuizzes();
    
    // Carregar quizzes para jogar
    loadQuizzesForPlay();
    
    // Carregar meus quizzes
    loadMyQuizzes();
    
    // Configurar navegação
    setupNavigation();
    
    // Configurar eventos do formulário de criação
    setupCreateQuizForm();
    
    // Configurar eventos do jogo
    setupQuizGame();
    
    // Configurar modal
    setupModal();
});

// Configurar navegação entre páginas
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            // Atualizar link ativo
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar página correspondente
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            
            // Atualizar conteúdo específico da página
            if (pageId === 'play') {
                loadQuizzesForPlay();
            } else if (pageId === 'my-quizzes') {
                loadMyQuizzes();
            }
        });
    });
}

// Carregar quizzes na página inicial
function loadQuizzes() {
    quizzesList.innerHTML = '';
    
    if (quizzes.length === 0) {
        quizzesList.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 40px;">Nenhum quiz disponível ainda. Crie o primeiro!</p>';
        return;
    }
    
    quizzes.forEach(quiz => {
        const card = createQuizCard(quiz);
        quizzesList.appendChild(card);
    });
}

// Carregar quizzes para jogar
function loadQuizzesForPlay() {
    playQuizzesList.innerHTML = '';
    
    if (quizzes.length === 0) {
        playQuizzesList.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 40px;">Nenhum quiz disponível para jogar. Crie um primeiro!</p>';
        return;
    }
    
    quizzes.forEach(quiz => {
        const card = createQuizCard(quiz, true);
        playQuizzesList.appendChild(card);
    });
}

// Carregar meus quizzes
function loadMyQuizzes() {
    myQuizzesContainer.innerHTML = '';
    
    if (quizzes.length === 0) {
        noQuizzesMessage.style.display = 'block';
        myQuizzesContainer.style.display = 'none';
        return;
    }
    
    noQuizzesMessage.style.display = 'none';
    myQuizzesContainer.style.display = 'grid';
    
    quizzes.forEach(quiz => {
        const card = createMyQuizCard(quiz);
        myQuizzesContainer.appendChild(card);
    });
}

// Criar card de quiz
function createQuizCard(quiz, forPlay = false) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = quiz.id;
    
    // Mapear categoria para nome amigável
    const categoryNames = {
        'conhecimentos-gerais': 'Conhecimentos Gerais',
        'ciencia': 'Ciência',
        'historia': 'História',
        'geografia': 'Geografia',
        'esportes': 'Esportes',
        'entretenimento': 'Entretenimento',
        'tecnologia': 'Tecnologia',
        'outros': 'Outros'
    };
    
    const categoryName = categoryNames[quiz.category] || 'Outros';
    
    card.innerHTML = `
        <div class="card-header">
            <span>${quiz.name}</span>
            <span class="category-badge">${categoryName}</span>
        </div>
        <div class="card-body">
            <p>${quiz.description || 'Sem descrição'}</p>
            <div class="quiz-stats">
                <p><i class="fas fa-question"></i> ${quiz.questions.length} perguntas</p>
                <p><i class="fas fa-play-circle"></i> ${quiz.plays || 0} jogadas</p>
                <p><i class="fas fa-star"></i> ${quiz.averageScore || 0}% de acertos</p>
            </div>
        </div>
        <div class="card-footer">
            ${forPlay ? 
                `<button class="btn btn-primary play-quiz-btn" data-id="${quiz.id}">
                    <i class="fas fa-play"></i> Jogar
                </button>` : 
                `<button class="btn btn-primary view-quiz-btn" data-id="${quiz.id}">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>`
            }
            <button class="btn btn-warning manage-quiz-btn" data-id="${quiz.id}">
                <i class="fas fa-cog"></i> Gerenciar
            </button>
        </div>
    `;
    
    // Adicionar evento para jogar quiz
    if (forPlay) {
        const playBtn = card.querySelector('.play-quiz-btn');
        playBtn.addEventListener('click', function() {
            startQuiz(parseInt(this.dataset.id));
        });
    }
    
    // Adicionar evento para gerenciar quiz
    const manageBtn = card.querySelector('.manage-quiz-btn');
    manageBtn.addEventListener('click', function() {
        openQuizModal(parseInt(this.dataset.id));
    });
    
    return card;
}

// Criar card para meus quizzes
function createMyQuizCard(quiz) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = quiz.id;
    
    // Mapear categoria para nome amigável
    const categoryNames = {
        'conhecimentos-gerais': 'Conhecimentos Gerais',
        'ciencia': 'Ciência',
        'historia': 'História',
        'geografia': 'Geografia',
        'esportes': 'Esportes',
        'entretenimento': 'Entretenimento',
        'tecnologia': 'Tecnologia',
        'outros': 'Outros'
    };
    
    const categoryName = categoryNames[quiz.category] || 'Outros';
    
    card.innerHTML = `
        <div class="card-header">
            <span>${quiz.name}</span>
            <span class="category-badge">${categoryName}</span>
        </div>
        <div class="card-body">
            <p>${quiz.description || 'Sem descrição'}</p>
            <div class="quiz-stats">
                <p><i class="fas fa-question"></i> ${quiz.questions.length} perguntas</p>
                <p><i class="fas fa-play-circle"></i> ${quiz.plays || 0} jogadas</p>
                <p><i class="fas fa-star"></i> ${quiz.averageScore || 0}% de acertos</p>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-primary play-my-quiz-btn" data-id="${quiz.id}">
                <i class="fas fa-play"></i> Jogar
            </button>
            <button class="btn btn-warning manage-quiz-btn" data-id="${quiz.id}">
                <i class="fas fa-cog"></i> Gerenciar
            </button>
        </div>
    `;
    
    // Adicionar eventos
    const playBtn = card.querySelector('.play-my-quiz-btn');
    playBtn.addEventListener('click', function() {
        // Navegar para a página de jogar e iniciar o quiz
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="play"]').classList.add('active');
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById('play').classList.add('active');
        
        startQuiz(parseInt(this.dataset.id));
    });
    
    const manageBtn = card.querySelector('.manage-quiz-btn');
    manageBtn.addEventListener('click', function() {
        openQuizModal(parseInt(this.dataset.id));
    });
    
    return card;
}

// Configurar formulário de criação de quiz
function setupCreateQuizForm() {
    // Adicionar primeira pergunta
    addQuestion();
    
    // Adicionar evento para adicionar nova pergunta
    addQuestionBtn.addEventListener('click', addQuestion);
    
    // Adicionar evento para resetar formulário
    resetFormBtn.addEventListener('click', resetCreateForm);
    
    // Adicionar evento para salvar quiz
    createQuizForm.addEventListener('submit', saveQuiz);
}

// Adicionar nova pergunta ao formulário
function addQuestion() {
    const questionCount = document.querySelectorAll('.question-item').length + 1;
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.dataset.index = questionCount - 1;
    
    questionDiv.innerHTML = `
        <div class="question-item-header">
            <h4>Pergunta ${questionCount}</h4>
            <button type="button" class="btn btn-danger remove-question-btn" ${questionCount === 1 ? 'disabled' : ''}>
                <i class="fas fa-trash"></i> Remover
            </button>
        </div>
        <div class="form-group">
            <label for="question-text-${questionCount}">Texto da pergunta</label>
            <input type="text" id="question-text-${questionCount}" class="question-text" placeholder="Digite a pergunta" required>
        </div>
        <div class="form-group">
            <label>Opções de resposta</label>
            <div class="options-container">
                <div class="option-item">
                    <input type="radio" name="correct-answer-${questionCount}" value="0" checked>
                    <input type="text" class="option-text" placeholder="Opção 1" required>
                </div>
                <div class="option-item">
                    <input type="radio" name="correct-answer-${questionCount}" value="1">
                    <input type="text" class="option-text" placeholder="Opção 2" required>
                </div>
                <div class="option-item">
                    <input type="radio" name="correct-answer-${questionCount}" value="2">
                    <input type="text" class="option-text" placeholder="Opção 3" required>
                </div>
                <div class="option-item">
                    <input type="radio" name="correct-answer-${questionCount}" value="3">
                    <input type="text" class="option-text" placeholder="Opção 4" required>
                </div>
            </div>
        </div>
    `;
    
    questionsContainer.appendChild(questionDiv);
    
    // Adicionar evento para remover pergunta
    const removeBtn = questionDiv.querySelector('.remove-question-btn');
    removeBtn.addEventListener('click', function() {
        if (document.querySelectorAll('.question-item').length > 1) {
            questionDiv.remove();
            updateQuestionNumbers();
        }
    });
}

// Atualizar números das perguntas
function updateQuestionNumbers() {
    const questionItems = document.querySelectorAll('.question-item');
    questionItems.forEach((item, index) => {
        const header = item.querySelector('h4');
        header.textContent = `Pergunta ${index + 1}`;
        item.dataset.index = index;
        
        // Atualizar nomes dos radio buttons
        const radioButtons = item.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radio, radioIndex) => {
            radio.name = `correct-answer-${index}`;
            radio.value = radioIndex;
        });
    });
}

// Resetar formulário de criação
function resetCreateForm() {
    if (confirm('Tem certeza que deseja limpar o formulário? Todos os dados serão perdidos.')) {
        questionsContainer.innerHTML = '';
        createQuizForm.reset();
        addQuestion();
    }
}

// Salvar novo quiz
function saveQuiz(e) {
    e.preventDefault();
    
    // Obter dados do formulário
    const quizName = document.getElementById('quiz-name').value;
    const quizDescription = document.getElementById('quiz-description').value;
    const quizCategory = document.getElementById('quiz-category').value;
    
    // Obter perguntas
    const questionItems = document.querySelectorAll('.question-item');
    const questions = [];
    
    questionItems.forEach((item, index) => {
        const questionText = item.querySelector('.question-text').value;
        const optionInputs = item.querySelectorAll('.option-text');
        const correctAnswer = parseInt(item.querySelector('input[type="radio"]:checked').value);
        
        const options = [];
        optionInputs.forEach(input => options.push(input.value));
        
        questions.push({
            id: index + 1,
            text: questionText,
            options: options,
            correctAnswer: correctAnswer
        });
    });
    
    // Criar novo quiz
    const newQuiz = {
        id: quizzes.length > 0 ? Math.max(...quizzes.map(q => q.id)) + 1 : 1,
        name: quizName,
        description: quizDescription,
        category: quizCategory,
        questions: questions,
        plays: 0,
        averageScore: 0
    };
    
    // Adicionar ao array de quizzes
    quizzes.push(newQuiz);
    
    // Salvar no localStorage
    saveQuizzesToStorage();
    
    // Atualizar estatísticas
    updateStats();
    
    // Resetar formulário
    createQuizForm.reset();
    questionsContainer.innerHTML = '';
    addQuestion();
    
    // Recarregar listas de quizzes
    loadQuizzes();
    loadQuizzesForPlay();
    loadMyQuizzes();
    
    // Mostrar mensagem de sucesso
    alert('Quiz criado com sucesso!');
    
    // Navegar para a página de meus quizzes
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="my-quizzes"]').classList.add('active');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('my-quizzes').classList.add('active');
}

// Configurar jogo de quiz
function setupQuizGame() {
    // Eventos dos botões de navegação
    prevQuestionBtn.addEventListener('click', goToPreviousQuestion);
    nextQuestionBtn.addEventListener('click', goToNextQuestion);
    submitQuizBtn.addEventListener('click', finishQuiz);
    playAgainBtn.addEventListener('click', playAgain);
    backToQuizzesBtn.addEventListener('click', backToQuizzes);
}

// Iniciar um quiz
function startQuiz(quizId) {
    // Encontrar o quiz pelo ID
    currentQuiz = quizzes.find(q => q.id === quizId);
    
    if (!currentQuiz) {
        alert('Quiz não encontrado!');
        return;
    }
    
    // Inicializar variáveis do jogo
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.questions.length).fill(null);
    
    // Mostrar tela do jogo e esconder seleção
    quizSelection.style.display = 'none';
    quizGame.style.display = 'block';
    
    // Configurar informações do quiz
    quizTitle.textContent = currentQuiz.name;
    
    // Iniciar temporizador
    startTimer();
    
    // Mostrar primeira pergunta
    showQuestion();
}

// Mostrar pergunta atual
function showQuestion() {
    if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length) {
        return;
    }
    
    const question = currentQuiz.questions[currentQuestionIndex];
    
    // Atualizar informações da pergunta
    currentQuestionEl.textContent = `Pergunta ${currentQuestionIndex + 1} de ${currentQuiz.questions.length}`;
    questionText.textContent = question.text;
    
    // Limpar opções anteriores
    optionsContainer.innerHTML = '';
    
    // Adicionar opções
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        if (userAnswers[currentQuestionIndex] === index) {
            optionBtn.classList.add('selected');
        }
        optionBtn.textContent = option;
        optionBtn.dataset.index = index;
        
        optionBtn.addEventListener('click', function() {
            selectOption(index);
        });
        
        optionsContainer.appendChild(optionBtn);
    });
    
    // Atualizar estado dos botões
    prevQuestionBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === currentQuiz.questions.length - 1) {
        nextQuestionBtn.style.display = 'none';
        submitQuizBtn.style.display = 'inline-flex';
    } else {
        nextQuestionBtn.style.display = 'inline-flex';
        submitQuizBtn.style.display = 'none';
    }
    
    // Atualizar pontuação
    updateScoreDisplay();
}

// Selecionar uma opção
function selectOption(optionIndex) {
    // Desselecionar todas as opções
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => btn.classList.remove('selected'));
    
    // Selecionar a opção clicada
    optionBtns[optionIndex].classList.add('selected');
    
    // Salvar resposta do usuário
    userAnswers[currentQuestionIndex] = optionIndex;
}

// Ir para a próxima pergunta
function goToNextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

// Ir para a pergunta anterior
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// Iniciar temporizador
function startTimer() {
    quizStartTime = new Date();
    
    quizTimer = setInterval(function() {
        const now = new Date();
        const diff = Math.floor((now - quizStartTime) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        
        quizTimerEl.textContent = `Tempo: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Atualizar exibição da pontuação
function updateScoreDisplay() {
    let score = 0;
    
    // Calcular pontuação parcial
    for (let i = 0; i <= currentQuestionIndex; i++) {
        if (userAnswers[i] === currentQuiz.questions[i].correctAnswer) {
            score++;
        }
    }
    
    quizScoreEl.textContent = `Pontuação: ${score}`;
}

// Finalizar quiz
function finishQuiz() {
    // Parar temporizador
    clearInterval(quizTimer);
    
    // Calcular resultados
    let correctCount = 0;
    
    currentQuiz.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            correctCount++;
        }
    });
    
    const score = Math.round((correctCount / currentQuiz.questions.length) * 100);
    
    // Atualizar estatísticas do quiz
    currentQuiz.plays = (currentQuiz.plays || 0) + 1;
    
    // Calcular nova média de acertos
    if (currentQuiz.averageScore) {
        currentQuiz.averageScore = Math.round((currentQuiz.averageScore + score) / 2);
    } else {
        currentQuiz.averageScore = score;
    }
    
    // Atualizar estatísticas globais
    quizStats.totalPlays++;
    quizStats.totalQuizzes = quizzes.length;
    
    // Calcular nova média global
    const totalScores = quizzes.reduce((sum, quiz) => sum + (quiz.averageScore || 0), 0);
    quizStats.averageScore = Math.round(totalScores / quizzes.length);
    
    // Salvar alterações
    saveQuizzesToStorage();
    localStorage.setItem('quizStats', JSON.stringify(quizStats));
    
    // Atualizar estatísticas na página inicial
    updateStats();
    
    // Mostrar resultados
    showResults(correctCount, score);
}

// Mostrar resultados
function showResults(correctCount, score) {
    // Esconder perguntas e mostrar resultados
    document.getElementById('question-container').style.display = 'none';
    resultContainer.style.display = 'block';
    
    // Atualizar informações dos resultados
    correctAnswersEl.textContent = correctCount;
    totalQuestionsEl.textContent = currentQuiz.questions.length;
    finalScoreEl.textContent = `${score}%`;
    
    // Animar barra de pontuação
    setTimeout(() => {
        scoreFill.style.width = `${score}%`;
    }, 100);
}

// Jogar novamente
function playAgain() {
    // Reiniciar o mesmo quiz
    startQuiz(currentQuiz.id);
    
    // Esconder resultados e mostrar perguntas
    resultContainer.style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
}

// Voltar para a lista de quizzes
function backToQuizzes() {
    // Mostrar seleção e esconder jogo
    quizSelection.style.display = 'block';
    quizGame.style.display = 'none';
    
    // Esconder resultados
    resultContainer.style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    
    // Recarregar lista de quizzes
    loadQuizzesForPlay();
}

// Configurar modal de gerenciamento
function setupModal() {
    // Fechar modal ao clicar no X
    closeModalBtn.addEventListener('click', closeModal);
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === quizModal) {
            closeModal();
        }
    });
    
    // Configurar botões do modal
    editQuizBtn.addEventListener('click', editQuiz);
    deleteQuizBtn.addEventListener('click', deleteQuiz);
    playQuizBtn.addEventListener('click', playQuizFromModal);
}

// Abrir modal de gerenciamento
function openQuizModal(quizId) {
    currentModalQuizId = quizId;
    const quiz = quizzes.find(q => q.id === quizId);
    
    if (!quiz) return;
    
    modalQuizName.textContent = quiz.name;
    quizModal.style.display = 'flex';
}

// Fechar modal
function closeModal() {
    quizModal.style.display = 'none';
    currentModalQuizId = null;
}

// Editar quiz
function editQuiz() {
    if (!currentModalQuizId) return;
    
    const quiz = quizzes.find(q => q.id === currentModalQuizId);
    
    if (!quiz) {
        alert('Quiz não encontrado!');
        closeModal();
        return;
    }
    
    // Preencher formulário com dados do quiz
    document.getElementById('quiz-name').value = quiz.name;
    document.getElementById('quiz-description').value = quiz.description || '';
    document.getElementById('quiz-category').value = quiz.category;
    
    // Limpar perguntas existentes
    questionsContainer.innerHTML = '';
    
    // Adicionar perguntas do quiz
    quiz.questions.forEach((q, index) => {
        // Adicionar container de pergunta
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.dataset.index = index;
        
        questionDiv.innerHTML = `
            <div class="question-item-header">
                <h4>Pergunta ${index + 1}</h4>
                <button type="button" class="btn btn-danger remove-question-btn" ${index === 0 ? 'disabled' : ''}>
                    <i class="fas fa-trash"></i> Remover
                </button>
            </div>
            <div class="form-group">
                <label for="question-text-${index + 1}">Texto da pergunta</label>
                <input type="text" id="question-text-${index + 1}" class="question-text" value="${q.text}" required>
            </div>
            <div class="form-group">
                <label>Opções de resposta</label>
                <div class="options-container">
                    ${q.options.map((option, optIndex) => `
                        <div class="option-item">
                            <input type="radio" name="correct-answer-${index}" value="${optIndex}" ${optIndex === q.correctAnswer ? 'checked' : ''}>
                            <input type="text" class="option-text" value="${option}" required>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        questionsContainer.appendChild(questionDiv);
        
        // Adicionar evento para remover pergunta
        const removeBtn = questionDiv.querySelector('.remove-question-btn');
        removeBtn.addEventListener('click', function() {
            if (document.querySelectorAll('.question-item').length > 1) {
                questionDiv.remove();
                updateQuestionNumbers();
            }
        });
    });
    
    // Fechar modal
    closeModal();
    
    // Navegar para página de criação
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="create"]').classList.add('active');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('create').classList.add('active');
    
    // Adicionar evento para salvar alterações (substituir quiz antigo)
    const form = document.getElementById('create-quiz-form');
    const originalSubmit = form.onsubmit;
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Obter dados do formulário
        const quizName = document.getElementById('quiz-name').value;
        const quizDescription = document.getElementById('quiz-description').value;
        const quizCategory = document.getElementById('quiz-category').value;
        
        // Obter perguntas
        const questionItems = document.querySelectorAll('.question-item');
        const questions = [];
        
        questionItems.forEach((item, index) => {
            const questionText = item.querySelector('.question-text').value;
            const optionInputs = item.querySelectorAll('.option-text');
            const correctAnswer = parseInt(item.querySelector('input[type="radio"]:checked').value);
            
            const options = [];
            optionInputs.forEach(input => options.push(input.value));
            
            questions.push({
                id: index + 1,
                text: questionText,
                options: options,
                correctAnswer: correctAnswer
            });
        });
        
        // Atualizar quiz existente
        const quizIndex = quizzes.findIndex(q => q.id === currentModalQuizId);
        
        if (quizIndex !== -1) {
            quizzes[quizIndex] = {
                ...quizzes[quizIndex],
                name: quizName,
                description: quizDescription,
                category: quizCategory,
                questions: questions
            };
        }
        
        // Salvar alterações
        saveQuizzesToStorage();
        
        // Recarregar listas
        loadQuizzes();
        loadQuizzesForPlay();
        loadMyQuizzes();
        
        // Resetar formulário
        form.reset();
        questionsContainer.innerHTML = '';
        addQuestion();
        
        // Restaurar evento original
        form.onsubmit = originalSubmit;
        
        // Mostrar mensagem
        alert('Quiz atualizado com sucesso!');
        
        // Navegar para meus quizzes
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="my-quizzes"]').classList.add('active');
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById('my-quizzes').classList.add('active');
    };
}

// Excluir quiz
function deleteQuiz() {
    if (!currentModalQuizId) return;
    
    if (confirm('Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita.')) {
        // Remover quiz do array
        quizzes = quizzes.filter(q => q.id !== currentModalQuizId);
        
        // Salvar alterações
        saveQuizzesToStorage();
        
        // Atualizar estatísticas
        updateStats();
        
        // Recarregar listas
        loadQuizzes();
        loadQuizzesForPlay();
        loadMyQuizzes();
        
        // Fechar modal
        closeModal();
        
        alert('Quiz excluído com sucesso!');
    }
}

// Jogar quiz a partir do modal
function playQuizFromModal() {
    if (!currentModalQuizId) return;
    
    closeModal();
    
    // Navegar para página de jogar
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="play"]').classList.add('active');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('play').classList.add('active');
    
    // Iniciar quiz
    startQuiz(currentModalQuizId);
}

// Atualizar estatísticas
function updateStats() {
    totalQuizzesEl.textContent = quizzes.length;
    totalPlaysEl.textContent = quizStats.totalPlays;
    avgScoreEl.textContent = `${quizStats.averageScore}%`;
}

// Salvar quizzes no localStorage
function saveQuizzesToStorage() {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
}
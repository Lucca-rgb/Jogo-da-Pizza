class Game {
    constructor() {
        this.playerElement = document.getElementById('player');
        this.platformsContainer = document.getElementById('platforms');
        this.collectiblesContainer = document.getElementById('collectibles');
        this.scoreElement = document.getElementById('score');
        this.score = 0;
        this.playerPosition = { x: 100, y: 420 }; // Inicia em cima da primeira plataforma
        this.gravity = 10;
        this.isJumping = false;
        this.isCrouching = false;
        this.jumpHeight = 100; // Altura do pulo
        this.jumpDistance = 150; // Distância do pulo
        this.platforms = this.createPlatforms();
        this.collectibles = this.createCollectibles();
        this.updatePlayerPosition();
        this.renderPlatforms();
        this.renderCollectibles();
        this.addControls();
        this.gameLoop(); // Inicia o loop do jogo
        this.renderTrees();
    }

    createPlatforms() {
        return [
            { x: 50, y: 350 },
            { x: 200, y: 250 },
            { x: 400, y: 300 },
            { x: 600, y: 200 },
            { x: 800, y: 320 },
            { x: 900, y: 180 },
            { x: 300, y: 400 },
            { x: 700, y: 150 }
        ];
    }

    renderTrees() {
        const treesContainer = document.getElementById('trees-container');
        const treePositions = [50, 150, 300, 500, 700, 800, 900, 1000, 1100, 1200];

        treePositions.forEach(left => {
            const treeElement = document.createElement('div');
            treeElement.className = 'tree';
            treeElement.style.left = `${left}px`;
            treesContainer.appendChild(treeElement);
        });
    }


    createCollectibles() {
        return [
            { x: 70, y: 370 },  // Posição em cima da primeira plataforma
            { x: 220, y: 270 }, // Posição em cima da segunda plataforma
            { x: 420, y: 320 }, // Posição em cima da terceira plataforma
            { x: 620, y: 220 }, // Posição em cima da quarta plataforma
            { x: 820, y: 340 }, // Posição em cima da quinta plataforma
            { x: 920, y: 200 }, // Posição em cima da sexta plataforma
            { x: 320, y: 420 }, // Posição em cima da sétima plataforma
            { x: 720, y: 170 }  // Posição em cima da oitava plataforma
        ];
    }

    renderPlatforms() {
        this.platforms.forEach(platform => {
            const platformElement = document.createElement('div');
            platformElement.className = 'platform';
            platformElement.style.left = `${platform.x}px`;
            platformElement.style.bottom = `${platform.y}px`;
            this.platformsContainer.appendChild(platformElement);
        });
    }

    renderCollectibles() {
        this.collectibles.forEach(collectible => {
            const collectibleElement = document.createElement('div');
            collectibleElement.className = 'collectible';
            collectibleElement.style.left = `${collectible.x}px`;
            collectibleElement.style.bottom = `${collectible.y}px`;
            this.collectiblesContainer.appendChild(collectibleElement);
        });
    }

    updatePlayerPosition() {
        this.playerElement.style.left = `${this.playerPosition.x}px`;
        this.playerElement.style.bottom = `${this.playerPosition.y}px`;

        // Atualiza a imagem do jogador
        if (this.isJumping) {
            this.playerElement.style.backgroundImage = "url('Pulando.png')"; /* <a href="https://www.flaticon.com/br/icones-gratis/homem" title="homem ícones">Homem ícones criados por DinosoftLabs - Flaticon</a> <a href="https://www.flaticon.com/br/icones-gratis/homem" title="homem ícones">Homem ícones criados por Freepik - Flaticon</a> */
        } else if (this.isCrouching) {
            this.playerElement.style.backgroundImage = "url('Abaixado.png')"; /* <a href="https://www.flaticon.com/br/icones-gratis/postura" title="postura ícones">Postura ícones criados por Leremy - Flaticon</a> <a href="https://www.flaticon.com/br/icones-gratis/postura" title="postura ícones">Postura ícones criados por Leremy - Flaticon</a> */
        } else if (this.playerPosition.x !== 100) {
            this.playerElement.style.backgroundImage = "url('Andando.png')"; /* <a href="https://www.flaticon.com/br/icones-gratis/caminhar" title="caminhar ícones">Caminhar ícones criados por Uniconlabs - Flaticon</a> */
        } else {
            this.playerElement.style.backgroundImage = "url('Persona.png')"; /* <a href="https://www.flaticon.com/br/icones-gratis/homem" title="homem ícones">Homem ícones criados por DinosoftLabs - Flaticon</a> */
        }
    }

    addControls() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                this.playerPosition.x += 5;
                this.updatePlayerPosition();
            }
            if (event.key === 'ArrowLeft') {
                this.playerPosition.x -= 5;
                this.updatePlayerPosition();
            }
            if (event.key === 'ArrowUp' && !this.isJumping) {
                this.isJumping = true;
                this.jump();
            }
            if (event.key === 'ArrowDown') {
                this.isCrouching = true;
                this.collectPizza();
                this.updatePlayerPosition();
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                this.updatePlayerPosition();
            }
            if (event.key === 'ArrowDown') {
                this.isCrouching = false;
                this.updatePlayerPosition();
            }
        });
    }

    jump() {
        const originalX = this.playerPosition.x;

        // Sobe ao pular
        this.playerPosition.y += this.jumpHeight; 
        this.updatePlayerPosition();

        setTimeout(() => {
            // Atravessa enquanto pula
            this.playerPosition.x += this.jumpDistance; // Move para a direita
            this.updatePlayerPosition();
            this.playerPosition.y -= this.jumpHeight; // Aterrissa na altura da plataforma
            this.checkPlatformCollision(); // Verifica colisão após o pulo

            // Se estiver em uma plataforma, ajuste a posição para em cima dela
            this.adjustLandingPosition();
            this.updatePlayerPosition(); // Atualiza a posição do jogador
        }, 500); // Tempo que o jogador permanece no ar
    }

    adjustLandingPosition() {
        const landingPlatform = this.platforms.find(platform => 
            this.playerPosition.x >= platform.x &&
            this.playerPosition.x <= platform.x + 100
        );

        if (landingPlatform) {
            this.playerPosition.y = landingPlatform.y + 20; // Coloca o personagem em cima da plataforma
            this.isJumping = false; // Reseta o estado de pulo
        }
    }

    checkPlatformCollision() {
        const onPlatform = this.platforms.some(platform => {
            return (
                this.playerPosition.x >= platform.x &&
                this.playerPosition.x <= platform.x + 100 &&
                this.playerPosition.y <= platform.y + 20 && // Considera a altura da plataforma
                this.playerPosition.y > platform.y // Deve ser menor que a altura da plataforma
            );
        });
    
        if (!onPlatform) {
            this.playerPosition.y = Math.max(0, this.playerPosition.y - this.gravity); // Se não estiver em nenhuma plataforma, cai
    
            // Verifica se o jogador caiu no ground
            if (this.playerPosition.y <= 50) { // 50 é a altura do ground
                this.endGame(); // Finaliza o jogo
            }
        }
    }

    collectPizza() {
        const playerX = this.playerPosition.x;
        const playerY = this.playerPosition.y;

        this.collectibles = this.collectibles.filter(collectible => {
            // Verifica se o jogador está na mesma posição que a pizza
            if (Math.abs(collectible.x - playerX) < 30 && collectible.y <= playerY + 30 && collectible.y >= playerY) {
                this.score++;
                this.scoreElement.innerText = `Pontuação: ${this.score}`;
                return false; // Remove a pizza coletada
            }
            return true; // Mantém a pizza
        });

        // Atualiza os coletáveis no jogo
        this.collectiblesContainer.innerHTML = ''; // Limpa as pizzas
        this.renderCollectibles(); // Renderiza as restantes

        // Verifica se coletou todas as pizzas
        if (this.collectibles.length === 0) {
            this.endGame();
        }
    }

    endGame() {
        const message = this.collectibles.length === 0 ? "Você ganhou!" : "Você perdeu!";
        this.showMessage(message);
    
        const container = document.createElement('div');
        container.style.textAlign = 'center';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
    
        // Verifica se a mensagem é "Você ganhou!" para adicionar o botão
        if (message === "Você ganhou!") {
            const restartButton = document.createElement('button');
            restartButton.innerText = "Jogar de novo";
            restartButton.style.padding = "10px 20px"; // Adiciona algum preenchimento ao botão
            restartButton.style.fontSize = "16px"; // Aumenta o tamanho da fonte
            restartButton.onclick = () => this.restartGame();
    
            container.appendChild(restartButton);
        }
    
        document.body.appendChild(container);
        this.messageContainer = container; // Armazena a referência ao container da mensagem
    }
    


    showMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.style.fontSize = '24px';
        messageElement.style.color = 'white';
        messageElement.style.textAlign = 'center';
        messageElement.style.position = 'fixed';
        messageElement.style.top = '45%'; // Ajusta para ficar acima do botão
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(messageElement);
        this.messageElement = messageElement; // Armazena a referência à mensagem
    }

    restartGame() {
        // Limpa a tela de mensagens e o botão de reinício
        if (this.messageElement) this.messageElement.remove();
        if (this.messageContainer) this.messageContainer.remove();
    
        // Reseta as variáveis do jogo
        this.score = 0;
        this.scoreElement.innerText = `Pontuação: ${this.score}`;
        this.playerPosition = { x: 100, y: 420 };
        this.collectibles = this.createCollectibles();
        this.collectiblesContainer.innerHTML = '';
        this.renderCollectibles();
    
        this.renderTrees(); // Renderiza as árvores novamente
    
        // Reinicia o loop do jogo
        this.gameLoop();
    }

    gameLoop() {
        setInterval(() => {
            this.checkPlatformCollision(); // Verifica a colisão com plataformas
            this.updatePlayerPosition();
        }, 100); // Atualiza a posição do jogador a cada 100ms
    }
}

const game = new Game();

const fs = require('fs').promises;
const puppeteer = require('puppeteer');
const readline = require('readline');

// Função para obter a entrada do usuário
function questionAsync(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

(async () => {
  try {

    // Pergunta quantas vezes você deseja executar o código em loop
   
    const loopCount = parseInt(await questionAsync('Quantas contas tem configurado? '));
    // Pergunta o conteúdo do comentário uma única vez
    const commentContent = await questionAsync('Qual é o conteúdo do comentário? :');
    // Pergunta a URL para cada iteração
    const url = await questionAsync(`Informe a URL do comentário? : `);
    // Lê o arquivo de usernames
    const usernamesData = await fs.readFile('usernames.txt', 'utf8');
    const usernames = usernamesData.trim().split('\n');

    

    for (let i = 0; i < loopCount; i++) {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      // Primeiro Passo: Acesso ao site https://www.instagram.com/
      await page.goto('https://www.instagram.com/');

      // Aguarda até que o seletor do campo de usuário seja carregado
      await page.waitForSelector('input[name="username"]');

      // Preenche o campo de usuário com o username da iteração atual
      await page.type('input[name="username"]', usernames[i % usernames.length]);

      // Aguarda até que o seletor do campo de senha seja carregado
      await page.waitForSelector('input[name="password"]');

      // Preenche o campo de senha
      await page.type('input[name="password"]', 'deus4488');

      // Aguarda até que o seletor do botão "Entrar" seja carregado
      await page.waitForSelector('button[type="submit"]');

      // Clica no botão "Entrar"
      await page.click('button[type="submit"]');

      // Aguarda um momento para garantir que a página carregue após o clique
      await page.waitForTimeout(5000);


      // Acesso à URL informada
      await page.goto(url);

      // Aguarda até que o seletor do botão de curtir seja carregado
      await page.waitForSelector('svg[aria-label="Curtir"]');

      // Clica no botão de curtir (título <title>Curtir</title> dentro da tag svg)
      await page.click('svg[aria-label="Curtir"]');

      // Aguarda até que o seletor da textarea para comentário seja carregado
      await page.waitForSelector('textarea[aria-label="Adicione um comentário..."]');

      // Escreve o comentário no textarea usando o conteúdo fornecido anteriormente
      await page.type('textarea[aria-label="Adicione um comentário..."]', commentContent);

      // Aguarda até que o seletor da div com class "_aidp" seja carregado (botão "Publicar")
      await page.waitForSelector('div[class="_aidp"]');

      // Clica na div com class "_aidp" para enviar o comentário
      await page.click('div[class="_aidp"]');

      // Aguarda um momento para garantir que a página carregue após o clique
      await page.waitForTimeout(5000);

      await browser.close();
    }

    console.log('Concluído!');
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
})();

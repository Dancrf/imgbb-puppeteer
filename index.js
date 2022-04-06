import chalk from 'chalk';
import puppeteer from 'puppeteer';
import randomUseragent from 'random-useragent';
import { inspect } from 'util';
const agent = randomUseragent.getRandom();

/*
TODO - https://www.sslproxies.org/
TODO - https://hidemy.name/en/proxy-checker/
*/

async function run() {
    const browser = await puppeteer.launch({
        headless: true, // ? SE DEIXAR EM FALSE, TODO O PROCESSO FEITO É MOSTRADO NO CHROME.
        // args: [`--proxy-server=45.42.177.56:3128`],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    // ? AQUI É REDIRECIONADO PARA COPIAR O E-MAIL TEMPORÁRIO
    const mailtm = await browser.newPage();
    await mailtm.goto('https://mail.tm/pt/');

    await mailtm.waitForSelector('[title="Seu endereço de e-mail temporário, clique para copiar para a área de transferência!"]')
    await mailtm.waitForTimeout(4000)
    const email = await mailtm.$eval('[title="Seu endereço de e-mail temporário, clique para copiar para a área de transferência!"]', el => el.value)
    console.log(chalk.bold.blueBright('\nE-mail gerado: ' + chalk.greenBright(email)))

    const nomeUsuario = email.slice(0, 6)
    console.log(chalk.bold.blueBright('Nome extraído: ' + chalk.greenBright(nomeUsuario)))

    // ? APÓS COPIAR O EMAIL, VAI AO IMGBB PARA REALIZAR O CADASTRO
    const imgbb = await browser.newPage();
    imgbb.setUserAgent(agent.toString())

    await imgbb.goto('https://imgbb.com/signup');

    await imgbb.waitForSelector('[name="email"]')
    await imgbb.type('[name="email"]', email)
    await imgbb.type('[name="username"]', nomeUsuario)
    await imgbb.type('[name="password"]', 'Random250#')

    // * Marcar a checkbox
    await imgbb.$eval('[name="signup-accept-terms-policies"]', check => check.checked = true);
    await imgbb.waitForTimeout(2000)
    // * Marcar a checkbox

    await imgbb.click('[class="btn btn-input default"]')
    await imgbb.waitForTimeout(4000)

    await imgbb.setViewport({
        width: 1920,
        height: 1080
    })

    // ? AQUI TERMINA O CADASTRO NO SITE.
    await imgbb.waitForTimeout(2000)
    // await imgbb.screenshot({ path: 'registrado.png' })
    console.log(chalk.yellowBright('\nRegistro no site imgbb concluído.\n'))

    // ? APÓS TER EFETUADO O CADASTRO, VOLTA AO MAIL.TM PARA VALIDAR O CADASTRO
    await mailtm.bringToFront();

    await mailtm.setViewport({
        width: 1920,
        height: 1080
    })

    await mailtm.waitForSelector("#__layout > div > div.flex.flex-1.flex-col.w-0.overflow-hidden > main > div > div.mt-6.dark\\:bg-gray-800.bg-white.shadow.overflow-hidden.sm\\:rounded-md > ul > li > a > div")
    await mailtm.evaluate(() => {
        document.querySelector("#__layout > div > div.flex.flex-1.flex-col.w-0.overflow-hidden > main > div > div.mt-6.dark\\:bg-gray-800.bg-white.shadow.overflow-hidden.sm\\:rounded-md > ul > li > a > div").click()
    }); // ? AQUI, APÓS TER ESPERADO O E-MAIL, CLICA NELE PARA OBTER O LINK DE VALIDAÇÃO.

    await mailtm.waitForTimeout(4000)
    await mailtm.waitForSelector('a') // ?APÓS CLICAR, ESPERA O BOX ONDE CONTÉM O LINK CARREGAR.
    // await mailtm.screenshot({ path: 'mailtm.png' })

    // ? AQUI PEGA O CÓDIGO HTML DO BOX
    const html = await mailtm.evaluate((agoravai) => {
        var child = document.querySelectorAll('[class="aspect-w-16 aspect-h-8 h-full"]', (anchors) => anchors.map((link) => link.href));
        var certo = child[0].innerHTML
        console.log(certo)
        return certo; // * E AQUI RETORNA O CÓDIGO PARA A VARIÁVEL "html".
    });

    var regex = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/gm
    const matches = html.match(regex) // ? AQUI FILTRA TODO O CÓDIGO PARA PEGAR APENAS OS LINKS.

    // console.log(html)
    console.log(chalk.magentaBright('Link de ativação: ' + matches[0]))
    await mailtm.goto(matches[0]) // ? AQUI ELE PEGA O PRIMEIRO LINK E REDIRECIONA O BROWSER PARA ELE PARA VALIDAR O CADASTRO DO IMGBB.

    await imgbb.bringToFront(); // ? APÓS VALIDAR, VAI AO IMGBB PARA COPIAR A API KEY.
    await imgbb.goto('https://imgbb.com/api')
    await imgbb.waitForSelector('[class="btn blue"]')
    await imgbb.click('[class="btn blue"]')

    await imgbb.waitForSelector('.text-input')
    const api = await imgbb.$eval('.text-input', el => el.value)
    console.log(chalk.yellowBright('Api key: ' + api)) // TODO - POR FINAL, COPIA E PRINTA NO CONSOLE A API.
    console.log(APIarray)

    await browser.close();
};

run();

// e76a4974d4562d1cdf1d39f159fc2846
// f66364f0b80ce68cdd35d4a34038e437
// 480d93954825abd880ec2a9fa9112d1f
// 43a9162dfe9e3f73e60ace418623f5a4
// 27eac78b5f4918c52b438aef1aab11e3
// f632bbc8df82dae181fb89fcf78cd63d
// f082e281e52a07ff04646dce701092f8
// ad08aa0424e10bad0c878a0d2573807a
// 768d4ae222b3850c5061ebfa975b546b
// 05d212b8b20bfb91898791c1952f99c3
// 33fcfc56208f2311218f7c98cc50d2eb
// 460c926229c4c020cac33602494e76bb
// 4f663d1acaceb501da8e7cab90ef5517
// e8ae6901ba8bb040bb6ce16ffcb78076

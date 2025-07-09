const apiKeyinput = document.querySelector("#apiKey")
const gameSelect = document.querySelector("#gameSelect")
const questionInput = document.querySelector("#questionInput")
const form = document.querySelector("#form")
const askButton = document.querySelector("#askButton")
const aiResponse = document.querySelector("#aiResponse")

const markdownToHTML = (text) =>{
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarAI = async (question, game, apiKey) =>{
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    let pergunta = ''
    
    if(game == "lol"){
        pergunta = `
        ## Especialidade 
        Você é um especialista assistente de meta para o jogo league of legends

        ## Tarefa
        Você deve responder as perguntas do usuário com base no sei conhecimento do jogo, estratégias, build e dicas.

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei'e não tente inventar uma resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
        - Considere a data atual${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        - Nunca responda itens que voce não tenha certeza de que existe no patch atual

        ## Respostas
        - Economize na resposta, seja direto e responda no máximo 500 caracteres
        - Responda em markdown
        - Nõ precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.


        ## Exemplo de resposta
        Pergunta do usuário: Melhor build rengar jungle
        resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

        ---
        Aqui está a pergunta do usuário: ${question}
    `   

    } else if (game=='Valorant'){
        pergunta = `
            ## Especialidade 
            Você é um especialista assistente de meta para o jogo Valorant

            ## Tarefa
            Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, composições de agentes, uso de habilidades, posicionamentos e dicas.

            ## Regras
            - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
            - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
            - Considere a data atual: ${new Date().toLocaleDateString()}
            - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
            - Nunca responda itens, agentes ou mecânicas que você não tenha certeza de que existem no patch atual.

            ## Respostas
            - Economize na resposta, seja direto e responda no máximo 500 caracteres
            - Responda em markdown
            - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

            ## Exemplo de resposta
            Pergunta do usuário: Qual a melhor composição de agentes para Bind?
            resposta: **Composição forte em Bind:** \n\n - Viper, Skye, Raze, Brimstone, Sova \n\n Boa utilidade para controlar espaço e executar no ataque.

            ---
            Aqui está a pergunta do usuário: ${question}
`   
    } else if (game== "csgo"){
        pergunta = `

            ## Especialidade 
            Você é um especialista assistente de meta para o jogo CS:GO

            ## Tarefa
            Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, táticas, armas, granadas, posições e dicas de execução.

            ## Regras
            - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
            - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
            - Considere a data atual: ${new Date().toLocaleDateString()}
            - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
            - Nunca responda armas, mapas ou estratégias que você não tenha certeza de que estão no patch atual.

            ## Respostas
            - Economize na resposta, seja direto e responda no máximo 500 caracteres
            - Responda em markdown
            - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

            ## Exemplo de resposta
            Pergunta do usuário: Qual a melhor estratégia para TR na Mirage?
            resposta: **Execução comum no TR (Mirage):** \n\n Smoke janela, liga e CT, com split A via rato e palácio. Use molotov para jungle e miragem.

            ---
            Aqui está a pergunta do usuário: ${question}
        `
    }
    
    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools=[{
        google_search:{}
    }]
    // Chamada API

    const response = await fetch(geminiURL, {
        method: 'POST', 
        headers: {
            'Content-Type': 'aplication/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}



const sendForm = async (evt)=>{
    evt.preventDefault()
    const apiKey= apiKeyinput.value
    const game = gameSelect.value
    const question = questionInput.value

    if(apiKey == '' || game == '' || question == ''){
        alert('Por favor, preencha todos os campos')
        return
    }

    askButton.disabled = true
    askButton.textContent = "Perguntando..."
    askButton.classList.add("loading")

    try{
        const text= await perguntarAI(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML= markdownToHTML(text)
        aiResponse.classList.remove("hidden")

    } catch(erro){
        console.log('Erro: ', error)

    } finally{
        askButton.disabled=false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}
form.addEventListener("submit", sendForm)
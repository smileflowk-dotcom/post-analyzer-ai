const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const OPENAI_KEY = "apiKey: process.env.OPENAI_API_KEY"



async function callOpenAI(messages){

const response = await fetch("https://api.openai.com/v1/chat/completions",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${OPENAI_KEY}`
},

body: JSON.stringify({
model:"gpt-4o-mini",
messages
})

})

const data = await response.json()

return data

}



app.post("/analyze", async (req,res)=>{

try{

const post = req.body.post

const data = await callOpenAI([

{
role:"system",
content:"Expert en analyse de contenu marketing."
},

{
role:"user",
content:`Analyse ce post.

Réponds STRICTEMENT dans ce format.

COPYWRITING
Hook : X/10
Clarté : X/10
Tension : X/10
Conversion : X/10

AUTHENTICITÉ
Authenticité : X/10
Profondeur : X/10
Connexion : X/10

SCORE GLOBAL
X/10

VERDICT
🟢 Publier
🟠 Améliorer
🔴 Repenser

AMÉLIORATIONS
• amélioration copywriting
• amélioration authenticité

Post :

${post}`
}

])

const result = data.choices?.[0]?.message?.content || "Erreur analyse"

res.json({
content: result
})

}

catch(error){

console.log(error)

res.json({content:"Erreur serveur"})

}

})



app.post("/improve", async (req,res)=>{

try{

const post = req.body.post

const data = await callOpenAI([

{
role:"system",
content:"Expert en copywriting."
},

{
role:"user",
content:`Améliore ce post.

Règles :

- une seule version améliorée
- pas d'explication
- phrases courtes
- plus engageant
- plus clair

Post :

${post}`
}

])

res.json({
content:data.choices?.[0]?.message?.content || "Erreur"
})

}

catch(error){

console.log(error)

res.json({content:"Erreur serveur"})

}

})



app.listen(3000,()=>{

console.log("Server running on port 3000")

})
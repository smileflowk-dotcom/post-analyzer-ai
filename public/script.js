async function analyzePost(){

const post = document.getElementById("postInput").value

const response = await fetch("http://localhost:3000/analyze",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({ post })

})

const data = await response.json()

let content = data.content

// supprimer les :
content = content.replace(/:/g,"")

// remplacer les bullet points
content = content.replace(/•/g,"✓")

let scoreMatch = content.match(/SCORE GLOBAL\s*([\d.]+\/10)/)

let scoreHTML = ""

if(scoreMatch){

scoreHTML = `
<div class="scoreBox">
SCORE GLOBAL<br>
<span>${scoreMatch[1]}</span>
</div>
`

}

let formatted = content
.replace(/\n/g,"<br>")
.replace("COPYWRITING","<h2>COPYWRITING</h2>")
.replace("AUTHENTICITÉ","<h2>AUTHENTICITÉ</h2>")
.replace("AMÉLIORATIONS","<h2>AMÉLIORATIONS</h2>")
.replace("✓ amélioration copywriting","<h3>COPYWRITING</h3>")
.replace("✓ amélioration authenticité","<h3>AUTHENTICITÉ</h3>")
.replace(/SCORE GLOBAL\s*[\d.]+\/10/, "")

document.getElementById("result").innerHTML =
scoreHTML + formatted

}



async function improvePost(){

const post = document.getElementById("postInput").value

const response = await fetch("http://localhost:3000/improve",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({ post })

})

const data = await response.json()

document.getElementById("result").innerHTML = `

<h2>VERSION AMÉLIORÉE</h2>

${data.content.replace(/\n/g,"<br>")}

<div class="ctaBox">

<p class="ctaText">
La plupart des posts échouent<br>
avant même la deuxième ligne.
</p>

<p class="ctaText">
C’est souvent là que tout se joue.
</p>

<p class="ctaText">
Découvre comment structurer les tiens.
</p>

<p class="ctaSmall">
Une communauté d'entrepreneurs explore déjà cette méthode.
</p>

<a href="https://www.skool.com/entre-donneur-4684/about" target="_blank">
<button class="ctaButton">
Clique ici et rejoins le mouvement
</button>
</a>

</div>

`

}
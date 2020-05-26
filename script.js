let method;
let req = new XMLHttpRequest();
let url = "https://spreadsheets.google.com/feeds/cells/1ffY6Q5YdF53VcEMcFxnvGcie3bbKx8WzMKr0R9-RWi8/1/public/full?alt=json" ;
let etudiant = document.querySelector('#simplon');

function getDataFromGoogleSheetAPI(){

    // get json 
    method = "GET";
    req.open(method, url);
    req.responseType = "json";
    req.send();

    req.onload = () =>{
        if(req.readyState ===  XMLHttpRequest.DONE && req.status === 200){

            // Récupérer la réponse json
            let reponse = req.response;

            // Récupérer nos informations du tableau
            let infos = reponse.feed.entry;

            // Pour avoir le nombre de colonne pour le découpage
            let colonne = [];

            for(let i = 0; i < infos.length; i++){
                colonne.push(infos[i].gs$cell.col);
            }

            // On récupère l'ensemble des valeurs, puis on le rend unique et on fini par regarder la valeur max
            let colonneUnique = [...new Set(colonne)];
            let maxColonne = Math.max(...colonneUnique);

            let tableauData = [];
            let tableauEntete = [];

            // Traitement de l'information
            infos.forEach(element => {
                if (element.gs$cell.row == 1){
                    tableauEntete.push(element);
                }else{
                    tableauData.push(element);
                }
            });

            // Le head et le body de notre tableau
            let head = document.querySelector('#header');
            let body = document.querySelector('#body');

            // Pour la création du header du tableau
            for (let k = 0; k < tableauEntete.length; k++) {
                let td = document.createElement('td');
                td.innerHTML += tableauEntete[k].content.$t;
                head.appendChild(td);
            }

            // Pour la création du body du tableau
            for (let j = 0; j < tableauData.length; j++){
            
                // On crée la ligne
                let tr = document.createElement('tr');

                for (let l = 0; l < maxColonne; l++) {
                    let td = document.createElement('td');
                    td.innerHTML = tableauData[l].content.$t;
                    tr.appendChild(td);
                }

                // Passage à la ligne quand la colonne est à 1
                if (tableauData[j].gs$cell.col == 1){

                    body.appendChild(tr);
                }
            }

        }else{
            console.error("erreur de communication");
        }
    }
}

getDataFromGoogleSheetAPI();
// On récupère Le head et le body de notre tableau
let head = document.querySelector('#header');
let body = document.querySelector('#body');

// Les variables pour faire une requete vers notre google sheet en format json
let method;
let req = new XMLHttpRequest();
let url = "https://spreadsheets.google.com/feeds/cells/1ffY6Q5YdF53VcEMcFxnvGcie3bbKx8WzMKr0R9-RWi8/1/public/full?alt=json" ;
let etudiant = document.querySelector('#simplon');

// Fonction de sécurité 
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Fonction faire le rendu du JSON
function getDataFromGoogleSheetAPI(){

    // On récupère le JSON
    method = "GET";
    req.open(method, url);
    req.responseType = "json";
    req.send();

    req.onload = () =>{
        if(req.readyState ===  XMLHttpRequest.DONE && req.status === 200){

            // Récupérer la réponse json et les informations que nous avons besoin
            let reponse = req.response;
            let infos = reponse.feed.entry;


            if(infos != undefined){
                
                // les tableaux pour les entetes et les datas
                let tableauData = [];
                let tableauEntete = [];

                // Traitement de l'information pour différencier si c'est des données de l'en tête ou des données pour le body
                infos.forEach(element => {
                    if (element.gs$cell.row == 1) {
                        tableauEntete.push(element);
                    } else {
                        tableauData.push(element);
                    }
                });

                if(tableauEntete.length != 0){

                    // Pour la création du header du tableau
                    for (let k = 0; k < tableauEntete.length; k++) {

                        // variable avec les données du header du tableau
                        var headerInsert = tableauEntete[k].content.$t.toUpperCase();

                        // Création de notre entete
                        let td = document.createElement('td');
                        td.innerHTML += htmlEntities(headerInsert);
                        head.appendChild(td);
                    }
                }else{

                    // Gestion du cas où il n'y a pas d'information dans le header
                    let divError = document.createElement('div');
                    divError.innerHTML = "Aucune donnée n'a été trouvée pour le header de notre tableau !";
                    head.appendChild(divError);
                }
               
                if(tableauData.length != 0){

                    // Pour la création du body du tableau
                    for (let j = 0; j < tableauData.length; j++) {

                        // variable avec les données du body du tableau
                        var dataInsert = tableauData[j].content.$t;

                        // On crée la ligne et à chaque fois que la colonne est 1, on crée
                        if (tableauData[j].gs$cell.col == 1) {

                            // Pour la valeur de la première colonne
                            var tr = document.createElement('tr');
                            tr.innerHTML += htmlEntities(dataInsert);

                        } else {

                            // Pour la valeur des autres colonnes puis on fini par l'ajouter au html
                            let td = document.createElement('td');
                            td.innerHTML = htmlEntities(dataInsert);
                            tr.appendChild(td);
                            body.appendChild(tr);
                        }
                    }
                }else{

                    // Gestion du cas où il n'y a pas d'information dans le body
                    let divError = document.createElement('div');
                    divError.innerHTML = "Aucune donnée n'a été trouvée !";
                    body.appendChild(divError);
                }
               
            }else{
                alert('Notre source de donnée est vide !');
            }
            
        }else{
            alert("Il y a eu une erreur de communication");
        }
    }
}

getDataFromGoogleSheetAPI();
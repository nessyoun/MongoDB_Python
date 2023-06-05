//upload data via onload

function upload() {
  const url = "http://127.0.0.1:5000/countElements";
  const url1 = "http://127.0.0.1:5000/top3";
  var DATA=null
  $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function(response) {
        // La réponse est un objet JSON
        document.getElementById("box1").innerHTML=response["nombre de books"][0]["count"];
        document.getElementById("box2").innerHTML=response["nombre de users"][0]["count"];
        document.getElementById("box3").innerHTML=response["nombre de telechargements"];
      },
      error: function(xhr, status, error) {
        console.log('Une erreur est survenue: ' + error);
      }
    });
    $.ajax({
      url: url1,
      type: 'GET',
      dataType: 'json',
      success: function(response) {
        // La réponse est un objet JSON
        jsonToTable( response["tableau"]);
       
      },
      error: function(xhr, status, error) {
        console.log('Une erreur est survenue: ' + error);
      }
    });
    




    $.ajax({
      url: 'http://127.0.0.1:5000/porcentageBooks',
      type: 'GET',
      dataType: 'json',
      success: function(response) {
         DATA=response["data"];
         chartsData= tabTotab(DATA);
         console.log(DATA);
         console.log(chartsData);
         const ctx = document.getElementById('myChart');
         new Chart(ctx, {
           type: 'doughnut',
           data: {
             labels: chartsData[0],
             datasets: [{
               label: '# of Downloads',
               data: chartsData[1],
               borderWidth: 1
             }]
           }
         });
         const ctx1 = document.getElementById('myChart1');
       
         new Chart(ctx1, {
           type: 'bar',
           data: {
             labels: chartsData[0],
             datasets: [{
               label: '# of Downloads',
               data: chartsData[1],
               borderWidth: 1
             }]
           }
         });
       
      },
      error: function(xhr, status, error) {
        console.log('Une erreur est survenue: ' + error);
      }
    });





}

function tabTotab(tab) {
var tab1 = [];
var tab2 = [];

for (var i = 0; i < tab.length; i++) {
  tab1.push(tab[i][1]);
  tab2.push(tab[i][2]);
}

var res = [tab1, tab2];
return res;
}










function jsonToTable(json) {
  let table = '<table class="table table-striped text-center">';
  table += '<thead><tr>';

  // Get the column headers
  for (let key in json[0]) {
    table += '<th>' + key + '</th>';
  }

  table += '</tr></thead><tbody>';

  // Loop through the data and add each row
  for (let i = 0; i < json.length; i++) {
    table += '<tr>';

    for (let key in json[i]) {
      table += '<td>' + json[i][key] + '</td>';
    }

    table += '</tr>';
  }

  table += '</tbody></table>';

  // Add the table to the div with the ID "tableau"
  document.getElementById("tableau").innerHTML = table;
}




function display()
    {
      document.getElementById("btn").style.display = "block";
    }


    function formTojson(id)
    {
      // Récupérer les données du formulaire
      const formulaire = document.getElementById(id);
      const donneesFormulaire = new FormData(formulaire);

      // Convertir les données en objet JSON
      const objetJSON = {};
      for (const [cle, valeur] of donneesFormulaire.entries()) {
        objetJSON[cle] = valeur;
      }
      const donneesJSON = JSON.stringify(objetJSON);
      return donneesJSON;
    }

    function ajouter()
    {
      
      //document.getElementById("res").innerHTML=formTojson("insertion");
      $.ajax({
        url: "http://127.0.0.1:5000/insert",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formTojson("insertion")),
        success: function(response) {
          // La réponse est un objet JSON
          document.getElementById("res").style.display = "block";
          document.getElementById("res").innerHTML=response["message"];
         
        },
        error: function(xhr, status, error) {
          console.log('Une erreur est survenue: ' + error);
        }
      });
      const formulaire = document.getElementById("insertion");
      
      const btn = document.getElementById("col").onclick=true;
      formulaire.reset();

    }

    function sendJSON() {
      var fileInput = document.getElementById('collection');
      var file = fileInput.files[0];
    
      var reader = new FileReader();
      reader.onload = function(event) {
        var jsonContent = event.target.result;
        var jsonData = JSON.parse(jsonContent);
    
        // Make an AJAX request to send the JSON data
        $.ajax({
          url: 'http://127.0.0.1:5000/insert_many',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(jsonData),
          success: function(result) {
            // Handle the response from the server
            console.log(result);
          },
          error: function(error) {
            // Handle any error that occurred during the request
            console.error('Error:', error);
          }
        });
      };
      reader.readAsText(file);
    }


    function dispo()
    {
      document.getElementById("details").style.display = "block";
    }

    function displayDetails(row) {
      console.log("function called");
      var val = row.cells[0].innerHTML;
      $.ajax({
        url: 'http://127.0.0.1:5000/id',
        type: 'GET',
        contentType: 'application/json',
        data: {"val":val},
        success: function(result) {
          // Handle the response from the server
          var res= result["result"][0];
          document.getElementById('_id').value= res['_id']
          document.getElementById('title').value = res['title'];
          document.getElementById('isbn').value = res['isbn'];
          document.getElementById('pageCount').value = res['pageCount'];
          document.getElementById('publishedDate').value =res['publishedDate'];
          document.getElementById('thumbnailUrl').value = res['thumbnailUrl'];
          document.getElementById('shortDescription').value = res['shortDescription'];
          document.getElementById('longDescription').value = res['longDescription'];
          document.getElementById('status').value = res['status'];
          document.getElementById('authors').value = res['authors'];
          document.getElementById('categories').value = res['categories']
        },
        error: function(error) {
          // Handle any error that occurred during the request
          console.error('Error:', error);
        }
      });
    
      
    }
    
    function editItem() {
      var id = document.getElementById("_id").value;
      //document.getElementById("res").innerHTML=formTojson("insertion");
      $.ajax({
        url: "http://127.0.0.1:5000/update",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formTojson("insertion")),
        success: function(response) {
          // La réponse est un objet JSON
          alert("le document est bien modifié")
         
        },
        error: function(xhr, status, error) {
          console.log('Une erreur est survenue: ' + error);
        }
      });
      const formulaire = document.getElementById("insertion");
      
      formulaire.reset();
    }
    
    function deleteItem() {
      var fil = document.getElementById("_id").value;
      $.ajax({
        url: 'http://127.0.0.1:5000/delete',
        type: 'GET',
        contentType: 'application/json',
        data: {"fil":fil},
        success: function(result) {
          alert("le document est bien supprimer")
          
        },
        error: function(error) {
          // Handle any error that occurred during the request
          console.error('Error:', error);
        }
      });
      setTimeout(function() {
        location.reload();
      }, 3000);
    }
    
    

    $(document).ready(function() {

      $("#valu").on("input", function() {
        var inputText = $(this).val();
        $.ajax({
          url: 'http://127.0.0.1:5000/find',
          type: 'GET',
          contentType: 'application/json',
          data: {"val" : "\""+inputText+"\""},
          success: function(result) {
            // Handle the response from the server
            jsonToTable1(result["result"])
          },
          error: function(error) {
            // Handle any error that occurred during the request
            console.error('Error:', error);
          }
        });
      });
    });


    // var filtre = ""; // Variable initiale

    // document.querySelectorAll(".dropdown-item").forEach(function(item) {
    //   item.addEventListener("click", function(e) {
    //     e.preventDefault(); // Empêcher le comportement par défaut du lien
    //     filtre = this.innerText; // Extraire le texte de la balise <a>
    //     console.log("Nouveau filtre : " + filtre);
    //   });
    // });




    function jsonToTable1(json) {
      let table = '<table class="table table-striped text-center" id="booksTable">';
      table += '<thead><tr>';
    
      // Get the column headers
      for (let key in json[0]) {
        table += '<th>' + key + '</th>';
      }
    
      table += '</tr></thead><tbody>';
    
      // Loop through the data and add each row
      for (let i = 0; i < json.length; i++) {
        table += '<tr onclick="displayDetails(this)">';
    
        for (let key in json[i]) {
          table += '<td>' + json[i][key] + '</td>';
        }
    
        table += '</tr>';
      }
    
      table += '</tbody></table>';
    
      // Add the table to the div with the ID "tableau"
      document.getElementById("tableau").innerHTML = table;
    }

   

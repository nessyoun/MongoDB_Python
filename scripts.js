//upload data via onload
function upload() {
    const url = "http://127.0.0.1:5000/countElements";
    const url1 = "http://127.0.0.1:5000/top3";
    
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
          // La réponse est un objet JSON
          document.getElementById("box1").innerHTML=response["nombre de books"][0]["count"];
          ;
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
      
}







function jsonToTable(json) {
    let table = '<table class="table table-striped">';
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
  

  const ctx = document.getElementById('myChart');
  
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Downloads',
          data: [88, 0, 0, 5, 2, 5],
          borderWidth: 1
        }]
      }
    });
    const ctx1 = document.getElementById('myChart1');
  
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Downloads',
          data: [12, 8, 3, 5, 2, 3],
          borderWidth: 1
        }]
      }
    });


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
			var file = $('#collection')[0].files[0];
			if (file) {
				var reader = new FileReader();
				reader.readAsText(file, 'UTF-8');
				reader.onload = function(evt) {
					var jsonData = evt.target.result;
					$.ajax({
						type: 'GET',
						url:'http://127.0.0.1:5000/insert_many',
						data: jsonData,
						contentType: 'application/json; charset=utf-8',
						dataType: 'json',
						success: function(response) {
							document.getElementById("res").style.display = "block";
              document.getElementById("res").innerHTML=response["message"];
						},
						error: function(xhr, status, error) {
							document.getElementById("res").style.display = "block";
              document.getElementById("res").innerHTML=error;
						}
					});
				}
			}
		}

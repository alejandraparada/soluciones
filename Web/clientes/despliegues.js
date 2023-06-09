require([
    "esri/layers/FeatureLayer",
    "esri/dijit/FeatureTable",
    "dojo/parser",
    "dojo/ready",
    "dojo/on",
    "esri/dijit/AttributeInspector",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "dojo/_base/lang",
  ], function (
    FeatureLayer, FeatureTable, parser, ready, on, AttributeInspector, ContentPane, BorderContainer, QueryTask, Query, lang,
  ) {

    parser.parse();

    ready(function(){
      var popupOptions = {
        marginLeft: "20",
        marginTop: "20"
      };
    
      loadTable();

      function loadTable(){
        ///////////////Servicios de FeatureLayer segun cada tabla del modelo/////////////
        let myFeatureLayer = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/1",{
          mode: FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"],
          visible: true,
          id: "fLayer"
        });

        ///////////////Servicios de FeatureTable para cada Feature Layer/////////////
        let myFeatureTable = new FeatureTable({
          featureLayer : myFeatureLayer,
          showRelatedRecords: true,
          outFields: ["*"],
          editable: true
        }, 'myTableNode');
        myFeatureTable.startup();

        let id_cliente = 0;
        let id_despliegue = 0;
        let id_solucion = 0;
        let objectid = 0;

        myFeatureTable.on("load", function(evt){
          ////Querytask de cada Tabla/FeatureLayer////
          var queryTask =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/0");
          var queryTask1 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/1");
          var queryTask3 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/3");

          //Query para obtener desplegable de clientes
          var query = new Query();
          query.where = "1 = 1";
          query.returnGeometry = false;
          query.outFields =["ID_Cliente", "Nombre"];

          queryTask.execute(query, lang.hitch(this, function(results){
            for (var i =0; i< results.features.length; i++){
              opt = document.createElement("option");
              opt.value= results.features[i].attributes.ID_Cliente;
              opt.innerHTML=results.features[i].attributes.Nombre;
              document.getElementById("Despliegues_ID_Cliente").add(opt);
            }
          }));

          //Query para obtener id de despliegue
          var query1 = new Query();
          query1.where = "1 = 1";
          query1.returnGeometry = false;
          query1.outFields =["ID_Despliegue"];

          queryTask1.execute(query1, lang.hitch(this, function(results){
            id_despliegue = results.features[results.features.length-1].attributes.ID_Despliegue + 1;
          }));

          var query3 = new Query();
          query3.where = "1 = 1";
          query3.returnGeometry = false;
          query3.outFields =["ID_Solucion", "Nombre"];

          queryTask3.execute(query3, lang.hitch(this, function(results){
            console.log(results)
            for (var i =0; i< results.features.length; i++){
              opt = document.createElement("option");
              opt.value= results.features[i].attributes.ID_Solucion;
              opt.innerHTML=results.features[i].attributes.Nombre;
              document.getElementById("Despliegues_ID_Solucion").add(opt);
            }
  
          }));
          
          ////////////////////////// CREAR //////////////////////////
          //Despliegues - Dar de alta nuevo Despliegue 
          let buttonDespliegue = document.getElementById("addDeploymentButton");
          buttonDespliegue.addEventListener("click", (evt) => {

            let addsDespliegue = {
              attributes: {
              }
            };
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_despliegues");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return}
                addsDespliegue.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            addsDespliegue.attributes["ID_Despliegue"] = id_despliegue;
            addsDespliegue.attributes["ID_Cliente"] = document.getElementById("Despliegues_ID_Cliente").value;
            addsDespliegue.attributes["ID_Solucion"] = document.getElementById("Despliegues_ID_Solucion").value;
            id_despliegue += 1;
            myFeatureTable.featureLayer.applyEdits([addsDespliegue], null, null);
            myFeatureTable.refresh();
          }); 

          ///////////////////////LIMPIAR CAMPOS//////////////////////////
          //Clientes - Limpiar Campos del Formulario
          let buttonClearClientes = document.getElementById("clearFormDeploymentButton");
          buttonClearClientes.addEventListener("click", (evt) => {
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_despliegues");
            for(let i = 0; i < inputs.length-1; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return;}
                inputs[i].value = "";
              }
            }
          });
        });
      }
    });
  });
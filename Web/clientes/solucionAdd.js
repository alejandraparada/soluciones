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
        let myFeatureLayer = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/3",{
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
        let id_recurso = 0;
        let id_solucion = 0;
        let objectid = 0;

        myFeatureTable.on("load", function(evt){
          ////Querytask de cada Tabla/FeatureLayer////
          var queryTask =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/0");
          var queryTask2 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/2");
          var queryTask3 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/3");

          //Query para obtener id de solucion
          var query2 = new Query();
          query2.where = "1 = 1";
          query2.returnGeometry = false;
          query2.outFields =["ID_Solucion"];

          queryTask3.execute(query2, lang.hitch(this, function(results){
            id_solucion = results.features[results.features.length-1].attributes.ID_Solucion + 1;
          }));
          console.log("idR", id_solucion)
          
          ////////////////////////// CREAR //////////////////////////
          //Soluciones - Dar de alta nuevo Solucion 
          let buttonSolucion = document.getElementById("addSolutionButton");
          buttonSolucion.addEventListener("click", (evt) => {

            let addsSolucion = {
              attributes: {
              }
            };
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_soluciones");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return}
                addsSolucion.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            addsSolucion.attributes["ID_Solucion"] = id_solucion;
            addsSolucion.attributes["Version"] = document.getElementById("Soluciones_Version").value;
            id_solucion += 1;
            myFeatureTable.featureLayer.applyEdits([addsSolucion], null, null);
            myFeatureTable.refresh();
          }); 


          ///////////////////////LIMPIAR CAMPOS//////////////////////////
          //Soluciones - Limpiar Campos del Formulario
          let buttonClearSoluciones = document.getElementById("clearFormSolutionButton");
          buttonClearSoluciones.addEventListener("click", (evt) => {
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_soluciones");
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
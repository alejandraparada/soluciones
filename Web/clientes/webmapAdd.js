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
        let myFeatureLayer = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/4",{
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
          var queryTask2 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/2");

          //Query para obtener desplegable de recursos
          var query2 = new Query();
          query2.where = "1 = 1";
          query2.returnGeometry = false;
          query2.outFields =["OBJECTID","ID_Recurso", "Nombre"];

          queryTask2.execute(query2, lang.hitch(this, function(results){
            // objectid = results.features[0].attributes.OBJECTID
            // objectid += 1
            for (var i =0; i< results.features.length; i++){
              opt = document.createElement("option");
              opt.value= results.features[i].attributes.ID_Recurso;
              opt.innerHTML=results.features[i].attributes.Nombre;
              document.getElementById("Webmaps_ID_Recurso").add(opt);
            }
          }));
          
          ////////////////////////// CREAR //////////////////////////
          //Webmap - Dar de alta nuevo Webmap 
          let buttonWebmap = document.getElementById("addWebmapButton");
          buttonWebmap.addEventListener("click", (evt) => {

            let addsWebmap = {
              attributes: {
              }
            };
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_webmap");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return}
                addsWebmap.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            addsWebmap.attributes["ID_Recurso"] = document.getElementById("Webmaps_ID_Recurso").value;
            addsWebmap.attributes["Webmap_Nombre"] = document.getElementById("Webmaps_Webmap_Nombre").value;
            myFeatureTable.featureLayer.applyEdits([addsWebmap], null, null);
            myFeatureTable.refresh();
          }); 


          ///////////////////////LIMPIAR CAMPOS//////////////////////////
          //Webmap - Limpiar Campos del Formulario
          let buttonClearWebmap = document.getElementById("clearFormWebmapButton");
          buttonClearWebmap.addEventListener("click", (evt) => {
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_webmap");
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
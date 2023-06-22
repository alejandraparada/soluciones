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
        let myFeatureLayer = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/5",{
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

        let id_app = 1;

        myFeatureTable.on("load", function(evt){
          ////Querytask de cada Tabla/FeatureLayer////
          var queryTask2 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/2");
          var queryTask5 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/5");

          //Query para obtener id de solucion
          var query2 = new Query();
          query2.where = "1 = 1";
          query2.returnGeometry = false;
          query2.outFields =["ID_App"];

          queryTask5.execute(query2, lang.hitch(this, function(results){
            id_app = results.features[results.features.length-1].attributes.ID_App + 1;
          }));
          console.log("idR", id_app)
          
          //Query para obtener desplegable de recurso
          var query3 = new Query();
          query3.where = "1 = 1";
          query3.returnGeometry = false;
          query3.outFields =["ID_Recurso", "Nombre"];

          queryTask2.execute(query3, lang.hitch(this, function(results){
            console.log(results)
            for (var i =0; i< results.features.length; i++){
              opt = document.createElement("option");
              opt.value= results.features[i].attributes.ID_Recurso;
              opt.innerHTML=results.features[i].attributes.Nombre;
              document.getElementById("App_ID_Recurso").add(opt);
            }
  
          }));

          ////////////////////////// CREAR //////////////////////////
          //Apps - Dar de alta nueva App 
          let buttonApp = document.getElementById("addAppButton");
          buttonApp.addEventListener("click", (evt) => {

            let addsApp = {
              attributes: {
              }
            };
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_app");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return}
                addsApp.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            addsApp.attributes["ID_App"] = id_app;
            addsApp.attributes["Nombre"] = document.getElementById("App_Nombre").value;
            addsApp.attributes["Tipo"] = document.getElementById("App_Tipo").value;
            addsApp.attributes["ID_Recurso"] = document.getElementById("App_ID_Recurso").value;
            id_app += 1;
            myFeatureTable.featureLayer.applyEdits([addsApp], null, null);
            myFeatureTable.refresh();
          }); 

          ///////////////OBTENER DOMINIOS DE FEATURE LAYER//////////////
          myFeatureLayer.fields.forEach(field => {
            if (field.name == "Tipo"){
              let domain = myFeatureLayer.getDomain("Tipo");
              // console.log("domain", domain.name)
              if(domain && domain.type == "codedValue"){
                domain.codedValues.forEach(codedValue => {
                  opt = document.createElement("option");
                  opt.value= codedValue.code;
                  opt.innerHTML=codedValue.name;
                  document.getElementById("App_Tipo").add(opt);
                });
              }
            }
          });


          ///////////////////////LIMPIAR CAMPOS//////////////////////////
          //Apps - Limpiar Campos del Formulario
          let buttonClearApp = document.getElementById("clearFormAppButton");
          buttonClearApp.addEventListener("click", (evt) => {
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_app");
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
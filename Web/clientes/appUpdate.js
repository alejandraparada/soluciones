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

        let id_cliente = 0;
        let id_despliegue = 0;
        let id_recurso = 0;
        let id_solucion = 0;
        let id_app = 0;
        let objectid = 0;

        myFeatureTable.on("load", function(evt){
          ////Querytask de cada Tabla/FeatureLayer////
          var queryTask =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/0");
          var queryTask2 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/2");
          var queryTask3 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/3");
          var queryTask5 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/5");

          //Query para obtener id de App
          var query2 = new Query();
          query2.where = "1 = 1";
          query2.returnGeometry = false;
          query2.outFields =["ID_App"];

          queryTask5.execute(query2, lang.hitch(this, function(results){
            id_solucion = results.features[results.features.length-1].attributes.ID_App + 1;
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

          ///////////////OBTENER DOMINIOS DE FEATURE LAYER//////////////
          myFeatureLayer.fields.forEach(field => {
            if(!field.nullable){
              console.log("permitenull",field.name, field.nullable)
            }
            console.log("null",field.name, field.nullable)
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

          /////////////////////////REFRESH TABLE////////////////////
          //App - Refresh table button
          let buttonRefreshApp = document.getElementById("refreshTableAppButton");
          buttonRefreshApp.addEventListener("click", (evt) => {
            myFeatureTable.refresh();
          });

          /////////////////////////MODIFICAR/////////////////////////
          //App - Modificar solucion existente
          let buttonUpdateApp = document.getElementById("updateAppButton");
          buttonUpdateApp.addEventListener("click", (evt) => {

          var updatesApp = {
            attributes: {},
            geometry: null
          };
              
          var inputs = document.getElementsByClassName("form_field_app");
          for(let i = 0; i < inputs.length; i++){
            if(inputs[i].type != "submit"){
              if(inputs[i].value == null || inputs[i].value === ""){return}
              updatesApp.attributes[inputs[i].alt] = inputs[i].value;
            }
          }
          updatesApp.attributes["OBJECTID"] = objectid;
          updatesApp.attributes["ID_Recurso"] = document.getElementById("App_ID_Recurso").value;
          updatesApp.attributes["Tipo"] = document.getElementById("App_Tipo").value;

          myFeatureTable.featureLayer.applyEdits(null, [updatesApp], null, function(addResults, updateResults, deleteResults) {
            console.log("Edición aplicada correctamente");
            }, function(error) {
                console.error("Error al aplicar la edición: ", error);
            });

            myFeatureTable.refresh();
          });

          //////////////////////SELECCIONAR DESDE TABLA//////////////////////
          //App - Seleccionar solución y mostrar en formulario
          myFeatureTable.on("row-select", function(evt){
            myFeatureTable.featureLayer.fields.forEach(field => {
              var data = evt.rows[0].data
              for(let i = 1; i < Object.keys(data).length; i++){
                if(Object.keys(data)[i].endsWith("ID_App")){
                  id_app= Object.values(data)[i]
                  console.log("APP2",id_app)
                  
                  var queryA = new Query();
                  queryA.where = "ID_App = "+ id_app;
                  queryA.returnGeometry = false;
                  queryA.outFields =["OBJECTID","ID_App"];

                  queryTask5.execute(queryA, lang.hitch(this, function(results){
                    objectid = results.features[0].attributes.OBJECTID
                    console.log("OBJ",objectid)
                  }));

                }else if(Object.keys(data)[i].endsWith(field.name)){
                  document.getElementById(`App_${field.name}`).value = Object.values(data)[i]
                  console.log("data[]",Object.values(data)[i])
                }
              }
            });
          });

          ////////////////////////ELIMINAR///////////////////////
          //App - Elimminar App existente
          let buttonDeleteApp = document.getElementById("deleteAppButton");
          buttonDeleteApp.addEventListener("click", (evt) => {

            let deletesApp = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_soluciones");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return}
                deletesApp.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            deletesApp.attributes["OBJECTID"] = objectid;

            myFeatureTable.featureLayer.applyEdits(null, null, [deletesApp], function(addResults, updateResults, deleteResults) {
              console.log("Solucion eliminado correctamente");
            }, function(error) {
              console.error("Error al eliminar cliente: ", error);
            });

            myFeatureTable.refresh();
          });

          
        });
      }
    });
  });
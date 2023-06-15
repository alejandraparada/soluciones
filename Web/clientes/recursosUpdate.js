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
        let myFeatureLayer = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/2",{
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

          //Query para obtener id de recurso
          var query2 = new Query();
          query2.where = "1 = 1";
          query2.returnGeometry = false;
          query2.outFields =["ID_Recurso"];

          queryTask2.execute(query2, lang.hitch(this, function(results){
            id_recurso = results.features[results.features.length-1].attributes.ID_Recurso + 1;
          }));
          console.log("idR", id_recurso)

          //Query para obtener desplegable de soluciones
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
              document.getElementById("Recursos_ID_Solucion").add(opt);
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
                  document.getElementById("Recursos_Tipo").add(opt);
                });
              }
            }
            if (field.name == "Requiere_Automatizacion"){
              let domain = myFeatureLayer.getDomain("Requiere_Automatizacion");
              // console.log("domain", domain.name)
              if(domain && domain.type == "codedValue"){
                domain.codedValues.forEach(codedValue => {
                  opt = document.createElement("option");
                  opt.value= codedValue.code;
                  opt.innerHTML=codedValue.name;
                  document.getElementById("Recursos_Requiere_Automatizacion").add(opt);
                });
              }
            }
          });

          /////////////////////////REFRESH TABLE////////////////////
          //Recursos - Refresh table button
          // let buttonRefreshDespliegues = document.getElementById("refreshTableResourcesButton");
          // buttonRefreshDespliegues.addEventListener("click", (evt) => {
          //   myFeatureTable.refresh();
          // });

          /////////////////////////MODIFICAR/////////////////////////
          //Recursos - Modificar recurso existente
          let buttonUpdateResources = document.getElementById("updateResourcesButton");
          buttonUpdateResources.addEventListener("click", (evt) => {
            

          var updatesRecursos = {
            attributes: {},
            geometry: null
          };
              
          var inputs = document.getElementsByClassName("form_field_recursos");
          for(let i = 0; i < inputs.length; i++){
            if(inputs[i].type != "submit"){
              if(inputs[i].value == null || inputs[i].value === ""){inputs[i].value == ""}
              updatesRecursos.attributes[inputs[i].alt] = inputs[i].value;
            }
          }
          updatesRecursos.attributes["OBJECTID"] = objectid;
          updatesRecursos.attributes["ID_Solucion"] = document.getElementById("Recursos_ID_Solucion").value;
          updatesRecursos.attributes["Tipo"] = document.getElementById("Recursos_Tipo").value;
          updatesRecursos.attributes["Requiere_Automatizacion"] = document.getElementById("Recursos_Requiere_Automatizacion").value;

          myFeatureTable.featureLayer.applyEdits(null, [updatesRecursos], null, function(addResults, updateResults, deleteResults) {
            console.log("Edición aplicada correctamente");
            }, function(error) {
                console.error("Error al aplicar la edición: ", error);
            });
            

            myFeatureTable.refresh();
          });

          //////////////////////SELECCIONAR DESDE TABLA//////////////////////
          //Recursos - Seleccionar recurso y mostrar en formulario
          myFeatureTable.on("row-select", function(evt){
            myFeatureTable.featureLayer.fields.forEach(field => {
              var data = evt.rows[0].data
              for(let i = 1; i < Object.keys(data).length; i++){
                if(Object.keys(data)[i].endsWith("ID_Recurso")){
                  id_recurso= Object.values(data)[i]
                  console.log("DESPLIEGUE2",id_recurso)
                  
                  var queryA = new Query();
                  queryA.where = "ID_Recurso = "+ id_recurso;
                  queryA.returnGeometry = false;
                  queryA.outFields =["OBJECTID","ID_Recurso"];

                  queryTask2.execute(queryA, lang.hitch(this, function(results){
                    objectid = results.features[0].attributes.OBJECTID
                    console.log("OBJ",objectid)
                  }));

                }else if(Object.keys(data)[i].endsWith(field.name)){
                  document.getElementById(`Recursos_${field.name}`).value = Object.values(data)[i]
                  console.log("data[]",Object.values(data)[i])
                }
              }
            });
          });

          ////////////////////////ELIMINAR///////////////////////
          //Recursos - Elimminar recurso existente
          let buttonDeleteRecurso = document.getElementById("deleteResourcesButton");
          buttonDeleteRecurso.addEventListener("click", (evt) => {

            let deletesRecurso = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_clientes");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return}
                deletesRecurso.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            deletesRecurso.attributes["OBJECTID"] = objectid;

            myFeatureTable.featureLayer.applyEdits(null, null, [deletesRecurso], function(addResults, updateResults, deleteResults) {
              console.log("Cliente eliminado correctamente");
            }, function(error) {
              console.error("Error al eliminar cliente: ", error);
            });

            myFeatureTable.refresh();
          });

        });
      }
    });
  });
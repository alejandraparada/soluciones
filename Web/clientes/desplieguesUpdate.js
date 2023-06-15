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
          
          /////////////////////////REFRESH TABLE////////////////////
          //Despliegues - Refresh table button
          // let buttonRefreshDespliegues = document.getElementById("refreshTableDeploymentButton");
          // buttonRefreshDespliegues.addEventListener("click", (evt) => {
          //   myFeatureTable.refresh();
          // });

          /////////////////////////MODIFICAR/////////////////////////
          //Despliegues - Modificar despliegue existente
          let buttonUpdateDespliegue = document.getElementById("updateDeploymentButton");
          buttonUpdateDespliegue.addEventListener("click", (evt) => {

          var updatesDespliegue = {
            attributes: {},
            geometry: null
          };
              
          var inputs = document.getElementsByClassName("form_field_despliegues");
          for(let i = 0; i < inputs.length; i++){
            if(inputs[i].type != "submit"){
              if(inputs[i].value == null || inputs[i].value === ""){return}
              updatesDespliegue.attributes[inputs[i].alt] = inputs[i].value;
            }
          }
          updatesDespliegue.attributes["OBJECTID"] = objectid;

          myFeatureTable.featureLayer.applyEdits(null, [updatesDespliegue], null, function(addResults, updateResults, deleteResults) {
            console.log("Edición aplicada correctamente");
            }, function(error) {
                console.error("Error al aplicar la edición: ", error);
            });

            myFeatureTable.refresh();
          });

          //////////////////////SELECCIONAR DESDE TABLA//////////////////////
          //Despliegues - Seleccionar despliegue y mostrar en formulario
          myFeatureTable.on("row-select", function(evt){
            myFeatureTable.featureLayer.fields.forEach(field => {
              var data = evt.rows[0].data
              for(let i = 1; i < Object.keys(data).length; i++){
                if(Object.keys(data)[i].endsWith("ID_Despliegue")){
                  id_despliegue= Object.values(data)[i]
                  console.log("DESPLIEGUE2",id_despliegue)
                  
                  var queryA = new Query();
                  queryA.where = "ID_Despliegue = "+ id_despliegue;
                  queryA.returnGeometry = false;
                  queryA.outFields =["OBJECTID","ID_Despliegue"];

                  queryTask1.execute(queryA, lang.hitch(this, function(results){
                    objectid = results.features[0].attributes.OBJECTID
                    console.log("OBJ",objectid)
                  }));

                }else if(Object.keys(data)[i].endsWith(field.name)){
                  document.getElementById(`Despliegues_${field.name}`).value = Object.values(data)[i]
                  console.log("data[]",Object.values(data)[i])
                }
              }
            });
          });

          ////////////////////////ELIMINAR///////////////////////
          //Despliegues - Elimminar despliegue existente
          let buttonDeleteDespliegue = document.getElementById("deleteDeploymentButton");
          buttonDeleteDespliegue.addEventListener("click", (evt) => {

            let deletesDespliegue = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_clientes");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return}
                deletesDespliegue.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            deletesDespliegue.attributes["OBJECTID"] = objectid;

            myFeatureTable.featureLayer.applyEdits(null, null, [deletesDespliegue], function(addResults, updateResults, deleteResults) {
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
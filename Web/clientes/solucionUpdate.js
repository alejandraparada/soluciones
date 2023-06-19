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
          
          /////////////////////////REFRESH TABLE////////////////////
          //Despliegues - Refresh table button
          let buttonRefreshSoluciones = document.getElementById("refreshTableSolutionButton");
          buttonRefreshSoluciones.addEventListener("click", (evt) => {
            myFeatureTable.refresh();
          });

          /////////////////////////MODIFICAR/////////////////////////
          //Soluciones - Modificar solucion existente
          let buttonUpdateSoluciones = document.getElementById("updateSolutionButton");
          buttonUpdateSoluciones.addEventListener("click", (evt) => {

          var updatesSolucion = {
            attributes: {},
            geometry: null
          };
              
          var inputs = document.getElementsByClassName("form_field_soluciones");
          for(let i = 0; i < inputs.length; i++){
            if(inputs[i].type != "submit"){
              if(inputs[i].value == null || inputs[i].value === ""){return}
              updatesSolucion.attributes[inputs[i].alt] = inputs[i].value;
            }
          }
          updatesSolucion.attributes["OBJECTID"] = objectid;

          myFeatureTable.featureLayer.applyEdits(null, [updatesSolucion], null, function(addResults, updateResults, deleteResults) {
            console.log("Edición aplicada correctamente");
            }, function(error) {
                console.error("Error al aplicar la edición: ", error);
            });

            myFeatureTable.refresh();
          });

          //////////////////////SELECCIONAR DESDE TABLA//////////////////////
          //Soluciones - Seleccionar solución y mostrar en formulario
          myFeatureTable.on("row-select", function(evt){
            myFeatureTable.featureLayer.fields.forEach(field => {
              var data = evt.rows[0].data
              for(let i = 1; i < Object.keys(data).length; i++){
                if(Object.keys(data)[i].endsWith("ID_Solucion")){
                  id_solucion= Object.values(data)[i]
                  console.log("DESPLIEGUE2",id_solucion)
                  
                  var queryA = new Query();
                  queryA.where = "ID_Solucion = "+ id_solucion;
                  queryA.returnGeometry = false;
                  queryA.outFields =["OBJECTID","ID_Solucion"];

                  queryTask3.execute(queryA, lang.hitch(this, function(results){
                    objectid = results.features[0].attributes.OBJECTID
                    console.log("OBJ",objectid)
                  }));

                }else if(Object.keys(data)[i].endsWith(field.name)){
                  document.getElementById(`Soluciones_${field.name}`).value = Object.values(data)[i]
                  console.log("data[]",Object.values(data)[i])
                }
              }
            });
          });

          ////////////////////////ELIMINAR///////////////////////
          //Soluciones - Elimminar solución existente
          let buttonDeleteSoluciones = document.getElementById("deleteSolutionButton");
          buttonDeleteSoluciones.addEventListener("click", (evt) => {

            let deletesSolucion = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_soluciones");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return}
                deletesSolucion.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            deletesSolucion.attributes["OBJECTID"] = objectid;

            myFeatureTable.featureLayer.applyEdits(null, null, [deletesSolucion], function(addResults, updateResults, deleteResults) {
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
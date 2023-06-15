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
          var queryTask4 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/4");
          var queryTask2 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/2");
          var queryTask3 =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/3");

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
          
          /////////////////////////REFRESH TABLE////////////////////
          //Webmaps - Refresh table button
          // let buttonRefreshWebmap = document.getElementById("refreshTableWebmapButton");
          // buttonRefreshWebmap.addEventListener("click", (evt) => {
          //   myFeatureTable.refresh();
          // });

          /////////////////////////MODIFICAR/////////////////////////
          //Webmaps - Modificar webmap existente
          let buttonUpdateWebmap = document.getElementById("updateWebmapButton");
          buttonUpdateWebmap.addEventListener("click", (evt) => {

          var updatesWebmap = {
            attributes: {},
            geometry: null
          };
              
          var inputs = document.getElementsByClassName("form_field_webmap");
          for(let i = 0; i < inputs.length; i++){
            if(inputs[i].type != "submit"){
              if(inputs[i].value == null || inputs[i].value === ""){return}
              updatesWebmap.attributes[inputs[i].alt] = inputs[i].value;
            }
          }
          updatesWebmap.attributes["OBJECTID"] = objectid;
          updatesWebmap.attributes["Webmap_Nombre"] = document.getElementById(`Webmaps_Webmap_Nombre`).value;

          myFeatureTable.featureLayer.applyEdits(null, [updatesWebmap], null, function(addResults, updateResults, deleteResults) {
            console.log("Edición aplicada correctamente");
            }, function(error) {
                console.error("Error al aplicar la edición: ", error);
            });

            myFeatureTable.refresh();
          });

          //////////////////////SELECCIONAR DESDE TABLA//////////////////////
          //Webmap - Seleccionar solución y mostrar en formulario
          myFeatureTable.on("row-select", function(evt){
            myFeatureTable.featureLayer.fields.forEach(field => {
              var data = evt.rows[0].data
              objectid = evt.rows[0].data.OBJECTID
              id_recurso = evt.rows[0].data.ID_Recurso
              var wMapName = evt.rows[0].data.Webmap_Nombre
              console.log("log", objectid, id_recurso, wMapName)

              document.getElementById(`Webmaps_ID_Recurso`).value = id_recurso
              document.getElementById(`Webmaps_Webmap_Nombre`).value = wMapName
            });
          });

          ////////////////////////ELIMINAR///////////////////////
          //Webmaps - Elimminar webmap existente
          let buttonDeleteWebmap = document.getElementById("deleteWebmapButton");
          buttonDeleteWebmap.addEventListener("click", (evt) => {

            let deletesWebmap = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_webmap");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return}
                deletesWebmap.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            deletesWebmap.attributes["OBJECTID"] = objectid;

            myFeatureTable.featureLayer.applyEdits(null, null, [deletesWebmap], function(addResults, updateResults, deleteResults) {
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
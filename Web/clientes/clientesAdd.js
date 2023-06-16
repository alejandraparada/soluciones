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
        let myFeatureLayer = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/0",{
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
        let objectid = 0;

        myFeatureTable.on("load", function(evt){
            ////Querytask de cada Tabla/FeatureLayer////
            var queryTask =new QueryTask("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/0");

            var query = new Query();
            query.where = "1 = 1";
            query.returnGeometry = false;
            query.outFields =["ID_Cliente", "Nombre"];

            queryTask.execute(query, lang.hitch(this, function(results){
                id_cliente = results.features[results.features.length-1].attributes.ID_Cliente + 1;
            }));
          
            ////////////////////////// CREAR //////////////////////////
            //Clientes - Dar de alta nuevo Cliente 
            let buttonClientes = document.getElementById("addCustomerButton");
            buttonClientes.addEventListener("click", (evt) => {

                let addsClientes = {
                    attributes: {
                    }
                };
                //Obtener Elementos input del formulario por el nombre de la clase  
                let inputs = document.getElementsByClassName("form_field_clientes");
                for(let i = 0; i < inputs.length; i++){
                    if(inputs[i].type != "submit"){
                      if(inputs[i].value == null || inputs[i].value === ""){return;}
                      addsClientes.attributes[inputs[i].alt] = inputs[i].value;
                    }
                }
                addsClientes.attributes["ID_Cliente"] = id_cliente;
                id_cliente += 1;
                myFeatureTable.featureLayer.applyEdits([addsClientes], null, null);
                myFeatureTable.refresh();
            }); 

          ///////////////////////LIMPIAR CAMPOS//////////////////////////
          //Clientes - Limpiar Campos del Formulario
          let buttonClearClientes = document.getElementById("clearFormCustomerButton");
          buttonClearClientes.addEventListener("click", (evt) => {
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_clientes");
            for(let i = 0; i < inputs.length; i++){
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
  
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

            ///////////////////////REFRESH TABLE////////////////////
            // Clientes - Refresh table button
            let buttonRefreshClientes = document.getElementById("refreshTableCustomerButton");
            buttonRefreshClientes.addEventListener("click", (evt) => {
              myFeatureTable.refresh();
            });

            /////////////////////////MODIFICAR/////////////////////////
            //Clientes - Modificar cliente existente
            let buttonUpdateCliente = document.getElementById("updateCustomerButton");
            buttonUpdateCliente.addEventListener("click", (evt) => {

            var updatesClientes = {
                attributes: {},
                geometry: null
            };
                
            var inputs = document.getElementsByClassName("form_field_clientes");
            for(let i = 0; i < inputs.length; i++){
                if(inputs[i].type != "submit"){
                    if(inputs[i].value == null || inputs[i].value === ""){inputs[i].value == ""}
                    updatesClientes.attributes[inputs[i].alt] = inputs[i].value;
                }
            }
            updatesClientes.attributes["OBJECTID"] = objectid;
            


            myFeatureTable.featureLayer.applyEdits(null, [updatesClientes], null, function(addResults, updateResults, deleteResults) {
                console.log("Edición aplicada correctamente");
            }, function(error) {
                console.error("Error al aplicar la edición: ", error);
            });

            myFeatureTable.refresh();
          });

          

          // ///////////////////////LIMPIAR CAMPOS//////////////////////////
          // //Clientes - Limpiar Campos del Formulario
          // let buttonClearClientes = document.getElementById("clearFormCustomerButton");
          // buttonClearClientes.addEventListener("click", (evt) => {
          //   //Obtener Elementos input del formulario por el nombre de la clase  
          //   let inputs = document.getElementsByClassName("form_field_clientes");
          //   for(let i = 0; i < inputs.length; i++){
          //       if(inputs[i].type != "submit"){
          //           if(inputs[i].value == null || inputs[i].value === ""){return;}
          //           inputs[i].value = "";
          //       }
          //   }
          // });

          //////////////////////SELECCIONAR DESDE TABLA//////////////////////
          //Clientes - Seleccionar cliente y mostrar en formulario
          myFeatureTable.on("row-select", function(evt){
            myFeatureTable.featureLayer.fields.forEach(field => {
              var data = evt.rows[0].data
              for(let i = 1; i < Object.keys(data).length; i++){
                if(Object.keys(data)[i].endsWith("ID_Cliente")){
                  id_cliente= Object.values(data)[i]
                  console.log("CLIENTE2",id_cliente)
                  
                  var query1 = new Query();
                  query1.where = "ID_Cliente = "+ id_cliente;
                  query1.returnGeometry = false;
                  query1.outFields =["OBJECTID","ID_Cliente"];

                  queryTask.execute(query1, lang.hitch(this, function(results){
                    objectid = results.features[0].attributes.OBJECTID
                    console.log("OBJ",objectid)
                  }));
                }else if(Object.keys(data)[i].endsWith(field.name)){
                  document.getElementById(`Clientes_${field.name}`).value = Object.values(data)[i]
                  console.log("data[]",Object.values(data)[i])
                }
              }
            });
          });
          
          ////////////////////////ELIMINAR///////////////////////
          //Cliente - Elimminar cliente existente
          let buttonDeleteCliente = document.getElementById("deleteCustomerButton");
          buttonDeleteCliente.addEventListener("click", (evt) => {

            let deletesCliente = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_clientes");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){return}
                deletesCliente.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            deletesCliente.attributes["OBJECTID"] = objectid;

            myFeatureTable.featureLayer.applyEdits(null, null, [deletesCliente], function(addResults, updateResults, deleteResults) {
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
  
require([
    "esri/layers/FeatureLayer",
    "esri/dijit/FeatureTable",
    "dojo/parser",
    "dojo/ready",
    "dojo/on",
    "esri/dijit/AttributeInspector",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer"
  ], function (
    FeatureLayer, FeatureTable, parser, ready, on, AttributeInspector, ContentPane, BorderContainer
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

        let myFeatureLayer1 = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/1",{
          mode: FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"],
          visible: true,
          id: "fLayer1"
        });

        let myFeatureLayer2 = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/2",{
          mode: FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"],
          visible: true,
          id: "fLayer2"
        });

        let myFeatureLayer3 = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/3",{
          mode: FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"],
          visible: true,
          id: "fLayer3"
        });

        let myFeatureLayer4 = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/4",{
          mode: FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"],
          visible: true,
          id: "fLayer4"
        });

        ///////////////Servicios de FeatureTable para cada Feature Layer/////////////
        let myFeatureTable = new FeatureTable({
          featureLayer : myFeatureLayer,
          showRelatedRecords: true,
          outFields: ["*"],
          editable: true
        }, 'myTableNode');
        myFeatureTable.startup();

        let myFeatureTable1 = new FeatureTable({
          featureLayer : myFeatureLayer1,
          showRelatedRecords: true,
          outFields: ["*"],
          editable: true
        }, 'myTableNode1');
        myFeatureTable1.startup();

        let myFeatureTable2 = new FeatureTable({
          featureLayer : myFeatureLayer2,
          showRelatedRecords: true,
          outFields: ["*"],
          editable: true
        }, 'myTableNode2');
        myFeatureTable2.startup();

        let myFeatureTable3 = new FeatureTable({
          featureLayer : myFeatureLayer3,
          showRelatedRecords: true,
          outFields: ["*"],
          editable: true
        }, 'myTableNode3');
        myFeatureTable3.startup();

        let myFeatureTable4 = new FeatureTable({
          featureLayer : myFeatureLayer4,
          showRelatedRecords: true,
          outFields: ["*"],
          editable: true
        }, 'myTableNode4');
        myFeatureTable4.startup();


        myFeatureTable.on("load", function(evt){
          let buttonTable= document.getElementById("selectTable")
          
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
            for(let i = 1; i < inputs.length; i++){
              console.log("inputsLength",inputs.length)
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                  // alert("Es necesario que rellenes todos los campos");
                  return;
                }
                addsClientes.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            myFeatureTable.featureLayer.applyEdits([addsClientes], null, null);
            myFeatureTable.refresh();
          });

          //Despliegues - Dar de alta nuevo Despliegues 
          let buttonDespliegues = document.getElementById("addDeploymentButton");
          buttonDespliegues.addEventListener("click", (evt) => {

            let addsDespliegues = {
              attributes: {
              }
            };
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_despliegues");
            for(let i = 1; i < inputs.length; i++){
              console.log("inputsLength",inputs.length)
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                  // alert("Es necesario que rellenes todos los campos");
                  return;
                }
                addsDespliegues.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            myFeatureTable1.featureLayer.applyEdits([addsDespliegues], null, null);
            myFeatureTable1.refresh();
          });

          //Recursos - Dar de alta nuevo Recursos 
          let buttonRecursos = document.getElementById("addResourcesButton");
          buttonRecursos.addEventListener("click", (evt) => {

            let addsRecursos = {
              attributes: {
              }
            };
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_recursos");
            for(let i = 1; i < inputs.length; i++){
              console.log("inputsLength",inputs.length)
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                  // alert("Es necesario que rellenes todos los campos");
                  return;
                }
                addsRecursos.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            myFeatureTable2.featureLayer.applyEdits([addsRecursos], null, null);
            myFeatureTable2.refresh();
          });

          //Soluciones - Dar de alta nuevo Soluciones 
          let buttonSoluciones = document.getElementById("addSolutionButton");
          buttonSoluciones.addEventListener("click", (evt) => {

            let addsSoluciones = {
              attributes: {
              }
            };
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_soluciones");
            for(let i = 1; i < inputs.length; i++){
              console.log("inputsLength",inputs.length)
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                  // alert("Es necesario que rellenes todos los campos");
                  return;
                }
                addsSoluciones.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            myFeatureTable3.featureLayer.applyEdits([addsSoluciones], null, null);
            myFeatureTable3.refresh();
          });

          //Webmaps - Dar de alta nuevo Webmaps 
          let buttonWebmaps = document.getElementById("addWebmapsButton");
          buttonWebmaps.addEventListener("click", (evt) => {

            let addsWebmaps = {
              attributes: {
              }
            };
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field_webmaps");
            for(let i = 1; i < inputs.length; i++){
              console.log("inputsLength",inputs.length)
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                  // alert("Es necesario que rellenes todos los campos");
                  return;
                }
                addsWebmaps.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            myFeatureTable4.featureLayer.applyEdits([addsWebmaps], null, null);
            myFeatureTable4.refresh();
          });


          
          
          //Seleccionar el formulario-tabla y actualizar servicio de FeatureLayer
          buttonTable.addEventListener("click", (evt) => {
            var tableOption = document.getElementById('formSelect').value;
            console.log("opt", tableOption)
            if(tableOption == 0){
              myFeatureTable.featureLayer= myFeatureLayer;
              myFeatureTable.startup();
            }
            if(tableOption == 1){
              myFeatureTable.featureLayer= myFeatureLayer1;
              myFeatureTable.startup();
            }
            if(tableOption == 2){
              myFeatureTable.featureLayer= myFeatureLayer2;
            }
            if(tableOption == 3){
              myFeatureTable.featureLayer= myFeatureLayer3;
            }
            if(tableOption == 4){
              myFeatureTable.featureLayer= myFeatureLayer4;
            }
          });

          //////////////////////////MODIFICAR///////////////////////////
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
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                updatesClientes.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable.featureLayer.applyEdits(null, [updatesClientes], null, function(addResults, updateResults, deleteResults) {
              console.log("Edición aplicada correctamente");
            }, function(error) {
              console.error("Error al aplicar la edición: ", error);
            });

            myFeatureTable.refresh();
          });

          //Despliegues - Modificar cliente existente
          let buttonUpdateDespliegues = document.getElementById("updateDeploymentButton");
          buttonUpdateDespliegues.addEventListener("click", (evt) => {

            let updatesDespliegues = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_despliegues");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                updatesDespliegues.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable1.featureLayer.applyEdits(null, [updatesDespliegues], null, function(addResults, updateResults, deleteResults) {
              console.log("Edición aplicada correctamente");
            }, function(error) {
              console.error("Error al aplicar la edición: ", error);
            });

            myFeatureTable1.refresh();
          });

          //Recursos - Modificar cliente existente
          let buttonUpdateRecursos = document.getElementById("updateResourcesButton");
          buttonUpdateRecursos.addEventListener("click", (evt) => {

            let updatesRecursos = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_recursos");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                updatesRecursos.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable2.featureLayer.applyEdits(null, [updatesRecursos], null, function(addResults, updateResults, deleteResults) {
              console.log("Edición aplicada correctamente");
            }, function(error) {
              console.error("Error al aplicar la edición: ", error);
            });

            myFeatureTable2.refresh();
          });

          //Soluciones - Modificar cliente existente
          let buttonUpdateSoluciones = document.getElementById("updateSolutionButton");
          buttonUpdateSoluciones.addEventListener("click", (evt) => {

            let updatesSoluciones = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_soluciones");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                updatesSoluciones.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable3.featureLayer.applyEdits(null, [updatesSoluciones], null, function(addResults, updateResults, deleteResults) {
              console.log("Edición aplicada correctamente");
            }, function(error) {
              console.error("Error al aplicar la edición: ", error);
            });

            myFeatureTable3.refresh();
          });

          //Webmaps - Modificar cliente existente
          let buttonUpdateWebmaps = document.getElementById("updateWebmapsButton");
          buttonUpdateWebmaps.addEventListener("click", (evt) => {

            let updatesWebmaps = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_webmaps");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                updatesWebmaps.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable4.featureLayer.applyEdits(null, [updatesWebmaps], null, function(addResults, updateResults, deleteResults) {
              console.log("Edición aplicada correctamente");
            }, function(error) {
              console.error("Error al aplicar la edición: ", error);
            });

            myFeatureTable4.refresh();
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
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                deletesCliente.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable.featureLayer.applyEdits(null, null, [deletesCliente], function(addResults, updateResults, deleteResults) {
              console.log("Cliente eliminado correctamente");
            }, function(error) {
              console.error("Error al eliminar cliente: ", error);
            });

            myFeatureTable.refresh();
          });

          //Despliegues - Elimminar cliente existente
          let buttonDeleteDespliegues = document.getElementById("deleteDeploymentButton");
          buttonDeleteDespliegues.addEventListener("click", (evt) => {

            let deletesDespliegues = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_despliegues");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                deletesDespliegues.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable1.featureLayer.applyEdits(null, null, [deletesDespliegues], function(addResults, updateResults, deleteResults) {
              console.log("Cliente eliminado correctamente");
            }, function(error) {
              console.error("Error al eliminar cliente: ", error);
            });

            myFeatureTable1.refresh();
          });

          //Recursos - Elimminar cliente existente
          let buttonDeleteRecursos = document.getElementById("deleteResourcesButton");
          buttonDeleteRecursos.addEventListener("click", (evt) => {

            let deletesRecursos = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_recursos");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                deletesRecursos.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable2.featureLayer.applyEdits(null, null, [deletesRecursos], function(addResults, updateResults, deleteResults) {
              console.log("Cliente eliminado correctamente");
            }, function(error) {
              console.error("Error al eliminar cliente: ", error);
            });

            myFeatureTable2.refresh();
          });

          //Soluciones - Elimminar cliente existente
          let buttonDeleteSoluciones = document.getElementById("deleteSolutionButton");
          buttonDeleteSoluciones.addEventListener("click", (evt) => {

            let deletesSoluciones = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_soluciones");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                deletesSoluciones.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable3.featureLayer.applyEdits(null, null, [deletesSoluciones], function(addResults, updateResults, deleteResults) {
              console.log("Cliente eliminado correctamente");
            }, function(error) {
              console.error("Error al eliminar cliente: ", error);
            });

            myFeatureTable3.refresh();
          });

          //Webmaps - Elimminar cliente existente
          let buttonDeleteWebmaps = document.getElementById("deleteWebmapsButton");
          buttonDeleteWebmaps.addEventListener("click", (evt) => {

            let deletesWebmaps = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field_webmaps");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                deletesWebmaps.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable4.featureLayer.applyEdits(null, null, [deletesWebmaps], function(addResults, updateResults, deleteResults) {
              console.log("Cliente eliminado correctamente");
            }, function(error) {
              console.error("Error al eliminar cliente: ", error);
            });

            myFeatureTable4.refresh();
          });

          /////////////////////////REFRESH TABLE////////////////////
          //Clientes - Refresh table button
          let buttonRefreshClientes = document.getElementById("refreshTableCustomerButton");
          buttonRefreshClientes.addEventListener("click", (evt) => {
            myFeatureTable.refresh();
          });

          //Despliegues - Refresh table button
          let buttonRefreshDespliegues = document.getElementById("refreshTableDeploymentButton");
          buttonRefreshDespliegues.addEventListener("click", (evt) => {
            myFeatureTable1.refresh();
          });

          //Recursos - Refresh table button
          let buttonRefreshRecursos = document.getElementById("refreshTableResourcesButton");
          buttonRefreshRecursos.addEventListener("click", (evt) => {
            myFeatureTable2.refresh();
          });

          //Soluciones - Refresh table button
          let buttonRefreshSoluciones = document.getElementById("refreshTableSolutionButton");
          buttonRefreshSoluciones.addEventListener("click", (evt) => {
            myFeatureTable3.refresh();
          });

          //Webmaps - Refresh table button
          let buttonRefreshWebmaps = document.getElementById("refreshTableWebmapsButton");
          buttonRefreshWebmaps.addEventListener("click", (evt) => {
            myFeatureTable4.refresh();
          });

          ///////////////////////LIMPIAR CAMPOS//////////////////////////
          //Clientes - Limpiar Campos del Formulario
          let buttonClearClientes = document.getElementById("clearFormCustomerButton");
          buttonClearClientes.addEventListener("click", (evt) => {
            myFeatureTable.featureLayer.fields.forEach(field => {
              document.getElementById(field.name).value = ''
            });
          });

          //Despliegues - Limpiar Campos del Formulario
          let buttonClearDespliegues = document.getElementById("clearFormDeploymentButton");
          buttonClearDespliegues.addEventListener("click", (evt) => {
            myFeatureTable1.featureLayer.fields.forEach(field => {
              document.getElementById(field.name).value = ''
            });
          });

          //Recursos - Limpiar Campos del Formulario
          let buttonClearRecursos = document.getElementById("clearFormResourcesButton");
          buttonClearRecursos.addEventListener("click", (evt) => {
            myFeatureTable2.featureLayer.fields.forEach(field => {
              document.getElementById(field.name).value = ''
            });
          });

          //Soluciones - Limpiar Campos del Formulario
          let buttonClearSoluciones = document.getElementById("clearFormSolutionButton");
          buttonClearSoluciones.addEventListener("click", (evt) => {
            myFeatureTable3.featureLayer.fields.forEach(field => {
              document.getElementById(field.name).value = ''
            });
          });

          //Webmaps - Limpiar Campos del Formulario
          let buttonClearWebmaps = document.getElementById("clearFormWebmapsButton");
          buttonClearWebmaps.addEventListener("click", (evt) => {
            myFeatureTable4.featureLayer.fields.forEach(field => {
              document.getElementById(field.name).value = ''
            });
          });

        });

        //////////////////////SELECCIONAR DESDE TABLA//////////////////////
        //Clientes - Seleccionar cliente y mostrar en formulario
        myFeatureTable.on("row-select", function(evt){
          myFeatureTable.featureLayer.fields.forEach(field => {
            var data = evt.rows[0].data
            for(let i = 0; i < Object.keys(data).length; i++){
              if(Object.keys(data)[i] == field.name ){
                document.getElementById(field.name).value = Object.values(data)[i]
              }
            }
          });
        }); 

        //Despliegues - Seleccionar cliente y mostrar en formulario
        myFeatureTable1.on("row-select", function(evt){
          myFeatureTable1.featureLayer.fields.forEach(field => {
            var data = evt.rows[0].data
            for(let i = 0; i < Object.keys(data).length; i++){
              if(Object.keys(data)[i] == field.name ){
                document.getElementById(field.name).value = Object.values(data)[i]
              }
            }
          });
        }); 

        //Recursos - Seleccionar cliente y mostrar en formulario
        myFeatureTable2.on("row-select", function(evt){
          myFeatureTable2.featureLayer.fields.forEach(field => {
            var data = evt.rows[0].data
            for(let i = 0; i < Object.keys(data).length; i++){
              if(Object.keys(data)[i] == field.name ){
                document.getElementById(field.name).value = Object.values(data)[i]
              }
            }
          });
        }); 

        //Soluciones - Seleccionar cliente y mostrar en formulario
        myFeatureTable3.on("row-select", function(evt){
          myFeatureTable3.featureLayer.fields.forEach(field => {
            var data = evt.rows[0].data
            for(let i = 0; i < Object.keys(data).length; i++){
              if(Object.keys(data)[i] == field.name ){
                document.getElementById(field.name).value = Object.values(data)[i]
              }
            }
          });
        }); 

        //Webmaps - Seleccionar cliente y mostrar en formulario
        myFeatureTable4.on("row-select", function(evt){
          myFeatureTable4.featureLayer.fields.forEach(field => {
            var data = evt.rows[0].data
            for(let i = 0; i < Object.keys(data).length; i++){
              if(Object.keys(data)[i] == field.name ){
                document.getElementById(field.name).value = Object.values(data)[i]
              }
            }
          });
        }); 
        
        ////////////////////MOSTRAR RELACIONES//////////////////////
        //Clientes
        myFeatureTable.on("show-related-records", function(evt){
          console.log("show-related-records event - ", evt);
        });

        //Despliegues
        myFeatureTable1.on("show-related-records", function(evt){
          console.log("show-related-records event - ", evt);
        });

        //Recursos
        myFeatureTable2.on("show-related-records", function(evt){
          console.log("show-related-records event - ", evt);
        });

        //Soluciones
        myFeatureTable3.on("show-related-records", function(evt){
          console.log("show-related-records event - ", evt);
        });

        //Webmaps
        myFeatureTable4.on("show-related-records", function(evt){
          console.log("show-related-records event - ", evt);
        });
      }
    });
  });
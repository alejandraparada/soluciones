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
        let myFeatureLayer = new FeatureLayer("https://services-eu1.arcgis.com/igW51C2bOj7D9cJ2/arcgis/rest/services/AuthenticatorModel/FeatureServer/0",{
          mode: FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"],
          visible: true,
          id: "fLayer"
        });

        let myFeatureTable = new FeatureTable({
          featureLayer : myFeatureLayer,
          showRelatedRecords: true,
          outFields: ["*"],
          editable: true
        }, 'myTableNode');
        myFeatureTable.startup();

        myFeatureTable.on("load", function(evt){
          //Dar de alta nuevo cliente - añadir cliente
          let button = document.getElementById("addCustomerButton");
          button.addEventListener("click", (evt) => {

            let adds = {
              attributes: {
              }
            };
            //Obtener Elementos input del formulario por el nombre de la clase  
            let inputs = document.getElementsByClassName("form_field");
            for(let i = 0; i < inputs.length; i++){
              console.log("inputsLength",inputs.length)
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                  alert("Es necesario que rellenes todos los campos");
                  return;
                }
                adds.attributes[inputs[i].alt] = inputs[i].value;
              }
            }
            myFeatureTable.featureLayer.applyEdits([adds], null, null);
            myFeatureTable.refresh();
          });

          //Crear campos segun FeatureTable 
          myFeatureTable.featureLayer.fields.forEach(field => {

            var input = document.createElement("input");
            input.setAttribute("class", "form_field");
            input.setAttribute("id", field.name);
            input.setAttribute("placeholder", field.name);
            input.setAttribute("alt", field.name);
            if(field.name.toUpperCase() == "OBJECTID"){
              input.setAttribute("disabled", true);
              input.setAttribute("readonly", true)
            }
            if(field.name.includes("Password")){
              input.setAttribute("type", "password");
            }
            else{
              input.setAttribute("type", "text");
            }
            //Valores por defecto
            if(field.name.includes("Nombre")){
              input.setAttribute("value", `Carla`);
            }
            if(field.name.includes("URL")){
              input.setAttribute("value", `https://carla`);
            }
            if(field.name.includes("Usuario")){
              input.setAttribute("value", `caparada`);
            }
            if(field.name.includes("Password")){
              input.setAttribute("value", `carlapa123`);
            }
            if(field.name.includes("Codigo")){
              input.setAttribute("value", `28805`);
            }
            if(field.name.includes("Provincia")){
              input.setAttribute("value", `Madrid`);
            }
            button.parentNode.insertBefore(input, button);
            
          });

          //Modificar cliente existente
          let buttonUpdate = document.getElementById("updateCustomerButton");
          buttonUpdate.addEventListener("click", (evt) => {

            let updates = {
              attributes: {},
              geometry: null
            };
              
            let inputs = document.getElementsByClassName("form_field");
            for(let i = 0; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                updates.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable.featureLayer.applyEdits(null, [updates], null, function(addResults, updateResults, deleteResults) {
              console.log("Edición aplicada correctamente");
            }, function(error) {
              console.error("Error al aplicar la edición: ", error);
            });

            // myFeatureLayer.applyEdits(null,[updates], null);
            myFeatureTable.refresh();
          });

        });
        
        //Seleccionar cliente y mostrar en formulario
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
        
        myFeatureTable.on("show-related-records", function(evt){
          console.log("show-related-records event - ", evt);
        });
      }
    });
  });
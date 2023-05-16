require([
    "esri/layers/FeatureLayer",
    "esri/dijit/FeatureTable",
    "dojo/parser",
    "dojo/ready",
    "dojo/on",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer"
  ], function (
    FeatureLayer, FeatureTable, parser, ready, on, ContentPane, BorderContainer
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
          
          let button = document.getElementById("addCustomerButton");
          button.addEventListener("click", (evt) => {

            let adds = {
              attributes: {
              }
            };
              
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

          let buttonUpdate = document.getElementById("updateCustomerButton");
          buttonUpdate.addEventListener("click", (evt) => {

            let updates = {
              attributes: {
              }
            };
              
            let inputs = document.getElementsByClassName("form_field");
            for(let i = 1; i < inputs.length; i++){
              if(inputs[i].type != "submit"){
                if(inputs[i].value == null || inputs[i].value === ""){
                    alert("Es necesario que rellenes todos los campos");
                    return;
                }
                updates.attributes[inputs[i].alt] = inputs[i].value;
              }
            }

            myFeatureTable.featureLayer.applyEdits(null,[updates], null);
            myFeatureTable.refresh();
          }); 
          
          myFeatureTable.featureLayer.fields.forEach(field => {
            if(field.name.toUpperCase() != "OBJECTID")
            {
              var input = document.createElement("input");
              input.setAttribute("class", "form_field");
              input.setAttribute("id", field.name);
              input.setAttribute("placeholder", field.name);
              input.setAttribute("alt", field.name);
              if(field.name.includes("Password")){
                input.setAttribute("type", "password");
              }
              else{
                input.setAttribute("type", "text");
              }
              // if(field.name.includes("Nombre")){
              //   input.setAttribute("value", `Carla`);
              // }
              // if(field.name.includes("URL")){
              //   input.setAttribute("value", `https://carla`);
              // }
              // if(field.name.includes("Usuario")){
              //   input.setAttribute("value", `caparada`);
              // }
              // if(field.name.includes("Password")){
              //   input.setAttribute("value", `carlapa123`);
              // }
              // if(field.name.includes("Codigo")){
              //   input.setAttribute("value", `28805`);
              // }
              // if(field.name.includes("Provincia")){
              //   input.setAttribute("value", `Madrid`);
              // }
              button.parentNode.insertBefore(input, button);
            }
          });
        });

        myFeatureTable.on("row-select", function(evt){
          console.log("select", evt);
          myFeatureTable.featureLayer.fields.forEach(field => {
            console.log("a",evt.rows[0].data)
            var data = evt.rows[0].data
            // for (opt in data){
              // console.log("dataopt",data[opt])
              var formField = document.getElementById(field.name)
              console.log(field.name,formField)
              for(let i = 1; i < Object.keys(data).length; i++){
                console.log("l",Object.keys(data)[i])
                if(Object.keys(data)[i] == field.name ){
                  console.log("valor",Object.keys(data)[i])
                  console.log("valor2",data[i])
                  // document.getElementById(field.name).value = data[i]
                }
                // if(formField.namedItem == field.name){
                //   console.log("name2",document.getElementsByClassName("form_field").field.name)
                // }
                // document.getElementsByClassName("form_field")[i].value = data[opt]
              }
            // }
          });
        }); 
        
        myFeatureTable.on("show-related-records", function(evt){
          console.log("show-related-records event - ", evt);
        });
      }
    });
  });
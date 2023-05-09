require([

    "esri/layers/FeatureLayer",
    "esri/dijit/FeatureTable",
    "dojo/parser",
    "dojo/ready",
    "dojo/on",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer"
], function (
    FeatureLayer, 
    FeatureTable, 
    parser, 
    ready, 
    on, 
    ContentPane, 
    BorderContainer
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
                    
                    let inputs = document.getElementById("form").children;
                    for(let i = 0; i < inputs.length; i++){
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

                myFeatureTable.featureLayer.fields.forEach(field => {
                    if(field.name.toUpperCase() != "OBJECTID")
                    {
                        var input = document.createElement("input");
                        input.setAttribute("placeholder", field.name);
                        input.setAttribute("alt", field.name);
                        if(field.name.includes("password")){
                            input.setAttribute("type", "password");
                        }
                        else{
                            input.setAttribute("type", "text");
                        }
                        button.parentNode.insertBefore(input, button);
                    }
                });
        });

        myFeatureTable.on("row-select", function(evt){
            console.log("select", evt);
        }); 
        myFeatureTable.on("show-related-records", function(evt){
            console.log("show-related-records event - ", evt);
        });
        }
    });
});
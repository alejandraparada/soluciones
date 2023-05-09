var map;

require([
    "esri/layers/FeatureLayer",
    "esri/dijit/FeatureTable",
    "dojo/dom",
    "dojo/parser",
    "dojo/ready",
], function (
    FeatureLayer, 
    FeatureTable,
    dom, 
    parser, 
    ready
){
    parser.parse();

    ready(function(){

    // Create the feature layer
    var myTablesHosted = new FeatureLayer("https://services2.arcgis.com/Y3Iui8MAIpW4vkQ0/arcgis/rest/services/Map_Test_Tables/FeatureServer/2", {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields:  ["*"],
        editable: true,
        visible: true,
        // id: "fLayer"
    });

    myTable = new FeatureTable({
        featureLayer : myTablesHosted,
        showGridMenu: false,
        editable: true,
        // hiddenFields: ["FID","C_Seq","Street"]  // field that end-user can show, but is hidden on startup
    }, "myTableNode");

    myTable.startup();
    });
});
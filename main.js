var eg_pc = null;
var eg_loadings = null;
var eg_data = null;




function loadXML() 
{
	eg_pc = new EditableGrid("pc", {
		
		// called when the XML has been fully loaded 
		tableLoaded: function() {

			// render the grid
			this.renderGrid("tablecontent_pc", "table table-hover"); 
		},
		
		// called when some value has been modified: we try to paste multiple values
		//modelChanged: function(rowIdx, colIdx, oldValue, newValue, row) {tryPaste(this,newValue,rowIdx,colIdx);}
	});

	// load XML file
	eg_pc.loadXML("grid_pc.xml");
	
	eg_loadings = new EditableGrid("loadings", {
		
		// called when the XML has been fully loaded 
		tableLoaded: function() {

			// render the grid
			this.renderGrid("tablecontent_loadings", "table table-hover"); 
		},
		
		// called when some value has been modified: we try to paste multiple values
		//modelChanged: function(rowIdx, colIdx, oldValue, newValue, row) {tryPaste(this,newValue,rowIdx,colIdx);}
	});
        
	eg_scenarios = new EditableGrid("scenarios", {
		
		// called when the XML has been fully loaded 
		tableLoaded: function() {

			// render the grid
			this.renderGrid("tablecontent_scenarios", "table table-hover"); 
		},
		
		// called when some value has been modified: we try to paste multiple values
		//modelChanged: function(rowIdx, colIdx, oldValue, newValue, row) {tryPaste(this,newValue,rowIdx,colIdx);}
	});
        	
	
	eg_data = new EditableGrid("data", {
		
		// called when the XML has been fully loaded 
		tableLoaded: function() { 
		
			// render the grid
			this.renderGrid("tablecontent_data", "table table-hover"); 
		        load_random(50);
		        calculate();
		},
		
		// called when some value has been modified: we try to paste multiple values
		//modelChanged: function(rowIdx, colIdx, oldValue, newValue, row) {tryPaste(this,newValue,rowIdx,colIdx);}
	});

	// load XML file
	eg_data.loadXML("grid_data.xml"); 
	

}       

// start when window is loaded
window.onload = loadXML;

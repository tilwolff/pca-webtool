var eg_pc = null;
var eg_loadings = null;
var eg_data = null;




function loadXML() 
{
	eg_pc = new EditableGrid("pc", {
		
		// called when the XML has been fully loaded 
		tableLoaded: function() {

			// render the grid
			this.renderGrid("tablecontent_pc", "grid"); 
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
			this.renderGrid("tablecontent_loadings", "grid"); 
		},
		
		// called when some value has been modified: we try to paste multiple values
		//modelChanged: function(rowIdx, colIdx, oldValue, newValue, row) {tryPaste(this,newValue,rowIdx,colIdx);}
	});

	// load XML file
	eg_loadings.loadXML("grid_loadings.xml");
	
	
	eg_data = new EditableGrid("data", {
		
		// called when the XML has been fully loaded 
		tableLoaded: function() { 
		
			// render the grid
			this.renderGrid("tablecontent_data", "grid"); 
		},
		
		// called when some value has been modified: we try to paste multiple values
		//modelChanged: function(rowIdx, colIdx, oldValue, newValue, row) {tryPaste(this,newValue,rowIdx,colIdx);}
	});

	// load XML file
	eg_data.loadXML("grid_data.xml"); 
	

}       

// start when window is loaded
window.onload = loadXML;


//need global object of scenarios for export functionality
var g_scenarios=null;

function import_data(fil){

        var callb=function(results,file){
                if(results.data[0][0]!='ID') return null;
                
                var i,j,data;
                var metadata=[ {name:'id', label:'ID', datatype:'string', editable:'false'} ];
        
                for (j=1;j<results.data[0].length;j++){
                        tmp={name:results.data[0][j], label:results.data[0][j], datatype:'double(%,4)', editable:'true'}
                        metadata.push(tmp);
                }
                
                var n=metadata.length;
                results.data.shift();
                data=[];
                var valid=true;
                while (results.data.length>0){
                        valid=true;
                        if (n!=results.data[0].length) valid=false;
                        for (j=1;j<n;j++){
                                if (typeof(results.data[0][j]) != "number") valid=false;
                        }
                        if (valid){
                                data.push({values: results.data.shift()});
                        }else{
                                results.data.shift();
                        }
                }
                eg_data.load({data: data,metadata:metadata});
                eg_data.renderGrid("tablecontent_data", "table table-hover");
        }

        var pp_config={
	        header: false,
        	dynamicTyping: true,
	        worker: false,
	        complete: callb
        };

        var fs;
        if("string"==typeof(fil)){
                pp_config.download=true;
                Papa.parse(fil,pp_config);
        }else if(fil.name){
	        pp_config.download=false,
                Papa.parse(fil,pp_config)
        }
}

function import_file(){
        var fs = document.createElement('input');
        fs.setAttribute('type', 'file');
        fs.addEventListener('change', function(evt){import_data(evt.target.files[0]);}, false);
        fs.click();
}

function load_random(num_rows){

        //metadata
        var i,j,tmp,cmp,tmp_old;
        var metadata=[ {name:'id', label:'ID', datatype:'string', editable:'false'} ];
        
        for (i=1;i<=10;i++){
                tmp={name:''+i+'Y', label:''+i+'Y', datatype:'double(%,4)', editable:'true'}
                metadata.push(tmp);
        }        

        //data

        var first_comp=[1,1,1,1,1,1,1,1,1,1];
        var second_comp=[-0.9,-0.7,-0.5,-0.3,-0.1,0.1,0.3,0.5,0.7,0.9];
        var third_comp=[-0.4,-0.2,0.0,0.2,0.4,0.4,0.2,0.0,-0.2,-0.4];
        var noise=[];
        var data=[];
        tmp_old=[0,0,0,0,0,0,0,0,0,0];
        for (i=0;i<num_rows;i++){
                //create random first component
                cmp=numeric.mul((Math.random()-0.5)*0.4,first_comp);
                tmp=numeric.add(tmp_old,cmp);
                //add random second component
                cmp=numeric.mul((Math.random()-0.5)*0.3,second_comp);
                tmp=numeric.add(tmp,cmp);
                //add random third component
                cmp=numeric.mul((Math.random()-0.5)*0.2,third_comp);
                tmp=numeric.add(tmp,cmp);
                //add some minor random noise
                for (j=0;j<10;j++) noise.push((Math.random()-0.5)*0.01);
                tmp=numeric.add(tmp,noise);
                tmp_old=tmp.slice();
                tmp.unshift('Day '+i);
                data.push({values:tmp});
        }       
        
        eg_data.load({data: data,metadata:metadata});
        eg_data.renderGrid("tablecontent_data", "table table-hover");
}


function calculate() {

        var idata=get_input_data();
        var results=perform_pca(idata);
        display_results(results);
}

function get_input_data(){
        var i,j,row,row_diff,tmp;
        var result={};
        result.values=[];
        result.differences=[];
        result.times=[];
        result.headers=[];
        
        var num_rows=eg_data.getRowCount();
        if (num_rows>5000) {

                if (confirm('Your data contains more than 5000 rows, which may take a long time to calculate and may even make the calculation fail. Press OK to limit time series to 5000 observations, or press Cancel to continue.')) {
                        num_rows=5000;
                        
                }
        }
                
        for (i=0;i<num_rows;i++){
                row=[]; row_diff=[];
                for (j=1;j<eg_data.getColumnCount();j++){
                        if(0==i) result.headers.push(eg_data.getColumnName(j));
                        row.push(eg_data.getValueAt(i,j));
                        if(0<i) row_diff.push(eg_data.getValueAt(i,j)-eg_data.getValueAt(i-1,j));
                }
                result.times.push(eg_data.getValueAt(i,0));
                result.values.push(row);
                if (0<i) result.differences.push(row_diff);
        }
        return result;
}

//
// Displays first 10 principal components
// Displays the interest rate scenarios and makes them available for download
//
function display_results(val){

        var i,data,metadata,tmp;
        var n=val.component_vectors[0].length;
        if (n>10) n=10;
        
        //principal components
        data=[];
        for (i=0;i<val.component_vectors.length;i++){
                tmp=val.component_vectors[i].slice(0,n);
                tmp.unshift(val.times[i]);
                data.push({values: tmp});
        }
        eg_pc.load({data: data});
        eg_pc.renderGrid("tablecontent_pc", "table table-hover");
        
        //loadings
        metadata=[ {name:'desc', label:'Description', datatype:'string', editable:'false'},
                   {name:'expl', label:'Expl. Power', datatype:'double(%,2)', editable:'false'} ];
        
        for (i=0;i<val.headers.length;i++){
                tmp={name:val.headers[i], label:val.headers[i], datatype:'double(%,4)', editable:'true'}
                metadata.push(tmp);
        }
        data=[];
        for (i=0;i<n;i++){
                tmp=val.loadings[i].slice();
                tmp.unshift(val.rel_variances[i]*100);
                tmp.unshift("Comp " + (i+1));
                data.push({values: tmp});
        } 
        eg_loadings.load({data: data, metadata:metadata});
        eg_loadings.renderGrid("tablecontent_loadings", "table table-hover");
        
        //scenarios
        //data for editable grid
        metadata=[ {name:'desc', label:'Description', datatype:'string', editable:'false'} ];
        
        //data for papa parse (export functionality)
        fields=[ "Description" ];
        var export_data=[];
        
        for (i=0;i<val.headers.length;i++){
                tmp={name:val.headers[i], label:val.headers[i], datatype:'double(%,4)', editable:'true'}
                metadata.push(tmp);
                fields.push(val.headers[i]);
        }
        data=[];

        var lab;
        for (i=0;i<val.scenarios.length;i++){
                tmp=val.scenarios[i].slice();
                lab=((i % 2) != 0) ?  "Comp " + ((i+1)/2) + " down" : "Comp " + (i/2+1) + " up"
                tmp.unshift(lab);
                data.push({values: tmp});
                export_data.push(tmp);
        } 
        eg_scenarios.load({data: data,metadata:metadata});
        eg_scenarios.renderGrid("tablecontent_scenarios", "table table-hover");

        // make data available for export function, Papa.unparse needs object with entries "data" and "fields"
        g_scenarios= {data: export_data,fields:fields};

        update_chart(val);
}

function export_scenarios(){
        if (null==g_scenarios){
                msgbox("nothing to export.");
                return null;
        }
        
        // config
        var conf={
                quotes: false,
                quoteChar: '"',
                delimiter: ";",
                header: true,
                newline: "\r\n"
        }
        
        var export_data=Papa.unparse(g_scenarios,conf);
        
        var export_data = 'data:text/csv;charset=utf-8,'+encodeURIComponent(export_data);
        var a = document.createElement('a');
        a.href = export_data;
        
        var today=new Date();
        a.download="pca_web_app_scen_"+today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+"_"+today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds()+"_"+today.getMilliseconds()+".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        return null;
}


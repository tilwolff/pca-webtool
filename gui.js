function import_data(fil){

        var callb=function(results,file){
                if(results.data[0][0]!='ID') return null;
                
                var i,j,data;
                var metadata=[ {name:'id', label:'ID', datatype:'string', editable:'false'} ];
        
                for (j=1;j<results.data[0].length;j++){
                        tmp={name:results.data[0][j], label:results.data[0][j], datatype:'double(%,4)', editable:'true'}
                        metadata.push(tmp);
                }
                
                results.data.shift();
                data=[];
                while (results.data.length>0) data.push({values: results.data.shift()})
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
                for (j=0;j<10;j++) noise.push((Math.random()-0.5)*0.1);
                cmp=numeric.mul((Math.random()-0.5)*0.4,first_comp);
                tmp=numeric.add(tmp_old,cmp);
                cmp=numeric.mul((Math.random()-0.5)*0.3,second_comp);
                tmp=numeric.add(tmp,cmp);
                cmp=numeric.mul((Math.random()-0.5)*0.2,third_comp);
                tmp=numeric.add(tmp,cmp);
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
        // if (num_rows>200) num_rows=200; // limit data for testing
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

function display_results(val){

        var i,data,metadata,tmp;
        
        //principal components
        data=[];
        for (i=0;i<val.component_vectors.length;i++){
                tmp=val.component_vectors[i].slice(0,10);
                tmp.unshift(val.times[i]);
                data.push({values: tmp});
        }
        eg_pc.load({data: data});
        eg_pc.renderGrid("tablecontent_pc", "table table-hover");
        
        //loadings
        metadata=[ {name:'expl', label:'Expl. Power', datatype:'double(%,2)', editable:'false'} ];
        
        for (i=0;i<val.headers.length;i++){
                tmp={name:val.headers[i], label:val.headers[i], datatype:'double(%,4)', editable:'true'}
                metadata.push(tmp);
        }
        data=[];
        for (i=0;i<10;i++){
                tmp=val.loadings[i].slice();
                tmp.unshift(val.rel_variances[i]*100);
                data.push({values: tmp});
        } 
        eg_loadings.load({data: data,metadata:metadata});
        eg_loadings.renderGrid("tablecontent_loadings", "table table-hover");


        update_chart(val);
}


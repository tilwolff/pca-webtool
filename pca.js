var perform_pca=function(val){
        var result=val;     

        // singular value decomposition
        // matrix M=USV*
        var s=numeric.svd(val.differences);
        var s_diag=numeric.diag(s.S);
        var V_transp=numeric.transpose(s.V);
        
        // loadings are given by  SV*...
        result.loadings=numeric.dot(s_diag,V_transp);        
        
        // variances are the squares of the diagonal of S...
        result.variances=numeric.mul(s.S,s.S);
        var var_total=numeric.sum(result.variances);
        result.rel_variances=numeric.div(result.variances,var_total);
        
        // and U gives you the uncorrelated principal component vectors...
        result.component_vectors=s.U;
        
        //make a maximum of six scenarios (first 3 components up and down)
        result.scenarios=[];
        var quant_up,quant_down,avg_comp,avg_load;
        var vec=new Array(result.component_vectors.length);
        for (j=0;j<3 && j<result.component_vectors[0].length;j++){
                for (i=0;i<vec.length;i++){
                        vec[i]=result.component_vectors[i][j];
                }
                avg_comp=numeric.sum(vec)/vec.length;
                avg_load=numeric.sum(result.loadings[j])/result.loadings[j].length;
                
                if(avg_load>0){
                        quant_up=quantile(vec,0.95)-avg_comp;
                        quant_down=quantile(vec,0.05)-avg_comp;
                }else{
                        quant_down=quantile(vec,0.95)-avg_comp;
                        quant_up=quantile(vec,0.05)-avg_comp;
                }        
                
                result.scenarios.push(numeric.mul(quant_up*Math.sqrt(252),result.loadings[j]));
                result.scenarios.push(numeric.mul(quant_down*Math.sqrt(252),result.loadings[j]));
        }
        return result;
}

//computes quantile. warning - sorts and thus changes input array!!!
var quantile=function(vec,q){
        vec.sort(function(a,b){return a>b;});
        if (q>1) q=1;
        if (q<0) q=0;
        var n=vec.length;
        var i=Math.floor((n - 1)*q);
        var delta=(n-1)*q - i;
        return (1 - delta)*vec[i] + delta*vec[i+1];
}



var perform_pca=function(val){
        var result=val;

        var val_val_t=numeric.dot(val.differences,numeric.transpose(val.differences));
        var eig=eigen_jk(val_val_t);
        var E_t=numeric.transpose(eig.E);
        
        var E_t_E=numeric.dot(E_t,eig.E);
        var E_t_E_inv=numeric.inv(E_t_E);
        var pseudoinverse=numeric.dot(E_t_E_inv,E_t);
        result.loadings=numeric.dot(pseudoinverse,val.differences);
        result.variances=eig.lambda;
        var_total=numeric.sum(eig.lambda);
        result.rel_variances=numeric.div(eig.lambda,var_total);
        result.component_vectors=eig.E;
        

        //make a maximum of six scenarios (first 3 components up and down)
        result.scenarios=[];
        var i,j,quant_up,quant_down,avg_comp,avg_load;
        var vec=new Array(result.component_vectors.length);
        for (j=0;j<3 && j<result.component_vectors[0].length;j++){
                for (i=0;i<vec.length;i++){
                        vec[i]=result.component_vectors[i][j];
                }
                avg_comp=mean(vec);
                avg_load=mean(result.loadings[j]);
                
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


var eigen_jk=function(A) {
        var i, j, k, iter, p;
        var den, hold=0, num;
        var Sin_,Cos_, Sin2, Cos2, Test;
        var Tan2, Cot2, tmp;
        const eps = 1E-16;
    
        p = A.length;
        var Ematrix=[];
        var lambda=new Array(p);

        for(iter=0; iter<p; iter++) {
                Ematrix[iter] = new Array(p);
        }
    
        for(iter=1; iter<=15;iter++){
                //Orthogonalize pairs of columns in upper off diag
                for(j = 0; j< p - 1;j++){
                        for(k = j;k<p;k++){

                                den = 0;
                                num = 0;
                                //Perform single plane rotation
                                for(i = 0;i<p;i++){
                                        num = num + 2 * A[i][j] * A[i][k]   //: numerator eq. 11
                                        den = den + (A[i][j] + A[i][k]) * (A[i][j] - A[i][k])             //: denominator eq. 11
                                }

                                //Skip rotation if aij is zero and correct ordering
                                if(Math.abs(num) < eps && den >= 0) break;

                                //Perform Rotation
                                if(Math.abs(num) <= Math.abs(den)){
                                        Tan2 = Math.abs(num) / Math.abs(den);          //: eq. 11
                                        Cos2 = 1 / Math.sqrt(1 + Tan2 * Tan2);     //: eq. 12
                                        Sin2 = Tan2 * Cos2;                  //: eq. 13
                                }else{
                                        Cot2 = Math.abs(den) / Math.abs(num);          //: eq. 16
                                        Sin2 = 1 / Math.sqrt(1 + Cot2 * Cot2);     //: eq. 17
                                        Cos2 = Cot2 * Sin2;                  //: eq. 18
                                }

                                Cos_ = Math.sqrt((1 + Cos2) / 2) ;             //: eq. 14/19
                                Sin_ = Sin2 / (2 * Cos_);                //: eq. 15/20

                                if(den < 0){
                                        tmp = Cos_;
                                        Cos_ = Sin_;                         //: table 21
                                        Sin_ = tmp;
                                }

                                Sin_ = Math.sign(num) * Sin_;                  //: sign table 21

                                //Rotate
                                for(i = 0;i<p;i++){
                                        tmp = A[i][j];
                                        A[i][j] = tmp * Cos_ + A[i][k] * Sin_;
                                        A[i][k] = -tmp * Sin_ + A[i][k] * Cos_;
                                }
                        }
                }

                //Test for convergence
                Test = numeric.norm2Squared(A);
                if(Math.abs(Test - hold) < eps && iter > 5) break;
                hold = Test;
        }

        if(16==iter) alert("JK Iteration has not converged.");

        //Compute eigenvalues/eigenvectors
        for(j = 0; j<p;j++){
                //Compute eigenvalues
                lambda[j]=0;
                for(k = 0;k<p;k++){
                        lambda[j] = lambda[j]+ A[k][j] * A[k][j];
                }
                lambda[j] = Math.sqrt(lambda[j]);

                //Normalize eigenvectors
                for(i = 0;i<p;i++){
                        if(lambda[j] <= 0){
                                Ematrix[i][j] = 0;
                        }else{
                                Ematrix[i][j] = A[i][j] / lambda[j];
                        }
                }
        }

        return {E:Ematrix, lambda:lambda};
};


//computes quantile. warning - changes input array!!!
var quantile=function(vec,q){
        vec.sort(function(a,b){return a>b;});
        if (q>1) q=1;
        if (q<0) q=0;
        var n=vec.length;
        var i=Math.floor((n - 1)*q);
        var delta=(n-1)*q - i;
        return (1 - delta)*vec[i] + delta*vec[i+1];
}

//computes mean
var mean=function(vec){
        var n=vec.length;
        var i,sum=0;
        for (i=0;i<n;i++){
                sum+=vec[i];
        }
        return sum/n;
}



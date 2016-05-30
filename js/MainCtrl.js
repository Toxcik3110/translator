app.controller("MainCtrl", ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.allowSynth = false;
    $scope.changeTo = function(str) {
        switch (str) {
            case 'code':
            $scope.sourceCode = true;
            $scope.lexemAnalizator = false;
            $scope.synthAnalizator = false;
            $scope.polizBuilder = false;
            $scope.grammarTable = false;
            $scope.relationTable = false;
                break;
            case 'lex':
            $scope.sourceCode = false;
            $scope.lexemAnalizator = true;
            $scope.synthAnalizator = false;
            $scope.polizBuilder = false;
            $scope.grammarTable = false;
            $scope.relationTable = false;
                break;
            case 'synth':
            $scope.sourceCode = false;
            $scope.lexemAnalizator = false;
            $scope.synthAnalizator = true;
            $scope.polizBuilder = false;
            $scope.grammarTable = false;
            $scope.relationTable = false;
                break;
            case 'poliz':
            $scope.sourceCode = false;
            $scope.lexemAnalizator = false;
            $scope.synthAnalizator = false;
            $scope.polizBuilder = true;
            $scope.grammarTable = false;
            $scope.relationTable = false;
                break;
            case 'grammar':
            $scope.sourceCode = false;
            $scope.lexemAnalizator = false;
            $scope.synthAnalizator = false;
            $scope.polizBuilder = false;
            $scope.grammarTable = true;
            $scope.relationTable = false;
                break;
            case 'relation':
            $scope.sourceCode = false;
            $scope.lexemAnalizator = false;
            $scope.synthAnalizator = false;
            $scope.polizBuilder = false;
            $scope.grammarTable = false;
            $scope.relationTable = true;
                break;
            default:
            $scope.sourceCode = true;
            $scope.lexemAnalizator = false;
            $scope.synthAnalizator = false;
            $scope.polizBuilder = false;
            $scope.grammarTable = false;
            $scope.relationTable = false;
        }
    }
    $scope.changeTo('');
    var limit = 2;
    $scope.error = 'No error!'
    $scope.source = ""
    +"program h ;\n"
    +"var a , b , c ;\n"
    +"begin\n"
    +"@ lab :\n"
    // +"read ( a ) ;\n"
    +"read ( a , b ) ;\n"
    // +"read ( a , b , c ) ;\n"
    // +"write ( a , b ) ;\n"
    +"if ( a = b ) goto lab ;\n"
    +"a := 0 - 1 ;\n"
    +"for b := 1 by 1 to 2 do\n"
    +"for c := 5 by 4 to 10 do\n"
    +"write ( b , c ) ;\n"
    // +"do a = 0 by 2 to 10; read ( c ) ; "

    //+"@ c: write ( a ) ; "
    // +"write ( a ) ;\n"
    +"write ( a , b , c ) ;\n"
    +"end";
    // $scope.source = ""
    // +"program h;\n"
    // +"var a,b,c;\n"
    // +"begin\n"
    // +"@lab:\n"
    // +"if(a=b) goto b;\n"
    // +"a:=a+1.6E2-14.12;\n"
    // +"end";
    $scope.fields = [];
    // $scope.grammar =
    //     '<Z> ::= b <M> b\n'+
    //     '<M> ::= ( <L> | a\n'+
    //     '<L> ::= <M> a )';
    //
    // $scope.source = "b ( a a ) b";

    // program id ;

    $scope.grammar =
    '<программа> ::= <name> ; var <список1> begin <список2>\n'+
    '<name> ::= program id\n'+
    '<список1> ::= <списокid>\n'+
    '<списокid> ::= id , | <списокid> id , | <списокid> id ;\n'+
    '<список2> ::= <списокоператоров> ; end\n'+
    '<списокоператоров> ::= <оператор> | <списокоператоров> ; <оператор>\n'+
    '<оператор> ::= <непомеченныйоператор> | <label>\n'+
    '<label> ::= <label1> : <непомеченныйоператор>\n'+
    '<label1> ::= @ label\n'+
    '<непомеченныйоператор> ::= <ввод> | <вывод> | <присвоение> | <цикл> | <условие>\n'+
    '<ввод> ::= read ( <списокread>  | read ( id )\n'+
    '<списокread> ::= id , | <списокid> id , | <списокid> id )\n'+
    '<вывод> ::= write ( <списокread>  | write ( id )\n'+
    '<цикл> ::= for id := <врж> by <врж> to <врж> do <оператор>\n'+
    // '<head> ::= for id :=\n'+
    // '<body> ::= <врж> by <врж> to <врж>\n'+
    '<условие> ::= if ( <отношение> ) goto label\n'+
    '<присвоение> ::= id := <врж1>\n'+
    '<отношение> ::= <врж2> <знакотношения> <врж1> \n'+
    '<знакотношения> ::= ~ | { | } | > | < | = \n'+
    '<врж1> ::= <врж>\n'+
    '<врж2> ::= <врж>\n'+
    '<врж> ::= <терм1> | <врж> + <терм1> | <врж> - <терм1>\n'+
    '<терм1> ::= <терм>\n'+
    '<терм> ::= <множ> | <терм> * <множ> | <терм> / <множ>\n'+
    '<множ1> ::= <множ>\n'+
    '<множ> ::= con | id | ( <врж1> )';

    $scope.testSource = $scope.source.split("\n").join();

    var grammar = $scope.grammar.split("\n");
    console.log(grammar);
    var alph = [];
    var terms = [];
    var nterms = [];
    var tnt = [];
    var relations = [];
    for (var i = 0; i < grammar.length; i++) {
        var gr = (grammar[i].split(" "));
        var x = {
            'term':gr[0],
            'def':''
        }
        alph.push(x);
        for (var j = 0; j < gr.length; j++) {
            if (gr[j].startsWith('<') && gr[j].endsWith('>')) {
                if(j > 0) {
                    if (alph[alph.length-1].def == '') {
                        alph[alph.length-1].def += gr[j];
                    } else {
                        alph[alph.length-1].def += (" " + gr[j]);
                    }
                }
                nterms.push(gr[j]);
                if ($scope.fields.indexOf(gr[j]) < 0) {
                    $scope.fields.push(gr[j]);
                }
            } else if (gr[j] == "::="){
                // terms.push(gr[j]);
            } else if (gr[j] == "|"){
                var x = {
                    'term':gr[0],
                    'def':''
                }
                alph.push(x);
            } else {
                if (alph[alph.length-1].def == '') {
                    alph[alph.length-1].def += gr[j];
                } else {
                    alph[alph.length-1].def += (" " + gr[j]);
                }
                if ($scope.fields.indexOf(gr[j]) < 0) {
                    $scope.fields.push(gr[j]);
                }
                terms.push(gr[j]);
            }
        }
    }
    $scope.fields.push('#');
    for (var i = 0; i < $scope.fields.length; i++) {
        var r = [];
        for (var j = 0; j < $scope.fields.length; j++) {
            if (j == $scope.fields.length - 1)
                r.push({'row':$scope.fields[i], 'col':$scope.fields[j], 'value':'>','rvalue':''});
            else if (i == $scope.fields.length - 1)
                r.push({'row':$scope.fields[i], 'col':$scope.fields[j], 'value':'<','rvalue':''});
            else
                r.push({'row':$scope.fields[i], 'col':$scope.fields[j], 'value':'','rvalue':''});
        }
        // r.push({'key':i + " " + j, 'value':''})
        relations.push(r);
    }

    for (var i = 0; i < alph.length; i++) {
        var def = alph[i].def.split(" ");
        for (var j = 0; j < def.length; j++) {
            if (j < def.length - 1) {
                relations[$scope.fields.indexOf(def[j])][$scope.fields.indexOf(def[j+1])].value = "=";
            }
        }
    }

    // FIRST+

    var isTerm = function(elem, alph) {
        for(var j = 0; j < alph.length; j++) {
            if (elem == alph[j].term) {
                return true;
            }
        }
        return false;
    }

    var searchInAlph = function(elem, alph) {
        var def = [];
        for(var i = 0; i < alph.length; i++) {
            if(elem == alph[i].term) {
                def.push(alph[i].def.split(" ")[0]);
            }
        }
        return def;
    }

    var searchInAlph1 = function(elem, alph) {
        var def = [];
        for(var i = 0; i < alph.length; i++) {
            if(elem == alph[i].term) {
                var arr = alph[i].def.split(" ");
                def.push(arr[arr.length - 1]);
            }
        }
        return def;
    }

    var partArr = function(arr1, arr2) {
        var value = false;
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if(arr1.length == arr2.length) {
                    value = true;
                    for (var k = 0; k < arr1[i].length; k++) {
                        if(arr1[i][k] != arr2[j][k]) {
                            return false;
                        }
                    }
                    return value;
                }
            }
        }
        return value;
    }

    var getFirstTerms = function(elem, alph) {
        var values = [];
        //console.log(elem);
        var searchStack = searchInAlph(elem, alph);
        //console.log(searchStack);
        var step = 0;
        while(step < searchStack.length) {
            var index = step;
            step++;
            var def = searchStack[index];
            var d0 = isTerm(def, alph);
            values.push(def);
            //console.log("DEF: " + def);
            if(d0) {
                var found = searchInAlph(def, alph);
                // console.log("searchStack");
                // console.log(searchStack);
                // console.log("found");
                // console.log(found);
                for (var i = 0; i < found.length; i++) {
                    if (searchStack.indexOf(found[i]) == -1) {
                        searchStack = searchStack.concat(found[i]);
                        //console.log(searchStack);
                        //console.log("added" + found[i]);
                    }
                }
                //searchStack.concat(found);
            }
            //searchStack.splice(index, 1);
        }
        //console.log("values");
        //console.log(values);
        return values;
    }

    var getFirstTerms1 = function(elem, alph) {
        var values = [];
        for(var i = 0; i < alph.length; i++) {
            if(elem == alph[i].term) {
                var def = alph[i].def.split(" ");
                var d0 = isTerm(def[0], alph);
                values.push(def[0]);
                if(d0) {
                    var val = getFirstTerms(def[0], alph);
                    for(var j = 0; j < val.length; j++) {
                        values.push(val[j]);
                    }
                }
            }
        }
        return values;
    }

    for(var k = 0; k < alph.length; k++) {
        var def = alph[k].def.split(" ");
        for(var i = 0; i < def.length; i++) {
            var d0 = isTerm(def[i], alph);
            //console.log("isTerm"+i+":" + def[i] + ":" + d0);
            if(d0) {
                var terms = getFirstTerms(def[i], alph);
                //console.log("TERMS");
                //console.log(terms);
                for(var j = 0; j < terms.length; j++) {
                    relations[$scope.fields.indexOf(def[i])][$scope.fields.indexOf(terms[j])].rvalue = "F";
                }
            }
        }
    }

    // RELATION "<"

    var haveFirst = function(row) {
        for(var i = 0; i < row.length; i++) {
            if(row[i].rvalue == "F") {
                return true;
            }
        }
        return false;
    }

    var relationEquals = function(rel, j) {
        var result = [];
        for(var i = 0; i < rel.length; i++) {
            if(rel[i][j].value == "=") {
                //console.log("FOUND AT: " + i + " " + j);
                //console.log(rel[i][j]);
                result.push(i);
            } else {
                result.push(-1);
            }
        }
        return result;
    }

    for (var i = 0; i < relations.length; i++) {
        var row = haveFirst(relations[i]);
        if (row) {
            var col = relationEquals(relations, i);
            for(var k = 0; k < col.length; k++) {
                if(col[k] >= 0) {
                    for (var j = 0; j < relations[i].length; j++) {
                        if(relations[i][j].rvalue == "F") {
                            relations[col[k]][j].value = "<";
                        }
                    }
                }
            }
        }
    }

    // LAST+

    // var getLastTerms = function(elem, alph) {
    //     var values = [];
    //     while(true) {
    //         var def = searchInAlph(elem, alph);
    //         if(def) {
    //             var d0 = isTerm(def[def.length-1], alph);
    //             values.push(def[def.length-1]);
    //             if(d0) {
    //                 elem = def[def.length - 1];
    //             } else break;
    //         }
    //     }
    //     return values;
    // }

    var getLastTerms = function(elem, alph) {
        var values = [];
        //console.log(elem);
        var searchStack = searchInAlph1(elem, alph);
        //console.log(searchStack);
        var step = 0;
        while(step < searchStack.length) {
            var index = step;
            step++;
            var def = searchStack[index];
            var d0 = isTerm(def, alph);
            values.push(def);
            //console.log("DEF: " + def);
            if(d0) {
                var found = searchInAlph1(def, alph);
                // console.log("searchStack");
                // console.log(searchStack);
                // console.log("found");
                // console.log(found);
                for (var i = 0; i < found.length; i++) {
                    if (searchStack.indexOf(found[i]) == -1) {
                        searchStack = searchStack.concat(found[i]);
                        ///console.log(searchStack);
                        //console.log("added" + found[i]);
                    }
                }
                //searchStack.concat(found);
            }
            searchStack.splice(index, 1);
        }
        return values;
    }

    var getLastTerms1 = function(elem, alph) {
        var values = [];
        for(var i = 0; i < alph.length; i++) {
            if(elem == alph[i].term) {
                var def = alph[i].def.split(" ");
                var d0 = isTerm(def[def.length-1], alph);
                if(d0) {
                    values.push(def[def.length-1]);
                    var val = getLastTerms(def[def.length-1], alph);
                    for(var j = 0; j < val.length; j++) {
                        values.push(val[j]);
                    }
                } else {
                    values.push(def[def.length-1]);
                }
            }
        }
        return values;
    }

    for(var k = 0; k < alph.length; k++) {
        var def = alph[k].def.split(" ");
        for(var i = 0; i < def.length; i++) {
            var d0 = isTerm(def[i], alph);
            //console.log("isTerm"+i+":" + def[i] + ":" + d0);
            if(d0) {
                var terms = getLastTerms(def[i], alph);
                //console.log(terms);
                for(var j = 0; j < terms.length; j++) {
                    relations[$scope.fields.indexOf(def[i])][$scope.fields.indexOf(terms[j])].rvalue = "Z";
                }
            }
        }
    }

    // RELATION >

    var haveLast = function(row) {
        for(var i = 0; i < row.length; i++) {
            if(row[i].rvalue == "Z") {
                return true;
            }
        }
        return false;
    }

    var relationEquals1 = function(rel, j) {
        var result = [];
        for(var i = 0; i < rel.length; i++) {
            if(rel[j][i].value == "=") {
                //console.log("FOUND AT: " + i + " " + j);
                //console.log(rel[j][i]);
                result.push(i);
            } else {
                result.push(-1);
            }
        }
        return result;
    }

    for (var i = 0; i < relations.length; i++) {
        var row = haveLast(relations[i]);
        if (row) {
            var col = relationEquals1(relations, i);
            //console.log("COLS");
            //console.log(col);
            for(var k = 0; k < col.length; k++) {
                if(col[k] >= 0) {
                    for (var j = 0; j < relations[i].length; j++) {
                        if(relations[i][j].rvalue == "Z") {
                            relations[j][col[k]].value = ">";
                        }
                    }
                }
            }
        }
    }


    $scope.relations = relations;
    console.log("RELATIONS");
    console.log(relations);
    console.log("ALPHABET:");
    console.log(alph);
    console.log("FIELDS:");
    console.log($scope.fields);

    //synth razbor

    var equals = function(a,b) {
        if(a.length != b.length) {
            return false;
        }
        for(var i = 0; i < a.length; i++) {
            if(a[i] != b[i]) {
                return false;
            }
        }
        return true;
    };

    var tryReduce = function(def) {
        for(var i = 0; i < alph.length; i++) {
            var def1 = alph[i].def.split(" ");
            if(equals(def1, def)) {
                return alph[i].term;
            }
        }
        return '';
    }

    $scope.synthOutput = [];
    var testSource = $scope.testSource.split(" ");
    var synthAn = function() {
        console.log("TEST SOURCE");
        var input = testSource.splice(1,testSource.length - 1);
        console.log(input);
        var rel = '';
        var output = [];
        output.push(testSource[0]);
        var step = 0;
        var data = {
            'input':input.slice(),
            'output':output.slice(),
            'step':step,
            'relation':'<'
        }
        $scope.synthOutput.push(data);
        var elem = '';
        var stack = [];
        var stackSize = 0;
        while(input != '' && step < 25) {
            console.log(input);
            step++;

            if(elem == '') {
                elem = input.shift();
                var x = -1;
                var y = -1;
                for(var i = 0; i < relations.length; i++) {
                    for(var j = 0; j < relations[i].length; j++) {
                        if((input[0] == relations[i][j].col) && (elem == relations[i][j].row)) {
                            x = i;
                            y = j;
                        }
                    }
                }
                if ((x >= 0) && (y >= 0)) {
                    console.log(step);
                    console.log("Element: " + elem);
                    console.log("Compare: " + input[0]);
                    console.log("Relation: " + relations[x][y].value);
                    console.log(x + " " + y);
                    console.log(elem);
                    if((relations[x][y].value == "<")) {
                        rel = "<";
                        output.push(elem);
                        var data = {
                            'input':input.slice(),
                            'output':output.slice(),
                            'step':step,
                            'relation':'<'
                        }
                        $scope.synthOutput.push(data);
                        elem = '';
                    } else if (relations[x][y].value == ">") {
                        rel = ">";
                        var data = {
                            'input':input.slice(),
                            'output':output.slice(),
                            'step':step,
                            'relation':'>'
                        }
                        $scope.synthOutput.push(data);
                        var stack = [];

                        if(stackSize == 0) {
                            stack.push(elem);
                            for (var i = 0; i < stackSize; i++) {
                                stack.push(output[output.length - i - 1]);
                                var reduced = tryReduce(stack);
                                if (reduced) {
                                    console.log("REDUCED");
                                    console.log(reduced);
                                    output.splice(output.length - stackSize, stackSize);

                                    input.unshift(reduced);
                                    console.log(output);
                                    elem = reduced;
                                }
                            }
                            // var reduced = tryReduce(stack);
                            //     if (reduced) {
                            //     output.push(reduced);
                            //     elem = reduced;
                            // }
                        } else if(stackSize > 0) {
                            console.log(output);
                            for (var i = 0; i < stackSize; i++) {
                                stack.push(output[output.length - stackSize + i]);
                            }
                            stack.push(elem);
                            console.log("stackSize: " + stackSize);
                            console.log(stack);
                            var reduced = tryReduce(stack);
                            if (reduced) {
                                console.log("REDUCED");
                                console.log(reduced);
                                output.splice(output.length - stackSize, stackSize);

                                input.unshift(reduced);
                                console.log(output);
                                elem = '';
                            }
                        }
                        stackSize = 0;
                    } else if (relations[x][y].value == "=") {
                        stackSize++;
                        // elem = input.shift();
                        rel = "="
                        output.push(elem);
                        var data = {
                            'input':input.slice(),
                            'output':output.slice(),
                            'step':step,
                            'relation':'='
                        }
                        $scope.synthOutput.push(data);
                        elem = '';
                    }
                } else {
                    $scope.error = "Error in synth analizator, at:" + output[output.length-1] +
                    " and " + input[0];
                }
            } else {
                // elem = input.shift();
                var x = -1;
                var y = -1;
                for(var i = 0; i < relations.length; i++) {
                    for(var j = 0; j < relations[i].length; j++) {
                        if((input[0] == relations[i][j].col) && (elem == relations[i][j].row)) {
                            x = i;
                            y = j;
                        }
                    }
                }
                if ((x >= 0) && (y >= 0)) {
                    console.log(step);
                    console.log("Element: " + elem);
                    console.log("Compare: " + input[0]);
                    console.log("Relation: " + relations[x][y].value);
                    console.log(x + " " + y);
                    console.log(elem);
                    if((relations[x][y].value == "<")) {
                        rel = "<";
                        output.push(elem);
                        var data = {
                            'input':input.slice(),
                            'output':output.slice(),
                            'step':step,
                            'relation':'<'
                        }
                        $scope.synthOutput.push(data);
                        elem = '';
                    } else if (relations[x][y].value == ">") {
                        rel = ">";
                        var data = {
                            'input':input.slice(),
                            'output':output.slice(),
                            'step':step,
                            'relation':'>'
                        }
                        $scope.synthOutput.push(data);
                        var stack = [];

                        if(stackSize == 0) {
                            stack.push(elem);
                            var reduced = tryReduce(stack);
                            if (reduced) {
                                output.push(reduced);
                                elem = reduced;
                            }
                        } else if(stackSize > 0) {
                            console.log(output);
                            for (var i = 0; i < stackSize; i++) {
                                stack.push(output[output.length - stackSize + i]);
                            }
                            stack.push(elem);
                            console.log("stackSize: " + stackSize);
                            console.log(stack);
                            var reduced = tryReduce(stack);
                            if (reduced) {
                                console.log("REDUCED");
                                console.log(reduced);
                                output.splice(output.length - stackSize, stackSize);

                                output.push(reduced);
                                console.log(output);
                                elem = '';
                            }
                        }
                        stackSize = 0;
                    } else if (relations[x][y].value == "=") {
                        stackSize++;
                        // elem = input.shift();
                        rel = "="
                        //output.push(elem);
                        var data = {
                            'input':input.slice(),
                            'output':output.slice(),
                            'step':step,
                            'relation':'='
                        }
                        $scope.synthOutput.push(data);
                        elem = '';
                    }
                } else {
                    $scope.error = "Error in synth analizator, at:" + output[output.length-1] +
                    " and " + input[0];
                }
            }
        }
    }

    $scope.synthAn2 = function() {
        var input = $scope.source.split("\n").join(" ").split(" ").slice();
        var inputClone = input.slice();
        console.log(input);

        if($scope.error == 'No error!') {
            console.log('no error');
            for(var i = 0; i < input.length; i++) {
                for(var j = 0; j < $scope.vars.length; j++)
                    if($scope.vars[j].variable == input[i]) {
                        input[i] = 'id';
                        //console.log('found var: ' + $scope.vars[j].variable);
                    }

                for(var j = 0; j < $scope.labels.length; j++)
                    if($scope.labels[j].variable == input[i]) {
                        input[i] = 'label';
                        //console.log('found label: ' + $scope.labels[j].variable);
                    }

                for(var j = 0; j < $scope.consts.length; j++)
                    if($scope.consts[j].constant == input[i]) {
                        input[i] = 'con';
                        //console.log('found con: ' + $scope.consts[j].constant);
                    }
            }
        }

        console.log(input);

        if (input[0] != "program") {
            $scope.error = "Error! Not a program!";
            return 0;
        }
        console.log();//step input relation output
        inputClone.splice(0,1);

        $scope.synthOutput.push({
            'step':0,
            'input':inputClone.slice(),
            'relation':'=',
            'output':['program']
        });

        inputClone.splice(0,1);

        $scope.synthOutput.push({
            'step':1,
            'input':inputClone.slice(),
            'relation':'=',
            'output':['program','h']
        });

        //inputClone.splice(0,1);

        $scope.synthOutput.push({
            'step':2,
            'input':inputClone.slice(),
            'relation':'>',
            'output':['<name>']
        });

        inputClone.splice(0,1);

        $scope.synthOutput.push({
            'step':3,
            'input':inputClone.slice(),
            'relation':'=',
            'output':['<name>',';']
        });

        inputClone.splice(0,1);

        $scope.synthOutput.push({
            'step':4,
            'input':inputClone.slice(),
            'relation':'=',
            'output':['<name>',';','var']
        });

        if (input[1] != "id") {
            $scope.error = "Error! Incorrect name of program!";
            return 0;
        }
        if (input[2] != ";") {
            $scope.error = "Error! Missing the \";\" at the end of statement!";
            return 0;
        }
        if (input[3] != "var") {
            $scope.error = "Error! Missing the \"var\" block!";
            return 0;
        }
        if (input[input.length - 1] != "end") {
            $scope.error = "Error! Missing the end of program!";
            return 0;
        }
        var varEnd = input.indexOf(";", 3);
        var elems = ['<name>',';','var'];
        var counter = 1;
        for (var i = 4; i < varEnd; i++) {
            console.log("input[" + i + "] = " + input[i]);
            var elem = inputClone.splice(0,1);
            elems = elems.concat(elem);
            if((i % 2 == 0) && (input[i] == "id")) {
                $scope.synthOutput.push({
                    'step':4 + counter,
                    'input':inputClone.slice(),
                    'relation':'>',
                    'output': elems.slice()
                });
                counter++;

            } else if ((i % 1 == 0) && (input[i] == ",")){
                $scope.synthOutput.push({
                    'step':4 + counter,
                    'input':inputClone.slice(),
                    'relation':'=',
                    'output': elems.slice()
                });
                counter++;
                elems.pop();
                elems.pop();
                elems.push('<списокid>')
                $scope.synthOutput.push({
                    'step':4 + counter,
                    'input':inputClone.slice(),
                    'relation':'>',
                    'output': elems.slice()
                });
                counter++;
                if(counter > 4) {
                    elems.pop();
                    elems.pop();
                    elems.push('<списокid>')
                    $scope.synthOutput.push({
                        'step':4 + counter,
                        'input':inputClone.slice(),
                        'relation':'>',
                        'output': elems.slice()
                    });
                    counter++;
                }
            } else {
                $scope.error = "Error! Wrong varibale declaration!";
                return 0;
            }
        }
        counter += 4;
        inputClone.splice(0,1);
        $scope.synthOutput.push({
            'step':counter,
            'input':inputClone.slice(),
            'relation':'>',
            'output':['<name>',';','var','<списокid>']
        });
        counter++;
        $scope.synthOutput.push({
            'step':counter,
            'input':inputClone.slice(),
            'relation':'=',
            'output':['<name>',';','var','<список1>']
        });
        counter++;
        inputClone.splice(0,1);
        $scope.synthOutput.push({
            'step':counter,
            'input':inputClone.slice(),
            'relation':'=',
            'output':['<name>',';','var','<списокid>','begin']
        });
        var outp = ['<name>',';','var','<списокid>','begin'];
        console.log("input[" + i + "] = " + input[i]);
        var programEnd = input.indexOf('end');
        var i = counter - 4;
        while(i < programEnd) {
            console.log("input[" + i + "] = " + input[i]);
            if(input[i] == '@') {
                counter++;
                var el = inputClone.splice(0,1);
                outp = outp.concat(el);
                $scope.synthOutput.push({
                    'step':counter,
                    'input':inputClone.slice(),
                    'relation':'=',
                    'output':outp.slice()
                });
                if(input[i+1] == 'label') {
                    counter++;
                    var el = inputClone.splice(0,1);
                    outp = outp.concat(el);
                    $scope.synthOutput.push({
                        'step':counter,
                        'input':inputClone.slice(),
                        'relation':'>',
                        'output':outp.slice()
                    });
                    counter++;
                    outp.pop();
                    outp.pop();
                    outp.push('<label1>');
                    $scope.synthOutput.push({
                        'step':counter,
                        'input':inputClone.slice(),
                        'relation':'=',
                        'output':outp.slice()
                    });
                    if(input[i + 2] == ':') {
                        counter++;
                        var el = inputClone.splice(0,1);
                        outp = outp.concat(el);
                        $scope.synthOutput.push({
                            'step':counter,
                            'input':inputClone.slice(),
                            'relation':'=',
                            'output':outp.slice()
                        });
                        i+= 3;
                    } else {
                        console.error('error');
                        $scope.error = "Error! Wrong label declaration!";
                        return 0;
                    }
                } else {
                    console.error('error');
                    $scope.error = "Error! Wrong label declaration!";
                    return 0;
                }
            } else if(input[i] == 'read') {
                counter++;
                var el = inputClone.splice(0,1);
                outp = outp.concat(el);
                $scope.synthOutput.push({
                    'step':counter,
                    'input':inputClone.slice(),
                    'relation':'=',
                    'output':outp.slice()
                });
                if(input[i+1] == '(') {
                    counter++;
                    var el = inputClone.splice(0,1);
                    outp = outp.concat(el);
                    $scope.synthOutput.push({
                        'step':counter,
                        'input':inputClone.slice(),
                        'relation':'<',
                        'output':outp.slice()
                    });
                    var j = 2;
                    while (true) {
                        console.log(input[i+j]);
                        if(input[i+j] == ")" && j % 2 == 1) {
                            // var k = 0;
                            // while(outp[outp.length-k] == "<списокid>" || outp[outp.length-k] == "id") {
                            //
                            // }
                            // if(outp[outp.length - 1] == "id") {
                            //     counter++;
                            //     outp.pop();
                            //     outp.push("<списокid>");
                            //     $scope.synthOutput.push({
                            //         'step':counter,
                            //         'input':inputClone.slice(),
                            //         'relation':'>',
                            //         'output':outp.slice()
                            //     });
                            //     if(outp[outp.length - 2] == "<списокid>") {
                            //         counter++;
                            //         outp.pop();
                            //         outp.pop();
                            //         outp.push("<списокid>");
                            //         $scope.synthOutput.push({
                            //             'step':counter,
                            //             'input':inputClone.slice(),
                            //             'relation':'>',
                            //             'output':outp.slice()
                            //         });
                            //     }
                            // }
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            counter++;
                            outp.pop();
                            outp.pop();
                            outp.push("<списокread>");
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            counter++;
                            outp.pop();
                            outp.pop();
                            outp.pop();
                            outp.push("<ввод>");
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            if(j == 2) {
                                console.error('error');
                                $scope.error = "Error! Wrong read declaration!";
                                return 0;
                            } else if(input[i+j+1] == ';') {
                                i += j + 2;
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                counter++;
                                outp.pop();
                                outp.pop();
                                outp.push("<непомеченныйоператор>");
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length - 2] == ':') {
                                    counter++;
                                    outp.pop();
                                    outp.pop();
                                    outp.pop();
                                    outp.push("<label>");
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                counter++;
                                outp.pop();
                                outp.push("<оператор>");
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length - 2] == "<списокоператоров>") {
                                    counter++;
                                    outp.pop();
                                    outp.pop();
                                    outp.push("<списокоператоров>");
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                } else if(outp[outp.length-2] == "do") {
                                    while(outp[outp.length-2] == "do") {
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<цикл>')
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                        // counter++;
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        // $scope.synthOutput.push({
                                        //     'step':counter,
                                        //     'input':inputClone.slice(),
                                        //     'relation':'=',
                                        //     'output':outp.slice()
                                        // });
                                        counter++;
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        // outp.pop();
                                        outp.pop();
                                        outp.push('<непомеченныйоператор>')
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'=',
                                            'output':outp.slice()
                                        });
                                        if(outp[outp.length - 2] == ':') {
                                            counter++;
                                            outp.pop();
                                            outp.pop();
                                            outp.pop();
                                            outp.push("<label>");
                                            $scope.synthOutput.push({
                                                'step':counter,
                                                'input':inputClone.slice(),
                                                'relation':'>',
                                                'output':outp.slice()
                                            });
                                        }
                                        counter++;
                                        outp.pop();
                                        outp.push("<оператор>");
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                    }
                                    if(outp[outp.length - 2] == "<списокоператоров>") {
                                        counter++;
                                        outp.pop();
                                        outp.pop();
                                        outp.push("<списокоператоров>");
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                    } else {
                                        counter++;
                                        outp.pop();
                                        outp.push("<списокоператоров>");
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                    }
                                } else {
                                    counter++;
                                    outp.pop();
                                    outp.push("<списокоператоров>");
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                break;
                                //WORKED
                            } else {
                                console.error('error');
                                $scope.error = "Error! Wrong read declaration!";
                                return 0;
                            }
                        } else if (j % 2 == 0 && input[i+j] == 'id') {
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'=',
                                'output':outp.slice()
                            });
                            // var el = inputClone.splice(0,1);
                            if(outp[outp.length-2] == '<списокid>') {
                                counter++;
                                outp.pop();
                                outp.pop();
                                outp.push('<списокid>');
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                            }
                            if(inputClone[0] == ')') {
                                counter++;
                                // var el = inputClone.splice(0,1);
                                outp.pop();
                                if(outp[outp.length-1] == '<списокid>') {
                                    outp.pop();
                                }
                                outp.push('<списокid>');
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                            }
                            j++;
                        } else if (j % 2 == 1 && input[i+j] == ',') {

                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            counter++;
                            //var el = inputClone.splice(0,1);
                            outp.pop();
                            outp.pop();
                            outp.push('<списокid>');
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'=',
                                'output':outp.slice()
                            });
                            j++;
                        } else {
                            console.error('error');
                            $scope.error = "Error! Wrong read declaration!";
                            return 0;
                        }
                    }
                } else {
                    console.error('error');
                    $scope.error = "Error! Wrong read declaration!";
                    return 0;
                }
            } else if(input[i] == 'write') {
                counter++;
                var el = inputClone.splice(0,1);
                outp = outp.concat(el);
                $scope.synthOutput.push({
                    'step':counter,
                    'input':inputClone.slice(),
                    'relation':'=',
                    'output':outp.slice()
                });
                if(input[i+1] == '(') {
                    counter++;
                    var el = inputClone.splice(0,1);
                    outp = outp.concat(el);
                    $scope.synthOutput.push({
                        'step':counter,
                        'input':inputClone.slice(),
                        'relation':'<',
                        'output':outp.slice()
                    });
                    var j = 2;
                    while (true) {
                        if(input[i+j] == ")" && j % 2 == 1) {
                            // counter++;
                            // if(outp[outp.length - 2] == "<списокid>") {
                            //     outp.pop();
                            //     outp.pop();
                            // }
                            // outp.pop();
                            // outp.push("<списокid>");
                            // $scope.synthOutput.push({
                            //     'step':counter,
                            //     'input':inputClone.slice(),
                            //     'relation':'>',
                            //     'output':outp.slice()
                            // });
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            counter++;
                            outp.pop();
                            outp.pop();
                            outp.push("<списокread>");
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            counter++;
                            outp.pop();
                            outp.pop();
                            outp.pop();
                            outp.push("<вывод>");
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            if(j == 2) {
                                console.error('error');
                                $scope.error = "Error! Wrong read declaration!";
                                return 0;
                            } else if(input[i+j+1] == ';') {
                                i += j + 2;
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                counter++;
                                outp.pop();
                                outp.pop();
                                outp.push("<непомеченныйоператор>");
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length - 2] == ':') {
                                    counter++;
                                    outp.pop();
                                    outp.pop();
                                    outp.pop();
                                    outp.push("<label>");
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                counter++;
                                outp.pop();
                                outp.push("<оператор>");
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length - 2] == "<списокоператоров>") {
                                    counter++;
                                    outp.pop();
                                    outp.pop();
                                    outp.push("<списокоператоров>");
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                } else if(outp[outp.length-2] == "do") {
                                    while(outp[outp.length-2] == "do") {
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<цикл>')
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                        // counter++;
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        // $scope.synthOutput.push({
                                        //     'step':counter,
                                        //     'input':inputClone.slice(),
                                        //     'relation':'=',
                                        //     'output':outp.slice()
                                        // });
                                        counter++;
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        // outp.pop();
                                        outp.pop();
                                        outp.push('<непомеченныйоператор>')
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'=',
                                            'output':outp.slice()
                                        });
                                        if(outp[outp.length - 2] == ':') {
                                            counter++;
                                            outp.pop();
                                            outp.pop();
                                            outp.pop();
                                            outp.push("<label>");
                                            $scope.synthOutput.push({
                                                'step':counter,
                                                'input':inputClone.slice(),
                                                'relation':'>',
                                                'output':outp.slice()
                                            });
                                        }
                                        counter++;
                                        outp.pop();
                                        outp.push("<оператор>");
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                    }
                                    if(outp[outp.length - 2] == "<списокоператоров>") {
                                        counter++;
                                        outp.pop();
                                        outp.pop();
                                        outp.push("<списокоператоров>");
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                    } else {
                                        counter++;
                                        outp.pop();
                                        outp.push("<списокоператоров>");
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                    }
                                } else {
                                    counter++;
                                    outp.pop();
                                    outp.push("<списокоператоров>");
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                break;
                                //WORKED
                            } else {
                                console.error('error');
                                $scope.error = "Error! Wrong read declaration!";
                                return 0;
                            }
                        } else if (j % 2 == 0 && input[i+j] == 'id') {
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'=',
                                'output':outp.slice()
                            });
                            // var el = inputClone.splice(0,1);
                            if(outp[outp.length-2] == '<списокid>') {
                                counter++;
                                outp.pop();
                                outp.pop();
                                outp.push('<списокid>');
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                            }
                            if(inputClone[0] == ')') {
                                counter++;
                                // var el = inputClone.splice(0,1);
                                outp.pop();
                                if(outp[outp.length-1] == '<списокid>') {
                                    outp.pop();
                                }
                                outp.push('<списокid>');
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                            }
                            j++;
                        } else if (j % 2 == 1 && input[i+j] == ',') {
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            counter++;
                            //var el = inputClone.splice(0,1);
                            if(outp[outp.length-2] == "<списокid>") outp.pop();
                            outp.pop();
                            outp.pop();
                            outp.push('<списокid>');
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'=',
                                'output':outp.slice()
                            });
                            j++;
                        } else {
                            console.error('error');
                            $scope.error = "Error! Wrong read declaration!";
                            return 0;
                        }
                    }
                } else {
                    console.error('error');
                    $scope.error = "Error! Wrong read declaration!";
                    return 0;
                }
            } else if(input[i] == 'id') {
                counter++;
                var el = inputClone.splice(0,1);
                outp = outp.concat(el);
                $scope.synthOutput.push({
                    'step':counter,
                    'input':inputClone.slice(),
                    'relation':'=',
                    'output':outp.slice()
                });
                if(input[i+1] == ':=') {
                    counter++;
                    var el = inputClone.splice(0,1);
                    outp = outp.concat(el);
                    $scope.synthOutput.push({
                        'step':counter,
                        'input':inputClone.slice(),
                        'relation':'=',
                        'output':outp.slice()
                    });
                    var j = 2;
                    var openBrackets = 0;
                    var idp = true;
                    var opp = false;
                    var countId = 0;
                    var oper = false;
                    while (true) {
                        console.log("input[" + (i+j) + "] = " + input[i+j]);
                        if(input[i+j] == ";" && openBrackets == 0) {
                            if(j == 2) {
                                console.error('error');
                                $scope.error = "Error! Wrong assume declaration!";
                                return 0;
                            } else {
                                counter++;
                                outp.pop();
                                outp.pop();
                                outp.pop();
                                outp.push('<присвоение>')
                                // var el = inputClone.splice(0,1);
                                // outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                counter++;
                                // var el = inputClone.splice(0,1);
                                // outp = outp.concat(el);
                                outp.pop();
                                outp.pop();
                                outp.push('<непомеченныйоператор>')
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length - 2] == ':') {
                                    counter++;
                                    outp.pop();
                                    outp.pop();
                                    outp.pop();
                                    outp.push("<label>");
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                counter++;
                                outp.pop();
                                outp.push("<оператор>");
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length - 2] == "<списокоператоров>") {
                                    counter++;
                                    outp.pop();
                                    outp.pop();
                                    outp.push("<списокоператоров>");
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                } else if(outp[outp.length-2] == "do") {
                                    while(outp[outp.length-2] == "do") {
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<цикл>')
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                        // counter++;
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        // $scope.synthOutput.push({
                                        //     'step':counter,
                                        //     'input':inputClone.slice(),
                                        //     'relation':'=',
                                        //     'output':outp.slice()
                                        // });
                                        counter++;
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        // outp.pop();
                                        outp.pop();
                                        outp.push('<непомеченныйоператор>')
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'=',
                                            'output':outp.slice()
                                        });
                                        if(outp[outp.length - 2] == ':') {
                                            counter++;
                                            outp.pop();
                                            outp.pop();
                                            outp.pop();
                                            outp.push("<label>");
                                            $scope.synthOutput.push({
                                                'step':counter,
                                                'input':inputClone.slice(),
                                                'relation':'>',
                                                'output':outp.slice()
                                            });
                                        }
                                        counter++;
                                        outp.pop();
                                        outp.push("<оператор>");
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                    }
                                    if(outp[outp.length - 2] == "<списокоператоров>") {
                                        counter++;
                                        outp.pop();
                                        outp.pop();
                                        outp.push("<списокоператоров>");
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                    } else {
                                        counter++;
                                        outp.pop();
                                        outp.push("<списокоператоров>");
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                    }
                                } else {
                                    counter++;
                                    outp.pop();
                                    outp.push("<списокоператоров>");
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                i += j + 1;
                                break;
                            }
                        } else if ((input[i+j] == ')') && (openBrackets > 0) && (opp == true)) {
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'=',
                                'output':outp.slice()
                            });
                            outp.pop();
                            outp.pop();
                            outp.pop();
                            outp.push('<множ>')
                            // var el = inputClone.splice(0,1);
                            // outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            openBrackets--;
                            j++;
                        } else if ((input[i+j] == '(') && (idp == true)) {
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'<',
                                'output':outp.slice()
                            });
                            openBrackets++;
                            j++;
                        } else if ((input[i+j] == 'id' || input[i+j] == 'con') && (idp == true)) {
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            counter++;
                            //var el = inputClone.splice(0,1);
                            //outp = outp.concat(el);
                            outp.pop();
                            outp.push('<множ>');
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'<',
                                'output':outp.slice()
                            });
                            if(outp[outp.length-2] == "+" || outp[outp.length-2] == '-') {
                                if(outp[outp.length-3] == "<множ>" || outp[outp.length-3] == '<терм>') {
                                    counter++;
                                    //var el = inputClone.splice(0,1);
                                    //outp = outp.concat(el);
                                    outp.pop();
                                    outp.pop();
                                    outp.pop();
                                    outp.push('<терм>');
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'<',
                                        'output':outp.slice()
                                    });
                                }
                            } else if(outp[outp.length-2] == "*" || outp[outp.length-2] == '/') {
                                if(outp[outp.length-3] == "<врж>") {
                                    counter++;
                                    //var el = inputClone.splice(0,1);
                                    //outp = outp.concat(el);
                                    outp.pop();
                                    outp.pop();
                                    outp.pop();
                                    outp.push('<врж>');
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'=',
                                        'output':outp.slice()
                                    });
                                }
                            }
                            idp = false;
                            opp = true;
                            j++;
                        } else if ((input[i+j] == '+' || input[i+j] == '-'
                                    || input[i+j] == '*'|| input[i+j] == '/') &&
                                    (opp == true)) {
                            idp = true;
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'=',
                                'output':outp.slice()
                            });
                            if(outp[outp.length-2] == "<множ>") {
                                counter++;
                                //var el = inputClone.splice(0,1);
                                //outp = outp.concat(el);
                                outp[outp.length-2] = "<терм>";
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                            }
                            if(outp[outp.length-1] == "*" || outp[outp.length-1] == "/") {
                                counter++;
                                //var el = inputClone.splice(0,1);
                                //outp = outp.concat(el);
                                outp[outp.length-2] = "<врж>";
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                            }
                            opp = false;
                            j++;
                        } else {
                            console.error('error');
                            $scope.error = "Error! Wrong assume declaration!";
                            return 0;
                        }
                    }
                }
            } else if(input[i] == 'for') {
                counter++;
                var el = inputClone.splice(0,1);
                outp = outp.concat(el);
                $scope.synthOutput.push({
                    'step':counter,
                    'input':inputClone.slice(),
                    'relation':'=',
                    'output':outp.slice()
                });
                if(input[i+1] == 'id') {
                    counter++;
                    var el = inputClone.splice(0,1);
                    outp = outp.concat(el);
                    $scope.synthOutput.push({
                        'step':counter,
                        'input':inputClone.slice(),
                        'relation':'=',
                        'output':outp.slice()
                    });
                    if(input[i+2] == ':=') {
                        counter++;
                        var el = inputClone.splice(0,1);
                        outp = outp.concat(el);
                        $scope.synthOutput.push({
                            'step':counter,
                            'input':inputClone.slice(),
                            'relation':'=',
                            'output':outp.slice()
                        });
                        var j = 3;
                        var openBrackets = 0;
                        var idp = true;
                        var opp = false;
                        var countId = 0;
                        var oper = false;
                        while (true) {
                            console.log("input[" + (i+j) + "] = " + input[i+j]);
                            if(input[i+j] == "by" && openBrackets == 0) {
                                counter++;
                                // var el = inputClone.splice(0,1);
                                // outp = outp.concat(el);
                                // $scope.synthOutput.push({
                                //     'step':counter,
                                //     'input':inputClone.slice(),
                                //     'relation':'=',
                                //     'output':outp.slice()
                                // });
                                if(j == 3) {
                                    console.error('error');
                                    $scope.error = "Error! Wrong cycle declaration!";
                                    return 0;
                                } else {
                                    counter++;
                                    var el = inputClone.splice(0,1);
                                    outp = outp.concat(el);
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'=',
                                        'output':outp.slice()
                                    });
                                    i += j + 1;
                                    break;
                                }
                            } else if ((input[i+j] == ')') && (openBrackets > 0) && (opp == true)) {
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                outp.pop();
                                outp.pop();
                                outp.pop();
                                outp.push('<множ>')
                                // var el = inputClone.splice(0,1);
                                // outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                openBrackets--;
                                j++;
                            } else if ((input[i+j] == '(') && (idp == true)) {
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'<',
                                    'output':outp.slice()
                                });
                                openBrackets++;
                                j++;
                            } else if ((input[i+j] == 'id' || input[i+j] == 'con') && (idp == true)) {
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                counter++;
                                //var el = inputClone.splice(0,1);
                                //outp = outp.concat(el);
                                outp.pop();
                                outp.push('<множ>');
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'<',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length-2] == "+" || outp[outp.length-2] == '-') {
                                    if(outp[outp.length-3] == "<множ>" || outp[outp.length-3] == '<терм>') {
                                        counter++;
                                        //var el = inputClone.splice(0,1);
                                        //outp = outp.concat(el);
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<терм>');
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'<',
                                            'output':outp.slice()
                                        });
                                    }
                                } else if(outp[outp.length-2] == "*" || outp[outp.length-2] == '/') {
                                    if(outp[outp.length-3] == "<врж>") {
                                        counter++;
                                        //var el = inputClone.splice(0,1);
                                        //outp = outp.concat(el);
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<врж>');
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'=',
                                            'output':outp.slice()
                                        });
                                    }
                                }
                                idp = false;
                                opp = true;
                                j++;
                            } else if ((input[i+j] == '+' || input[i+j] == '-'
                                        || input[i+j] == '*'|| input[i+j] == '/') &&
                                        (opp == true)) {
                                idp = true;
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length-2] == "<множ>") {
                                    counter++;
                                    //var el = inputClone.splice(0,1);
                                    //outp = outp.concat(el);
                                    outp[outp.length-2] = "<терм>";
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                if(outp[outp.length-1] == "*" || outp[outp.length-1] == "/") {
                                    counter++;
                                    //var el = inputClone.splice(0,1);
                                    //outp = outp.concat(el);
                                    outp[outp.length-2] = "<врж>";
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                opp = false;
                                j++;
                            } else {
                                console.error('error');
                                $scope.error = "Error! Wrong cycle declaration!";
                                return 0;
                            }
                        }
                        j = 0;
                        idp = true;
                        opp = false;
                        while (true) {
                            console.log("input[" + (i+j) + "] = " + input[i+j]);
                            if(input[i+j] == "to" && openBrackets == 0) {
                                // counter++;
                                // var el = inputClone.splice(0,1);
                                // outp = outp.concat(el);
                                // $scope.synthOutput.push({
                                //     'step':counter,
                                //     'input':inputClone.slice(),
                                //     'relation':'=',
                                //     'output':outp.slice()
                                // });
                                if(j == 0) {
                                    console.error('error');
                                    $scope.error = "Error! Wrong cycle declaration!";
                                    return 0;
                                } else {

                                    counter++;
                                    var el = inputClone.splice(0,1);
                                    outp = outp.concat(el);
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'=',
                                        'output':outp.slice()
                                    });

                                    i += j + 1;
                                    break;
                                }
                            } else if ((input[i+j] == ')') && (openBrackets > 0) && (opp == true)) {
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                outp.pop();
                                outp.pop();
                                outp.pop();
                                outp.push('<множ>')
                                // var el = inputClone.splice(0,1);
                                // outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                openBrackets--;
                                j++;
                            } else if ((input[i+j] == '(') && (idp == true)) {
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'<',
                                    'output':outp.slice()
                                });
                                openBrackets++;
                                j++;
                            } else if ((input[i+j] == 'id' || input[i+j] == 'con') && (idp == true)) {
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                counter++;
                                //var el = inputClone.splice(0,1);
                                //outp = outp.concat(el);
                                outp.pop();
                                outp.push('<множ>');
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'<',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length-2] == "+" || outp[outp.length-2] == '-') {
                                    if(outp[outp.length-3] == "<множ>" || outp[outp.length-3] == '<терм>') {
                                        counter++;
                                        //var el = inputClone.splice(0,1);
                                        //outp = outp.concat(el);
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<терм>');
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'<',
                                            'output':outp.slice()
                                        });
                                    }
                                } else if(outp[outp.length-2] == "*" || outp[outp.length-2] == '/') {
                                    if(outp[outp.length-3] == "<врж>") {
                                        counter++;
                                        //var el = inputClone.splice(0,1);
                                        //outp = outp.concat(el);
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<врж>');
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'=',
                                            'output':outp.slice()
                                        });
                                    }
                                }
                                idp = false;
                                opp = true;
                                j++;
                            } else if ((input[i+j] == '+' || input[i+j] == '-'
                                        || input[i+j] == '*'|| input[i+j] == '/') &&
                                        (opp == true)) {
                                idp = true;
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length-2] == "<множ>") {
                                    counter++;
                                    //var el = inputClone.splice(0,1);
                                    //outp = outp.concat(el);
                                    outp[outp.length-2] = "<терм>";
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                if(outp[outp.length-1] == "*" || outp[outp.length-1] == "/") {
                                    counter++;
                                    //var el = inputClone.splice(0,1);
                                    //outp = outp.concat(el);
                                    outp[outp.length-2] = "<врж>";
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                opp = false;
                                j++;
                            } else {
                                console.error('error');
                                $scope.error = "Error! Wrong cycle declaration!";
                                return 0;
                            }
                        }
                        j = 0;
                        idp = true;
                        opp = false;
                        while (true) {
                            console.log("input[" + (i+j) + "] = " + input[i+j]);
                            if(input[i+j] == "do" && openBrackets == 0) {
                                if(j == 0) {
                                    console.error('error');
                                    $scope.error = "Error! Wrong cycle declaration!";
                                    return 0;
                                } else {
                                    counter++;
                                    var el = inputClone.splice(0,1);
                                    outp = outp.concat(el);
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'=',
                                        'output':outp.slice()
                                    });
                                    console.log("input");
                                    console.log(inputClone.slice());
                                    console.log("output");
                                    console.log(outp.slice());

                                    i += j + 1;
                                    break;
                                }
                            } else if ((input[i+j] == ')') && (openBrackets > 0) && (opp == true)) {
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                outp.pop();
                                outp.pop();
                                outp.pop();
                                outp.push('<множ>')
                                // var el = inputClone.splice(0,1);
                                // outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                openBrackets--;
                                j++;
                            } else if ((input[i+j] == '(') && (idp == true)) {
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'<',
                                    'output':outp.slice()
                                });
                                openBrackets++;
                                j++;
                            } else if ((input[i+j] == 'id' || input[i+j] == 'con') && (idp == true)) {
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                                counter++;
                                //var el = inputClone.splice(0,1);
                                //outp = outp.concat(el);
                                outp.pop();
                                outp.push('<множ>');
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'<',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length-2] == "+" || outp[outp.length-2] == '-') {
                                    if(outp[outp.length-3] == "<множ>" || outp[outp.length-3] == '<терм>') {
                                        counter++;
                                        //var el = inputClone.splice(0,1);
                                        //outp = outp.concat(el);
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<терм>');
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'<',
                                            'output':outp.slice()
                                        });
                                    }
                                } else if(outp[outp.length-2] == "*" || outp[outp.length-2] == '/') {
                                    if(outp[outp.length-3] == "<врж>") {
                                        counter++;
                                        //var el = inputClone.splice(0,1);
                                        //outp = outp.concat(el);
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<врж>');
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'=',
                                            'output':outp.slice()
                                        });
                                    }
                                }
                                idp = false;
                                opp = true;
                                j++;
                            } else if ((input[i+j] == '+' || input[i+j] == '-'
                                        || input[i+j] == '*'|| input[i+j] == '/') &&
                                        (opp == true)) {

                                idp = true;
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                if(outp[outp.length-2] == "<множ>") {
                                    counter++;
                                    //var el = inputClone.splice(0,1);
                                    //outp = outp.concat(el);
                                    outp[outp.length-2] = "<терм>";
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                if(outp[outp.length-1] == "*" || outp[outp.length-1] == "/") {
                                    counter++;
                                    //var el = inputClone.splice(0,1);
                                    //outp = outp.concat(el);
                                    outp[outp.length-2] = "<врж>";
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'>',
                                        'output':outp.slice()
                                    });
                                }
                                opp = false;
                                j++;
                            } else {
                                console.error('error');
                                $scope.error = "Error! Wrong cycle declaration!";
                                return 0;
                            }
                        }
                    }
                }
            } else if(input[i] == 'if') {
                counter++;
                var el = inputClone.splice(0,1);
                outp = outp.concat(el);
                $scope.synthOutput.push({
                    'step':counter,
                    'input':inputClone.slice(),
                    'relation':'=',
                    'output':outp.slice()
                });
                if(input[i+1] == '(') {
                    counter++;
                    var el = inputClone.splice(0,1);
                    outp = outp.concat(el);
                    $scope.synthOutput.push({
                        'step':counter,
                        'input':inputClone.slice(),
                        'relation':'<',
                        'output':outp.slice()
                    });
                    var j = 2;
                    var openBrackets = 0;
                    var idp = true;
                    var opp = false;
                    var countId = 0;
                    var oper = false;
                    while (true) {
                        console.log("input[" + (i+j) + "] = " + input[i+j]);
                        if(input[i+j] == ")" && openBrackets == 0) {
                            counter++;
                            outp.pop();
                            outp.pop();
                            outp.pop();
                            // var el = inputClone.splice(0,1);
                            // outp = outp.concat(el);
                            outp.push('<отношение>')
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'=',
                                'output':outp.slice()
                            });
                            if(j == 2) {
                                console.error('error');
                                $scope.error = "Error! Wrong if declaration!";
                                return 0;
                            } else if(input[i+j+1] == 'goto') {
                                counter++;
                                var el = inputClone.splice(0,1);
                                outp = outp.concat(el);
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'=',
                                    'output':outp.slice()
                                });
                                if(input[i+j+2] == 'label') {
                                    counter++;
                                    var el = inputClone.splice(0,1);
                                    outp = outp.concat(el);
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'=',
                                        'output':outp.slice()
                                    });
                                    if(input[i+j+3] == ';') {
                                        counter++;
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<условие>')
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                        counter++;
                                        var el = inputClone.splice(0,1);
                                        outp = outp.concat(el);
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'=',
                                            'output':outp.slice()
                                        });
                                        counter++;
                                        // var el = inputClone.splice(0,1);
                                        // outp = outp.concat(el);
                                        outp.pop();
                                        outp.pop();
                                        outp.push('<непомеченныйоператор>')
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'=',
                                            'output':outp.slice()
                                        });
                                        if(outp[outp.length - 2] == ':') {
                                            counter++;
                                            outp.pop();
                                            outp.pop();
                                            outp.pop();
                                            outp.push("<label>");
                                            $scope.synthOutput.push({
                                                'step':counter,
                                                'input':inputClone.slice(),
                                                'relation':'>',
                                                'output':outp.slice()
                                            });
                                        }
                                        counter++;
                                        outp.pop();
                                        outp.push("<оператор>");
                                        $scope.synthOutput.push({
                                            'step':counter,
                                            'input':inputClone.slice(),
                                            'relation':'>',
                                            'output':outp.slice()
                                        });
                                        if(outp[outp.length - 2] == "<списокоператоров>") {
                                            counter++;
                                            outp.pop();
                                            outp.pop();
                                            outp.push("<списокоператоров>");
                                            $scope.synthOutput.push({
                                                'step':counter,
                                                'input':inputClone.slice(),
                                                'relation':'>',
                                                'output':outp.slice()
                                            });
                                        } else if(outp[outp.length-2] == "do") {
                                            while(outp[outp.length-2] == "do") {
                                                outp.pop();
                                                outp.pop();
                                                outp.pop();
                                                outp.pop();
                                                outp.pop();
                                                outp.pop();
                                                outp.pop();
                                                outp.pop();
                                                outp.pop();
                                                outp.push('<условие>')
                                                // var el = inputClone.splice(0,1);
                                                // outp = outp.concat(el);
                                                $scope.synthOutput.push({
                                                    'step':counter,
                                                    'input':inputClone.slice(),
                                                    'relation':'>',
                                                    'output':outp.slice()
                                                });
                                                counter++;
                                                var el = inputClone.splice(0,1);
                                                outp = outp.concat(el);
                                                $scope.synthOutput.push({
                                                    'step':counter,
                                                    'input':inputClone.slice(),
                                                    'relation':'=',
                                                    'output':outp.slice()
                                                });
                                                counter++;
                                                // var el = inputClone.splice(0,1);
                                                // outp = outp.concat(el);
                                                outp.pop();
                                                outp.pop();
                                                outp.push('<непомеченныйоператор>')
                                                $scope.synthOutput.push({
                                                    'step':counter,
                                                    'input':inputClone.slice(),
                                                    'relation':'=',
                                                    'output':outp.slice()
                                                });
                                                if(outp[outp.length - 2] == ':') {
                                                    counter++;
                                                    outp.pop();
                                                    outp.pop();
                                                    outp.pop();
                                                    outp.push("<label>");
                                                    $scope.synthOutput.push({
                                                        'step':counter,
                                                        'input':inputClone.slice(),
                                                        'relation':'>',
                                                        'output':outp.slice()
                                                    });
                                                }
                                                counter++;
                                                outp.pop();
                                                outp.push("<оператор>");
                                                $scope.synthOutput.push({
                                                    'step':counter,
                                                    'input':inputClone.slice(),
                                                    'relation':'>',
                                                    'output':outp.slice()
                                                });
                                            }
                                            if(outp[outp.length - 2] == "<списокоператоров>") {
                                                counter++;
                                                outp.pop();
                                                outp.pop();
                                                outp.push("<списокоператоров>");
                                                $scope.synthOutput.push({
                                                    'step':counter,
                                                    'input':inputClone.slice(),
                                                    'relation':'>',
                                                    'output':outp.slice()
                                                });
                                            } else {
                                                counter++;
                                                outp.pop();
                                                outp.push("<списокоператоров>");
                                                $scope.synthOutput.push({
                                                    'step':counter,
                                                    'input':inputClone.slice(),
                                                    'relation':'>',
                                                    'output':outp.slice()
                                                });
                                            }
                                        } else {
                                            counter++;
                                            outp.pop();
                                            outp.push("<списокоператоров>");
                                            $scope.synthOutput.push({
                                                'step':counter,
                                                'input':inputClone.slice(),
                                                'relation':'>',
                                                'output':outp.slice()
                                            });
                                        }
                                        if(countId < 2) {
                                            console.error('error');
                                            $scope.error = "Error! Wrong compare declaration!";
                                            return 0;
                                        }
                                        i += j + 4;
                                        break;
                                        //WORKED
                                    } else {
                                        console.error('error');
                                        $scope.error = "Error! Wrong if declaration!";
                                        return 0;
                                    }
                                } else {
                                    console.error('error');
                                    $scope.error = "Error! Wrong if declaration!";
                                    return 0;
                                }
                            } else {
                                console.error('error');
                                $scope.error = "Error! Wrong if declaration!";
                                return 0;
                            }
                        } else if ((input[i+j] == ')') && (openBrackets > 0) && (opp == true)) {
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'=',
                                'output':outp.slice()
                            });
                            outp.pop();
                            outp.pop();
                            outp.pop();
                            outp.push('<множ>')
                            // var el = inputClone.splice(0,1);
                            // outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            openBrackets--;
                            j++;
                        } else if ((input[i+j] == '(') && (idp == true)) {
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'<',
                                'output':outp.slice()
                            });
                            openBrackets++;
                            j++;
                        } else if ((input[i+j] == 'id' || input[i+j] == 'con') && (idp == true)) {
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            counter++;
                            //var el = inputClone.splice(0,1);
                            //outp = outp.concat(el);
                            outp.pop();
                            outp.push('<множ>');
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'<',
                                'output':outp.slice()
                            });
                            if(outp[outp.length-2] == "+" || outp[outp.length-2] == '-') {
                                if(outp[outp.length-3] == "<множ>" || outp[outp.length-3] == '<терм>') {
                                    counter++;
                                    //var el = inputClone.splice(0,1);
                                    //outp = outp.concat(el);
                                    outp.pop();
                                    outp.pop();
                                    outp.pop();
                                    outp.push('<терм>');
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'<',
                                        'output':outp.slice()
                                    });
                                }
                            } else if(outp[outp.length-2] == "*" || outp[outp.length-2] == '/') {
                                if(outp[outp.length-3] == "<врж>") {
                                    counter++;
                                    //var el = inputClone.splice(0,1);
                                    //outp = outp.concat(el);
                                    outp.pop();
                                    outp.pop();
                                    outp.pop();
                                    outp.push('<врж>');
                                    $scope.synthOutput.push({
                                        'step':counter,
                                        'input':inputClone.slice(),
                                        'relation':'=',
                                        'output':outp.slice()
                                    });
                                }
                            }
                            idp = false;
                            opp = true;
                            if(countId == 0) {
                                countId++;
                            } else if (oper) {
                                countId++;
                            }
                            j++;
                        } else if ((input[i+j] == '+' || input[i+j] == '-'
                                    || input[i+j] == '*'|| input[i+j] == '/') &&
                                    (opp == true)) {
                            idp = true;
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'=',
                                'output':outp.slice()
                            });
                            if(outp[outp.length-2] == "<множ>") {
                                counter++;
                                //var el = inputClone.splice(0,1);
                                //outp = outp.concat(el);
                                outp[outp.length-2] = "<терм>";
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                            }
                            if(outp[outp.length-1] == "*" || outp[outp.length-1] == "/") {
                                counter++;
                                //var el = inputClone.splice(0,1);
                                //outp = outp.concat(el);
                                outp[outp.length-2] = "<врж>";
                                $scope.synthOutput.push({
                                    'step':counter,
                                    'input':inputClone.slice(),
                                    'relation':'>',
                                    'output':outp.slice()
                                });
                            }
                            opp = false;
                            j++;
                        } else if ((input[i+j] == '>' || input[i+j] == '<'
                                    || input[i+j] == '}' || input[i+j] == '{'
                                    || input[i+j] == '~'|| input[i+j] == '=') &&
                                    (opp == true) && (openBrackets == 0)) {
                            idp = true;
                            counter++;
                            var el = inputClone.splice(0,1);
                            outp = outp.concat(el);
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'>',
                                'output':outp.slice()
                            });
                            counter++;
                            //var el = inputClone.splice(0,1);
                            //outp = outp.concat(el);
                            outp.pop();
                            outp.push('<знакотношения>');
                            $scope.synthOutput.push({
                                'step':counter,
                                'input':inputClone.slice(),
                                'relation':'=',
                                'output':outp.slice()
                            });
                            oper = true;
                            opp = false;
                            j++;
                        } else {
                            console.error('error');
                            $scope.error = "Error! Wrong if declaration!";
                            return 0;
                        }
                    }
                }
            } else {
                console.log("input[" + i + "] = " + input[i]);
                console.error('error');
                $scope.error = "Error! Wrong operator declaration!";
                return 0;
            }
        }
        console.log("input[" + i + "] = " + input[i]);
        counter++;
        var el = inputClone.splice(0,1);
        outp = outp.concat(el);
        $scope.synthOutput.push({
            'step':counter,
            'input':inputClone.slice(),
            'relation':'>',
            'output':outp.slice()
        });
        counter++;
        outp = ['<программа>'];
        $scope.synthOutput.push({
            'step':counter,
            'input':inputClone.slice(),
            'relation':'',
            'output':outp.slice()
        });
    }

    $scope.synthAn1 = function() {
        console.log("TEST SOURCE");
        var input = testSource.slice();
        input.push('#');
        console.log(input);
        if($scope.error == 'No error!') {
            console.log('no error');
            for(var i = 0; i < input.length; i++) {
                for(var j = 0; j < $scope.vars.length; j++)
                    if($scope.vars[j].variable == input[i]) {
                        input[i] = 'id';
                        console.log('found var: ' + $scope.vars[j].variable);
                    }

                for(var j = 0; j < $scope.labels.length; j++)
                    if($scope.labels[j].variable == input[i]) {
                        input[i] = 'label';
                        console.log('found label: ' + $scope.labels[j].variable);
                    }

                for(var j = 0; j < $scope.consts.length; j++)
                    if($scope.consts[j].constant == input[i]) {
                        input[i] = 'con';
                        console.log('found con: ' + $scope.consts[j].constant);
                    }
            }
        }
        console.log(input);
        var rel = '';
        var output = [];
        var step = 0;
        var stackSize = 0;
        while(step < 100 && input.length >= 0) {
            step++;
            console.log("STEP: " + step);
            //console.log(input);
            var elem = input.shift();
            if (elem == alph[0].term) {
                output = elem;
                break;
            }
            var x = -1;
            var y = -1;
            for(var i = 0; i < relations.length; i++) {
                for(var j = 0; j < relations[i].length; j++) {
                    if(input.length > 0) {
                        if((input[0] == relations[i][j].col) && (elem == relations[i][j].row)) {
                            x = i;
                            y = j;
                        }
                    } else {
                        if((elem == relations[i][j].col) && (output[output.length - 1] == relations[i][j].row)) {
                            x = i;
                            y = j;
                        }
                    }
                }
            }
            if ((x >= 0) && (y >= 0)) {
                console.log(step);
                console.log("Element: " + elem);
                console.log("Compare: " + input[0]);
                console.log("Relation: " + relations[x][y].value);
                console.log(x + " " + y);
                console.log(elem);
                if((relations[x][y].value == "<")) {
                    rel = "<";
                    output.push(elem);
                    var data = {
                        'input':input.slice(),
                        'output':output.slice(),
                        'step':step,
                        'relation':'<'
                    }
                    $scope.synthOutput.push(data);
                    elem = '';
                } else if (relations[x][y].value == ">") {
                    rel = ">";
                    var data = {
                        'input':input.slice(),
                        'output':output.slice(),
                        'step':step,
                        'relation':'>'
                    }
                    $scope.synthOutput.push(data);
                    console.log("relation '>' and stackSize: " + stackSize);
                    var stack = [];

                    //if(stackSize == 0) {
                        stack.push(elem);
                        // for(var i = 0; i < output.length; i++) {
                        //     stack.unshift(output[output.length - i - 1]);
                        // }
                        var reduced = '';
                        if(stackSize > 0) {
                            for (var i = 0; i < stackSize; i++) {
                                stack.unshift(output[output.length - i - 1]);
                            }
                            reduced = tryReduce(stack);
                            console.log(stack);
                            if (reduced) {
                                console.log("REDUCED");
                                console.log(reduced);
                                output.splice(output.length - i, i);

                                input.unshift(reduced);
                                console.log(output);
                            }
                            if(!reduced) {
                                stack = [];
                                stack.push(elem);
                            }
                        }
                        if(!reduced)
                        for (var i = 0; i < output.length + 1; i++) {
                            if (i > 0) stack.unshift(output[output.length - i]);
                            reduced = tryReduce(stack);
                            console.log(stack);
                            if (reduced) {
                                console.log("REDUCED");
                                console.log(reduced);
                                output.splice(output.length - i, i);

                                input.unshift(reduced);
                                console.log(output);
                                break;
                            }
                        }

                    var data = {
                        'input':input.slice(),
                        'output':output.slice(),
                        'step':step,
                        'relation':rel
                    }
                    $scope.synthOutput.push(data);
                    stackSize = 0;
                } else if (relations[x][y].value == "=") {
                    // elem = input.shift();
                    rel = "=";
                    output.push(elem);
                    var data = {
                        'input':input.slice(),
                        'output':output.slice(),
                        'step':step,
                        'relation':'='
                    }
                    $scope.synthOutput.push(data);
                    elem = '';
                    stackSize++;
                } else {
                    $scope.error = "Error in synth analizator, can't stand " + elem + " next to " + input[0];
                    return 0;
                }
            } else {
                $scope.error = "Error in synth analizator, at:" + output[output.length-1] +
                " and " + input[0];
            }

        }


        var data = {
            'input':input.slice(),
            'output':output.slice(),
            'step':step,
            'relation':rel
        }

        $scope.synthOutput.push(data);
    }
    //synthAn1();
    //synthAn();

    $scope.poliz = '';


    $scope.buildPoliz = function() {
        testSource = $scope.source.split("\n").join(" ").split(" ");
        console.log(testSource);
        var beginPoliz = testSource.indexOf('begin') + 1;
        var polizSource = testSource.map(num=>num);
        var priors = [
            {
                'elem':'(',
                'value':0,
                'index':0
            },{
                'elem':')',
                'value':1,
                'index':1
            },{
                'elem':':=',
                'value':2,
                'index':2
            },{
                'elem':'or',
                'value':3,
                'index':3
            },{
                'elem':'and',
                'value':4,
                'index':4
            },{
                'elem':'not',
                'value':5,
                'index':5
            },{
                'elem':'<',
                'value':6,
                'index':6
            },{
                'elem':'>',
                'value':6,
                'index':7
            },{
                'elem':'{',
                'value':6,
                'index':8
            },{
                'elem':'}',
                'value':6,
                'index':9
            },{
                'elem':'=',
                'value':6,
                'index':10
            },{
                'elem':'~',
                'value':6,
                'index':11
            },{
                'elem':'+',
                'value':7,
                'index':12
            },{
                'elem':'-',
                'value':7,
                'index':13
            },{
                'elem':'*',
                'value':8,
                'index':14
            },{
                'elem':'/',
                'value':8,
                'index':15
            },{
                'elem':'if',
                'value':0,
                'index':16
            },{
                'elem':'goto',
                'value':1,
                'index':17
            }
        ]
        var operations = ['(',')',':=','or','and','not','<','>','{','}','=','~','+','-','*','/','if','goto']
        polizSource.splice(0, beginPoliz);
        polizSource.pop();
        var output = [];
        var stack = [];
        var cycle = 0;
        var read = false;
        var write = false;
        var rIndex = 0;
        var mIndex = 0;
        var param = "";
        for (var i = 0; i < polizSource.length; i++) {
            //console.log(polizSource[i]);
            if(polizSource[i] == ';') {
                read = false;
                write = false;
                //console.log(stack.slice());
                while (stack.length != 0) {
                    // var max = stack[0].value;
                    // var maxInd = 0;
                    // for (var j = 0; j < stack.length; j++) {
                    //     if (max < stack[j].value) {
                    //         max = stack[j].value;
                    //         maxInd = j;
                    //     }
                    // }
                    // output.push(stack[maxInd].elem);
                    // console.log(output);
                    // stack.splice(maxInd, 1);
                    var ele = stack.pop();
                    //console.log("output: " + ele.elem);
                    if(ele.elem == "(") {

                    } else if (ele.elem == ")") {

                    } else if (ele.elem == "goto") {
                        output.push('УПЛ');
                    } else if (ele.elem == "if") {

                    } else {
                        output.push(ele.elem);
                    }
                }
                while(cycle > 0) {

                    output.push("m" + (cycle*3 - 3));
                    output.push("БП");
                    output.push("m" + (cycle*3 - 1) + ":");
                    cycle--;
                    // console.log("YYY");
                    // console.log("YYY");
                    // console.log("YYY");
                }
            } else if (polizSource[i] == ')') {
                // console.log(stack.slice());
                var lastItem = stack.pop();
                while (lastItem.elem != '(') {
                    // var max = stack[0].value;
                    // var maxInd = 0;
                    // for (var j = 0; j < stack.length; j++) {
                    //     if (max < stack[j].value) {
                    //         max = stack[j].value;
                    //         maxInd = j;
                    //     }
                    // }
                    // output.push(stack[maxInd].elem);
                    // console.log(output);
                    // stack.splice(maxInd, 1);
                    //console.log('output: ' + lastItem.elem);
                    output.push(lastItem.elem);
                    lastItem = stack.pop();
                }
            } else if (polizSource[i] == 'for') {
                cycle++;
            } else if (polizSource[i] == 'read') {
                read = true;
            } else if (polizSource[i] == 'write') {
                write = true;
            }
            var operIndex = operations.indexOf(polizSource[i]);
            // console.log(operIndex);
            if (operIndex >= 0) {
                // console.log(priors[operIndex].value);
                if(stack.length == 0) {
                    stack.push(priors[operIndex]);
                } else {
                    // console.log(stack.slice());
                    if(priors[stack[stack.length - 1].index].value == priors[operIndex].value) {
                        var ele = stack[stack.length - 1];
                        // console.log("vetka1, out pushed: " + ele.elem + "; in stack pushed: " + priors[operIndex].elem);
                        // console.log("compared: " + priors[ele.index].elem + " and " + priors[operIndex].elem);
                        if(ele.elem == ")") {

                            stack.push(priors[operIndex]);
                        } else if (ele.elem == 'if') {

                            stack.push(priors[operIndex]);
                            stack.push(priors[5]);
                        } else {
                            ele = stack.pop();
                            output.push(ele.elem);
                            stack.push(priors[operIndex]);
                        }
                    } else if(priors[stack[stack.length - 1].index].value > priors[operIndex].value) {
                        var ele = stack[stack.length - 1];
                        // console.log("vetka2, out pushed: " + ele.elem + "; in stack pushed: " + priors[operIndex].elem);
                        // console.log("compared: " + priors[stack[stack.length - 1].index].elem + " and " + priors[operIndex].elem);
                        if(priors[operIndex].elem != "(" && ele.elem != ")") {
                            ele = stack.pop();
                            output.push(ele.elem);
                        }
                        if (priors[operIndex].elem != ')') {
                            stack.push(priors[operIndex]);
                        }
                    } else if(priors[stack[stack.length - 1].index].value < priors[operIndex].value) {
                        // var ele = stack.pop();
                        // console.log("vetka3, in stack pushed: " + priors[operIndex].elem);
                        // console.log("compared: " + priors[stack[stack.length - 1].index].elem + " and " + priors[operIndex].elem);
                        stack.push(priors[operIndex]);
                    }
                }
            } else {
                if(polizSource[i] == ';') {

                } else if(polizSource[i] == '@') {

                } else if(polizSource[i] == 'read') {
                    read = true;
                } else if(polizSource[i] == 'write') {
                    write = true;
                } else if(polizSource[i] == ',') {

                } else if(polizSource[i] == 'for') {
                    param = polizSource[i+1];
                } else if(polizSource[i] == 'by') {
                    // var value = output[output.length-1];
                    output.push(stack.pop().elem);
                    output.push("r" + rIndex);
                    output.push(1);
                    output.push(":=");
                    output.push("m" + mIndex + ":");
                    output.push("r" + (rIndex + 1));
                } else if(polizSource[i] == 'to') {
                    // var value = output[output.length-1];
                    output.push(":=");
                    output.push("r" + rIndex);
                    output.push(0);
                    output.push("=");
                    output.push("m" + (mIndex+1));
                    output.push("УПЛ");
                    output.push(param);
                    output.push(param);
                    output.push("r" + (rIndex + 1));
                    output.push("+");
                    output.push(":=");
                    output.push("m" + (mIndex+1) + ":");
                    output.push("r" + rIndex);
                    output.push(0);
                    output.push(":=");
                    output.push(param);
                } else if(polizSource[i] == 'do') {
                    //console.log("DO");
                    // var value = output[output.length-1];
                    output.push("-");
                    output.push("r" + (rIndex + 1));
                    output.push("*");
                    output.push(0);
                    output.push("{");
                    output.push("m" + (mIndex+2));
                    output.push("УПЛ");
                    rIndex += 2;
                    mIndex += 3;
                } else {
                    output.push(polizSource[i]);
                    if(read) output.push("read");
                    if(write) output.push("write");
                }
            }
        }
        $scope.poliz = output.join(" ");
    };

    $scope.evalPoliz = function() {
        //console.log(typeof $scope.poliz);
        var source = $scope.poliz.split(" ").slice();
        // console.log($scope.poliz);
        var stack = [];
        var vars = [];
        var i = 0;
        while(i < source.length) {
            console.log("source element of poliz:" + source[i]);
            if(source[i] == "read") {
                var elem = stack.pop();
                vars[elem] = prompt("Введите значение переменной \"" + elem + "\":");
            } else if(source[i] == "write") {
                var elem = stack.pop();
                $scope.output += (elem + ": " + vars[elem] + '\n');
            } else if(source[i] == "+") {
                var elem1 = stack.pop();
                var elem2 = stack.pop();
                if(vars[elem2]) elem2 = vars[elem2];
                if(vars[elem1]) elem1 = vars[elem1];
                stack.push((+elem2) + (+elem1));
            } else if(source[i] == "-") {
                var elem1 = stack.pop();
                var elem2 = stack.pop();
                if(vars[elem2]) elem2 = vars[elem2];
                if(vars[elem1]) elem1 = vars[elem1];
                stack.push((+elem2) - (+elem1));
            } else if(source[i] == "*") {
                var elem1 = stack.pop();
                var elem2 = stack.pop();
                if(vars[elem2]) elem2 = vars[elem2];
                if(vars[elem1]) elem1 = vars[elem1];
                stack.push((+elem2) * (+elem1));
            } else if(source[i] == "/") {
                var elem1 = stack.pop();
                var elem2 = stack.pop();
                if(vars[elem2]) elem2 = vars[elem2];
                if(vars[elem1]) elem1 = vars[elem1];
                stack.push((+elem2) / (+elem1));
            } else if(source[i] == "=") {
                var elem1 = stack.pop();
                var elem2 = stack.pop();
                if(vars[elem2]) elem2 = vars[elem2];
                if(vars[elem1]) elem1 = vars[elem1];
                var value = (+elem2) == (+elem1);
                stack.push(value);
                console.log("value:" + value);
            } else if(source[i] == "<") {
                var elem1 = stack.pop();
                var elem2 = stack.pop();
                if(vars[elem2]) elem2 = vars[elem2];
                if(vars[elem1]) elem1 = vars[elem1];
                stack.push((+elem2) < (+elem1));
            } else if(source[i] == ">") {
                var elem1 = stack.pop();
                var elem2 = stack.pop();
                if(vars[elem2]) elem2 = vars[elem2];
                if(vars[elem1]) elem1 = vars[elem1];
                stack.push((+elem2) > (+elem1));
            } else if(source[i] == "{") {
                var elem1 = stack.pop();
                var elem2 = stack.pop();
                if(vars[elem2]) elem2 = vars[elem2];
                if(vars[elem1]) elem1 = vars[elem1];
                stack.push((+elem2) <= (+elem1));
            } else if(source[i] == "}") {
                var elem1 = stack.pop();
                var elem2 = stack.pop();
                if(vars[elem2]) elem2 = vars[elem2];
                if(vars[elem1]) elem1 = vars[elem1];
                stack.push((+elem2) >= (+elem1));
            } else if(source[i] == "not") {
                var elem1 = stack.pop();
                if(vars[elem1]) elem1 = vars[elem1];
                var value = !(+elem1);
                stack.push(value);
                console.log("value:" + value);
            } else if(source[i] == "УПЛ") {
                var elem1 = stack.pop();
                var elem2 = stack.pop();
                console.log("elem1: " + elem1);
                console.log("elem2: " + elem2);
                console.log(typeof elem2);
                //if(vars[elem2]) elem2 = vars[elem2];
                //console.log("value: " + (+elem2));
                if(elem2 == false) {
                    console.log("inside jump");
                    var got0 = source.indexOf(elem1 + ":");
                    if(got0 >= 0) {
                        console.log("jump to: " + (got0));
                        i = got0;
                    }
                }
            } else if(source[i] == "БП") {
                var elem1 = stack.pop();
                console.log("elem1: " + elem1);
                var got0 = source.indexOf(elem1 + ":");
                if(got0 >= 0) {
                    console.log("jump to: " + (got0));
                    i = got0;
                }
            } else if(source[i] == ":=") {
                var elem2 = stack.pop();
                if(vars[elem2]) elem2 = vars[elem2];
                var elem1 = stack.pop();
                vars[elem1] = elem2;
            } else if(source[i] == "write") {
                var elem = stack.pop();
                $scope.output += (vars[elem] + "\n");
            } else {
                stack.push(source[i]);
            }
            i++;
        }
    };

    $scope.output = '';
    $scope.split = [];
    $scope.lexAn = function() {
        $scope.output = $scope.source;
        console.log($scope.output);
        var stack = "";
        var delimeters = [';',',','(',')','+','-','*','/','=','~','<','>','}','{', ':', '@'];
        var specWords = ['program', 'var', 'begin', 'end', 'write', 'read', 'do', 'by', 'to', 'if', 'goto', ':='];
        specWords = specWords.concat(delimeters);
        delimeters = delimeters.concat(['.','E'])
        var i = 0;
        while(i < $scope.output.length) {
            // console.log($scope.output.charCodeAt(i));
            if (delimeters.indexOf($scope.output[i]) >= 0) {
                if($scope.output[i] == ":" && $scope.output[i+1] == "=") {
                    var s1 = $scope.output.substr(0, i);
                    var s2 = $scope.output[i] + $scope.output[i+1];
                    var s3 = $scope.output.substr(i+2, $scope.output.length - (i+2));
                    var s4 = s1 + " " + s2 + " " + s3;
                    console.log($scope.output[i]);
                    $scope.output = s4;
                    i++;
                    i+=s2.length;
                } else {
                    var s1 = $scope.output.substr(0, i);
                    var s2 = $scope.output[i];
                    var s3 = $scope.output.substr(i+1, $scope.output.length - (i+1));
                    var s4 = s1 + " " + s2 + " " + s3;
                    console.log($scope.output[i]);
                    $scope.output = s4;
                    i++;
                    i+=s2.length;
                }
            } else if ($scope.output[i] == '\n') {
                var s1 = $scope.output.substr(0, i);
                var s2 = $scope.output.substr(i+1, $scope.output.length - (i+1));
                var s4 = s1 + " " + s2;
                $scope.output = s4;
                console.log("enter");
            }
            i++;
        }
        var splitted = $scope.output.split(" ");
        var splited = [];
        var vars = [];
        var consts = [];
        for (var i = 0; i < splitted.length; i++) {
            if (splitted[i]) {
                splited.push(splitted[i]);
            }
        }

        console.log($scope.output);
        console.log(splited);
        console.log("\n");
        console.log(specWords);
        var passVar = false;
        var varPatt = new RegExp(/([a-z])([a-z0-9]+)?/);
        var constPatt = new RegExp();
        for (var i = 0; i < splited.length; i++) {
            var lexem = {
                'lexCode':'',
                'lex':'',
                'varCode':'',
                'constCode':'',
            };
            var lexCode = specWords.indexOf(splited[i]);
            if(lexCode >= 0) {
                if(lexCode == 2) passVar = true;
                lexem.lex = splited[i];
                lexem.lexCode = lexCode + 1;
            } else {
                if(!passVar) {
                    if(varPatt.test(splited[i])) {
                        vars.push(splited[i]);
                        lexem.lex = 'id';
                        lexem.lexCode = 30;
                        lexem.varCode = vars.length;
                    }
                } else {
                    if(varPatt.test(splited[i])) {
                        var index = vars.indexOf(splited[i]);
                        if(index>=0) {
                            lexem.lex = 'id';
                            lexem.lexCode = 30;
                            lexem.varCode = index+1;
                        }
                    } else {
                        consts.push(splited[i])
                        lexem.lex = 'const';
                        lexem.lexCode = 31;
                        lexem.constCode = consts.length;
                    }
                }
            }
            $scope.split.push(lexem);
        }
        $scope.vars = vars;
        $scope.consts = consts;
    }

    $scope.lexAn1 = function() {
        $scope.allowSynth = true;
        $scope.output = '';
        var delimeters = [';',',','(',')','+','-','*','/','=','~','<','>','}','{', ':', '@'];
        var specWords = ['program', 'var', 'begin', 'end', 'write', 'read', 'for', 'do', 'by', 'to', 'if', 'goto', ':='];
        specWords = specWords.concat(delimeters);
        $scope.split = [];
        $scope.vars = [];
        $scope.labels = [];
        $scope.consts = [];
        var passBegin = false;
        var isLabel = false;
        var state = 0;
        var lexCount = 1;
        var varCount = 1;
        var labCount = 1;
        var constCount = 1;
        var lex = '';
        var lexem = {
            'lexCode':'',
            'lex':'',
            'varCode':'',
            'constCode':'',
        };
        var i = 0;
        while(i < $scope.source.length) {
            switch(state)
            {
                case -1: {
                    lex = '';

                } break;
                case 0: {
                    lex = '';
                    lexem = {
                        'lexCode':'',
                        'lex':'',
                        'varCode':'',
                        'constCode':'',
                    };
                    if (($scope.source[i] >= 'a') && ($scope.source[i] <= 'z')) {
                        lex += ($scope.source[i]);
                        state = 1;
                    } else if (($scope.source[i] >= '0') && ($scope.source[i] <= '9')) {
                        lex += $scope.source[i];
                        state = 3;
                    } else if ($scope.source[i] == '.') {
                        lex += $scope.source[i];
                        state = 5;
                    } else if (delimeters.indexOf($scope.source[i])>=0) {
                        if(($scope.source[i] == ':') && ($scope.source[i+1] == '=')) {
                            i++;
                            lex = ":=";
                            lexem.varCode = specWords.indexOf(lex);
                            lexem.lexCode = lexCount;
                            lexCount++;
                            lexem.lex = lex;
                            $scope.split.push(lexem);
                        } else if($scope.source[i] == '@'){
                            lex = $scope.source[i];
                            isLabel = true;
                            lexem.varCode = specWords.indexOf(lex);
                            lexem.lexCode = lexCount;
                            lexCount++;
                            lexem.lex = lex;
                            $scope.split.push(lexem);
                        } else {
                            lex = $scope.source[i];
                            lexem.varCode = specWords.indexOf(lex);
                            lexem.lexCode = lexCount;
                            lexCount++;
                            lexem.lex = lex;
                            $scope.split.push(lexem);
                        }
                    }
                } break;
                case 1: {
                    if (($scope.source[i] >= 'a') && ($scope.source[i] <= 'z')) {
                        lex += ($scope.source[i]);
                        // state = 1;
                    } else if (($scope.source[i] >= '0') && ($scope.source[i] <= '9')) {
                        lex += $scope.source[i];
                        // state = 3;
                    } else {
                        state = 0;
                        lexem.varCode = specWords.indexOf(lex);
                        if(lexem.varCode >= 0) {
                            lexem.varCode++;
                            lexem.lexCode = lexCount;
                            lexCount++;
                            lexem.lex = lex;
                            if (lex == 'begin') {
                                passBegin = true;
                            }
                            $scope.split.push(lexem);
                            i--;
                        } else {
                            if(!passBegin) {
                                var variable = {
                                    'index':varCount,
                                    'variable':lex
                                }
                                varCount++;
                                $scope.vars.push(variable);
                                lexem.varCode = 31;
                                lexem.constCode = varCount - 1;
                                lexem.lexCode = lexCount;
                                lexCount++;
                                lexem.lex = lex + "(id)";
                                $scope.split.push(lexem);
                                i--;
                            } else if (isLabel) {
                                var variable = {
                                    'index':labCount,
                                    'variable':lex
                                }
                                labCount++;
                                $scope.labels.push(variable);
                                lexem.varCode = 32;
                                lexem.lexCode = lexCount;
                                lexem.constCode = labCount - 1;
                                lexCount++;
                                isLabel = false;
                                lexem.lex = lex + "(label)";
                                $scope.split.push(lexem);
                                i--;
                            } else {
                                var isVar = false;
                                for (var j = 0; j < $scope.vars.length; j++) {
                                    if ($scope.vars[j].variable == lex) {
                                        lexem.varCode = 31;
                                        lexem.lexCode = lexCount;
                                        lexem.constCode = j + 1;
                                        lexCount++;
                                        lexem.lex = lex + "(id)";
                                        $scope.split.push(lexem);
                                        i--;
                                        isVar = true;
                                    }
                                }
                                if(isVar == false) {
                                    for (var j = 0; j < $scope.labels.length; j++) {
                                        if ($scope.labels[j].variable == lex) {
                                            lexem.varCode = 32;
                                            lexem.lexCode = lexCount;
                                            lexem.constCode = j + 1;
                                            lexCount++;
                                            lexem.lex = lex + "(label)";
                                            $scope.split.push(lexem);
                                            i--;
                                            isVar = true;
                                        }
                                    }
                                }
                                if(isVar == false) {
                                    state = -1;
                                    $scope.error = "Unknown variable at " + lexCount;
                                }
                            }
                        }
                    }
                } break;
                case 3: {
                    if (($scope.source[i] >= '0') && ($scope.source[i] <= '9')) {
                        lex += $scope.source[i];
                        // state = 3;
                    } else if ($scope.source[i] == '.') {
                        lex += $scope.source[i];
                        state = 4;
                    } else if ($scope.source[i] == 'E') {
                        lex += $scope.source[i];
                        state = 7;
                    }else {
                        var constant = {
                            'index':constCount,
                            'constant':lex
                        }
                        constCount++;
                        $scope.consts.push(constant);
                        state = 0;
                        lexem.varCode = 30;
                        lexem.constCode = constCount - 1;
                        lexem.lexCode = lexCount;
                        lexCount++;
                        lexem.lex = lex + "(const)";
                        $scope.split.push(lexem);
                        i--;
                    }
                } break;
                case 4: {
                    if (($scope.source[i] >= '0') && ($scope.source[i] <= '9')) {
                        lex += $scope.source[i];
                        state = 6;
                    } else {
                        var constant = {
                            'index':constCount,
                            'constant':lex
                        }
                        constCount++;
                        $scope.consts.push(constant);
                        lexem.constCode = constCount - 1;
                        state = 0;
                        lexem.varCode = 30;
                        lexem.lexCode = lexCount;
                        lexCount++;
                        lexem.lex = lex + "(const)";
                        $scope.split.push(lexem);
                        i--;
                    }
                } break;
                case 5: {
                    if (($scope.source[i] >= '0') && ($scope.source[i] <= '9')) {
                        lex += $scope.source[i];
                        state = 6;
                    } else {
                        var constant = {
                            'index':constCount,
                            'constant':lex
                        }
                        constCount++;
                        $scope.consts.push(constant);
                        lexem.constCode = constCount - 1;
                        state = 0;
                        lexem.varCode = 30;
                        lexem.lexCode = lexCount;
                        lexCount++;
                        lexem.lex = lex + "(const)";
                        $scope.split.push(lexem);
                        i--;
                    }
                } break;
                case 6: {
                    if (($scope.source[i] >= '0') && ($scope.source[i] <= '9')) {
                        lex += $scope.source[i];
                    } else if ($scope.source[i] == 'E') {
                        lex += $scope.source[i];
                        state = 7;
                    } else {
                        var constant = {
                            'index':constCount,
                            'constant':lex
                        }
                        constCount++;
                        $scope.consts.push(constant);
                        lexem.constCode = constCount - 1;
                        state = 0;
                        lexem.varCode = 30;
                        lexem.lexCode = lexCount;
                        lexCount++;
                        lexem.lex = lex + "(const)";
                        $scope.split.push(lexem);
                        i--;
                    }
                } break;
                case 7: {
                    if (($scope.source[i] >= '0') && ($scope.source[i] <= '9')) {
                        lex += $scope.source[i];
                        state = 9;
                    } else if (($scope.source[i] == '+') || ($scope.source[i] == '-')) {
                        lex += $scope.source[i];
                        state = 8;
                    } else {
                        state = -1;
                        $scope.error = "Error in " + lex + ", lexeme number:" + lexCount;
                    }
                } break;
                case 8: {
                    if (($scope.source[i] >= '0') && ($scope.source[i] <= '9')) {
                        lex += $scope.source[i];
                        state = 9;
                    } else {
                        var constant = {
                            'index':constCount,
                            'constant':lex
                        }
                        constCount++;
                        $scope.consts.push(constant);
                        lexem.constCode = constCount - 1;
                        state = 0;
                        lexem.varCode = 30;
                        lexem.lexCode = lexCount;
                        lexCount++;
                        lexem.lex = lex + "(const)";
                        $scope.split.push(lexem);
                        i--;
                    }
                } break;
                case 9: {
                    if (($scope.source[i] >= '0') && ($scope.source[i] <= '9')) {
                        lex += $scope.source[i];
                    } else {
                        var constant = {
                            'index':constCount,
                            'constant':lex
                        }
                        constCount++;
                        $scope.consts.push(constant);
                        lexem.constCode = constCount - 1;
                        state = 0;
                        lexem.varCode = 30;
                        lexem.lexCode = lexCount;
                        lexCount++;
                        lexem.lex = lex + "(const)";
                        $scope.split.push(lexem);
                        i--;
                    }
                } break;
            }
            i++;
        }
    }
}]);

app.controller("MainCtrl", ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.error = 'No error!'
    $scope.source = ""
    +"program h;\n"
    +"var a,b,c;\n"
    +"begin\n"
    +"@lab:\n"
    +"if(a=b) goto b;\n"
    +"a:=a+1.6E2-14.12;\n"
    +"end";
    $scope.fields = [];
    // $scope.grammar =
    //     '<Z> ::= b <M> b\n'+
    //     '<M> ::= ( <L> | a\n'+
    //     '<L> ::= <M> a )';
    //
    // $scope.testSource = "b ( a a ) b";

    $scope.grammar = '<программа> ::= <name> ; var <список1> begin <список2>\n'+
    '<name> ::= program id\n'+
    '<список1> ::= <списокid> ;\n'+
    '<списокid> ::= id , | <списокid> id , | <списокid> id\n'+
    '<список2> ::= <списокоператоров> ; end\n'+
    '<списокоператоров> ::= <оператор> | <списокоператоров> ; <оператор>\n'+
    '<оператор> ::= <непомеченныйоператор> | <label>\n'+
    '<label> ::= <label1> : <непомеченныйоператор>\n'+
    '<label1> ::= @ label\n'+
    '<непомеченныйоператор> ::= <ввод> | <вывод> | <присвоение> | <цикл> | <условие>\n'+
    '<ввод> ::= read ( <списокread> ) | read ( <врж1> )\n'+
    '<списокread> ::= <списокid>\n'+
    '<вывод> ::= write ( <списокread> ) | write ( <врж1> )\n'+
    '<цикл> ::= <head> <body> ; <оператор>\n'+
    '<head> ::= <head1> =\n'+
    '<head1> ::= do id\n'+
    '<body> ::= <врж1> by <врж1> to <врж1>\n'+
    '<условие> ::= if ( <отношение> ) goto id\n'+
    '<присвоение> ::= id := <врж1>\n'+
    '<отношение> ::= <врж> <знакотношения> <врж> \n'+
    '<знакотношения> ::=   ~  |  {  |   }  |  <  |  >  |  =\n'+
    '<врж1> ::= <врж>\n'+
    '<врж2> ::= <врж>\n'+
    '<врж> ::= <терм1> | <врж> + <терм1> | <врж> - <терм1>\n'+
    '<терм1> ::= <терм>\n'+
    '<терм> ::= <множ> | <терм> * <множ> | <терм> / <множ>\n'+
    '<множ> ::= con | id | ( <врж1> ) \n'+
    '<множ1> ::= <множ>';

    $scope.testSource = $scope.source;

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

    var getFirstTerms = function(elem, alph) {
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
            console.log("isTerm"+i+":" + def[i] + ":" + d0);
            if(d0) {
                var terms = getFirstTerms(def[i], alph);
                console.log(terms);
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
                console.log("FOUND AT: " + i + " " + j);
                console.log(rel[i][j]);
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
                            relations[col[k]][j].value += "<";
                        }
                    }
                }
            }
        }
    }

    // LAST+

    var getLastTerms = function(elem, alph) {
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
            console.log("isTerm"+i+":" + def[i] + ":" + d0);
            if(d0) {
                var terms = getLastTerms(def[i], alph);
                console.log(terms);
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
                console.log("FOUND AT: " + i + " " + j);
                console.log(rel[j][i]);
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
            console.log("COLS");
            console.log(col);
            for(var k = 0; k < col.length; k++) {
                if(col[k] >= 0) {
                    for (var j = 0; j < relations[i].length; j++) {
                        if(relations[i][j].rvalue == "Z") {
                            relations[j][col[k]].value += ">";
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

    var synthAn1 = function() {
        console.log("TEST SOURCE");
        var input = testSource.slice();
        input.push('#');
        console.log(input);
        var rel = '';
        var output = [];
        var step = 0;
        var stackSize = 0;
        while(step < 25 && input.length >= 0) {
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
                        for (var i = 0; i < output.length + 1; i++) {
                            if (i > 0) stack.unshift(output[output.length - i]);
                            var reduced = tryReduce(stack);
                            console.log(stack);
                            if (reduced) {
                                console.log("REDUCED");
                                console.log(reduced);
                                output.splice(output.length - i, i);

                                input.unshift(reduced);
                                console.log(output);
                                elem = reduced;
                                break;
                            }
                        }
                        // var reduced = tryReduce(stack);
                        //     if (reduced) {
                        //     input.unshift(reduced);
                        //     elem = reduced;
                        // }
                    // } else if(stackSize > 0) {
                    //     console.log(output);
                    //     for (var i = 0; i < stackSize; i++) {
                    //         stack.push(output[output.length - stackSize + i]);
                    //     }
                    //     stack.push(elem);
                    //     console.log("stackSize: " + stackSize);
                    //     console.log(stack);
                    //     var reduced = tryReduce(stack);
                    //     if (reduced) {
                    //         console.log("REDUCED");
                    //         console.log(reduced);
                    //         output.splice(output.length - stackSize, stackSize);
                    //
                    //         input.unshift(reduced);
                    //         console.log(input);
                    //         console.log(output);
                    //         elem = '';
                    //     }
                    // }
                    var data = {
                        'input':input.slice(),
                        'output':output.slice(),
                        'step':step,
                        'relation':rel
                    }
                    $scope.synthOutput.push(data);
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
            // var data = {
            //     'input':input.slice(),
            //     'output':output.slice(),
            //     'step':step,
            //     'relation':'?'
            // }
            // $scope.synthOutput.push(data);
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
        $scope.output = '';
        var delimeters = [';',',','(',')','+','-','*','/','=','~','<','>','}','{', ':', '@'];
        var specWords = ['program', 'var', 'begin', 'end', 'write', 'read', 'do', 'by', 'to', 'if', 'goto', ':='];
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

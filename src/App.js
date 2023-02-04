import React, { useEffect, useRef, useState } from "react";
import {create,all} from "mathjs";
import "./App.scss";

export const App = () => {
    const math = create(all,{});
    const [inputScreen, setInputScreen] = useState(' ');
    const [outputScreen, setOutputScreen] = useState(0);
    const [ans, setAns] = useState(0);
    const [isDecimal, setIsDecimal] = useState(true);
    const [power, setPower] = useState('ON');
    const [equalsPressed, setEqualsPressed] = useState(false);
    const normalButtons = [
        {id:'seven', name: '7', value: '7'},
        {id:'eight', name:'8', value: '8'},
        {id:'nine', name:'9', value:'9'},
        {id:'delete', name:'DEL', value:'DEL'},
        {id:'clear', name:'AC', value:'AC'},
        {id:'four', name:'4', value: '4'},
        {id:'five', name:'5', value: '5'},
        {id:'six', name:'6', value: '6'},
        {id:'multiply', name:'*', value: '*'},
        {id:'divide', name:'/', value: '/'},
        {id:'one', name:'1', value: '1'},
        {id:'two', name:'2', value: '2'},
        {id:'three', name:'3', value: '3'},
        {id:'add', name:'+', value: '+'},
        {id:'subtract', name:'-', value: '-'},
        {id:'zero', name:'0', value: '0'},
        {id:'decimal', name:'.', value: '.'},
        {id:'PI', name:'PI', value: Math.PI.toFixed(3).toString()},
        {id:'Ans', name:'Ans', value: ans},
        {id:'equals', name:'=', value: '='}
    ];
    const specialButtons = [
        {id:' sin(', name:'sin(x)'},
        {id:' cos(', name:'cos(x)'},
        {id:' tan(', name:'tan(x)'},
        {id:' abs(', name: 'Abs(x)'},
        {id: power, name: power},
        {id:' sqrt(', name: '√(x)'},
        {id:' pow(', name:'pow(x,y)'},
        {id:' cbrt(', name:'³√'},
        {id:', ', name: ','},
        {id:' log(', name:'ln(x)'},
        {id:' log10(', name:'log10(x)'},
        {id:' log2(', name:'log2(x)'},
        {id:'(', name:'('},
        {id:')', name:')'},
        {id:'F<=>D', name:'F<=>D'}
    ];
    const specialFunctions = [
        'sin(',
        'cos(',
        'tan(',
        'abs(',
        'sqrt',
        'pow(',
        'cbrt(',
        ', ',
        'log(',
        'log10(',
        'log2('
    ];

    const inputRef = useRef();
    const outputRef = useRef();

    useEffect(()=>{
        inputRef.current.addEventListener('paste', (e)=>{
            e.preventDefault();
        });
        outputRef.current.addEventListener('paste', (e)=>{
            e.preventDefault();
        });
    },[]);
    
    const updateInputScreen = (button) => {
        setEqualsPressed(false);
        if (button.value === 'DEL' && inputScreen !== ''){
            let split = inputScreen.substring(0,inputRef.current.selectionStart).split(' ').filter((value,index,string)=>value!=='');
            if (specialFunctions.includes(split[split.length-1])) {
                let toRemove = inputRef.current.selectionStart-split[split.length-1].length;
                setInputScreen(inputScreen.replace(split[split.length-1],''));
                setTimeout(() => {
                    adjustCaretAfterEdit(toRemove);
                  }, 0);
            }
            else {
                let toRemove = inputRef.current.selectionStart-1;
                setInputScreen(inputScreen.substring(0,inputRef.current.selectionStart-1)+inputScreen.substring(inputRef.current.selectionStart-1+1));
                setTimeout(() => {
                    adjustCaretAfterEdit(toRemove);
                  }, 0);
            }
        } 
        else if (button.name === 'Ans') {setInputScreen(ans.toString())} 
        else if (button.value === 'AC'){
            setInputScreen('');
            setOutputScreen(0);
        } 
        else if (button.value === '=' || button.value === 'DEL') {}
        else if(['+','-','*','/'].includes(button.value) && equalsPressed){setInputScreen(`${ans}${button.value}`)} 
        else {
            let currentFormula = inputScreen.split(/[\s\+\-\*\/]/);
            if (inputScreen.charAt(inputScreen.length-1)==='0' && inputScreen.length === 1 && ['0','1','2','3','4','5','6','7','8','9'].includes(button.value)){} 
            
            if(button.value==='.' && (inputScreen.charAt(inputScreen.length-1)==='.' || currentFormula[currentFormula.length-1].includes('.'))){}
            
            else {
                let toAdd = inputRef.current.selectionStart+1;
                setInputScreen(inputScreen.substring(0,inputRef.current.selectionStart)+button.value+inputScreen.substring(inputRef.current.selectionStart));
                setTimeout(() => {
                    adjustCaretAfterEdit(toAdd);
                  }, 0);
            }
        }
        inputRef.current.focus();
    };

    const updateOutputScreen = () => {
        setEqualsPressed(true);
        let exprList = inputScreen.split(' ').filter((value,index,string)=>value!=='');
        const newExprList = exprList.map((expr,index,array)=>{
            let start = expr; let end = '';
            if (start.match(/sin/) != null) {
                end += start.replace(/sin/g,'Math.sin');
                start = updateExpression(start,/sin\(-*\d+.*/g);
            }
            if (start.match(/cos/) != null) {
                end += start.replace(/cos/g,'Math.cos');
                start = updateExpression(start,/cos\(-*\d+.*/g);
            }
            if (start.match(/tan/) != null) {
                end += start.replace(/tan/g,'Math.tan');
                start = updateExpression(start,/tan\(-*\d+.*/g);
            }
            if (start.match(/abs/) != null) {
                end += start.replace(/abs/g,'Math.abs');
                start = updateExpression(start,/abs\(-*\d+.*/g);
            }
            if (start.match(/sqrt/) != null) {
                end += start.replace(/sqrt/g,'Math.sqrt');
                start = updateExpression(start,/sqrt\(-*\d+.*/g);
            }
            if (start.match(/pow/) != null) {
                end += start.replace(/pow/g,'Math.pow');
                start = updateExpression(start,/pow\(-*\d+.*/g);
            }
            if (start.match(/cbrt/) != null) {
                end += start.replace(/cbrt/g,'Math.cbrt');
                start = updateExpression(start,/cbrt\(-*\d+.*/g);
            }
            if (start.match(/log\(/) != null) {
                end += start.replace(/log\(/g,'Math.log(');
                start = updateExpression(start,/log\(-*\d+.*/g);
            }
            if (start.match(/log\d\d\(/) != null) {
                end += start.replace(/log\d\d/g,'Math.log10');
                start = updateExpression(start,/log\d\d\(-*\d+.*/g);
            }
            if (start.match(/log\d\(/) != null) {
                end += start.replace(/log\d/g,'Math.log2');
                start = updateExpression(start,/log\d\(-*\d+.*/g);
            }
            return start+end;
        });
        let finalExpr = newExprList.join(' ');
        let missingBrackets = Math.abs((finalExpr.match(/\(/g)||[]).length - (finalExpr.match(/\)/g)||[]).length);
        if (missingBrackets > 0) {
            for (let i=0; i<missingBrackets; i++){finalExpr+=')';}
        }
        evaluateExpr(finalExpr);
    };

    const updateExpression = (expr, search) => {
        if (expr.length !== 0) {return expr.replace(search,'')}
        else {return ''}
    };

    const updateAnsVariable = (newValue) => {
        setAns(newValue);
    };

    const handleSpecialButtons = (button) => {
        setEqualsPressed(false);
        switch (button.id) {
            case 'ON':
                setPower('OFF');
                inputRef.current.style.color = '#141414';
                outputRef.current.style.color = '#141414';
                inputRef.current.disabled = true;
                outputRef.current.disabled = true;
                break;
            case 'OFF':
                setPower('ON');
                inputRef.current.style.color = 'white';
                outputRef.current.style.color = 'white';
                setInputScreen('');
                setOutputScreen(0);
                inputRef.current.disabled = false;
                outputRef.current.disabled = false;
                break;
            case 'F<=>D':
                if (isDecimal) {
                    setIsDecimal(false);
                    let fraction = math.fraction(outputScreen);
                    let numer = fraction.n *fraction.s;
                    let denom = fraction.d === 1 ? '' : `/${fraction.d}`;
                    setOutputScreen(`${numer}${denom}`);
                }
                else {
                    setIsDecimal(true);
                    setOutputScreen(eval(outputScreen));
                }
                break;
            default:
                setInputScreen(inputScreen+button.id);
                inputRef.current.focus();
                break;
        }
    }

    const evaluateExpr = (expr) => {
        let ans = 0;
        try {
            ans =  eval(expr);
        } catch (error) {
            ans = error.name.replace('E',' E');
        }
        setOutputScreen(ans);
        setIsDecimal(true);
        if (!isNaN(ans) && isFinite(ans)) {
            updateAnsVariable(ans);
        }
    }

    const adjustCaretAfterEdit = (pos) => {
        inputRef.current.focus();
        let caretPos = pos < 1 ? 1: pos;
        if(inputRef.current.createTextRange) {
            var range = inputRef.current.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(inputRef.current.selectionStart) {
                inputRef.current.focus();
                inputRef.current.setSelectionRange(caretPos, caretPos);
            }
            else
                inputRef.current.focus();
        }
    };
    
    const handleLeftNavButton = () => {
        inputRef.current.focus();
        let caretPos = inputRef.current.selectionStart === 1 ? 1 : inputRef.current.selectionStart-1;
        if(inputRef.current.createTextRange) {
            var range = inputRef.current.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(inputRef.current.selectionStart) {
                inputRef.current.focus();
                inputRef.current.setSelectionRange(caretPos, caretPos);
            }
            else
                inputRef.current.focus();
        }
    };

    const handleRightNavButton = () => {
        inputRef.current.focus();
        let caretPos = inputRef.current.selectionStart+1;
        if(inputRef.current.createTextRange) {
            var range = inputRef.current.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(inputRef.current.selectionStart) {
                inputRef.current.focus();
                inputRef.current.setSelectionRange(caretPos, caretPos);
            }
            else
                inputRef.current.focus();
        }
        if (caretPos === 0) {inputRef.current.selectionStart = 1}
    };

    return (
        <div className="App">
            <div className="calculator">
                <h2>SCICALC <p>By <a href="https://dennis-tomno.onrender.com" rel="noreferrer" target="_blank">Dennis Tomno</a></p></h2>
                <div className="input-screen">
                    <input ref={inputRef} type="text" onKeyDown={(e)=>e.preventDefault()} onChange={(e)=>setInputScreen(e.target.value)} value={inputScreen}/>
                </div>
                <div className="output-screen">
                    <input id="display" onKeyDown={(e)=>e.preventDefault()} ref={outputRef} onChange={(e)=>setInputScreen(e.target.value)} value={outputScreen}/>
                </div>
                <div className="buttons">
                    <div className="nav">
                        <div className="nav-left" onClick={handleLeftNavButton}>
                            <p><i className="arrow left"></i></p>
                        </div>
                        <div className="nav-left" onClick={handleRightNavButton}>
                            <p><i className="arrow right"></i></p>
                        </div>
                    </div>
                    <div className="special">
                        {specialButtons.map((button, index, array)=>{
                            return <div style={[',','³√','(',')'].includes(button.name)?{fontSize:'22px'}:{}} key={button.id} id={button.id} onClick={()=>handleSpecialButtons(button)} className="special-button">{button.name}</div>
                        })}
                    </div>
                    <div className="normal">
                        {normalButtons.map((button, index, array)=>{
                            return <div style={['.','*','+','-'].includes(button.name)?{fontSize:'24px'}:{}} key={button.id} id={button.id} onClick={button.name === '=' ? updateOutputScreen : ()=>updateInputScreen(button)} className="normal-button">{button.name}</div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
const instructions = {
    "MOV": (mem, arg1, arg2) => mem[arg1] = mem[arg2] || parseFloat(arg2),
    "ADD": (mem, arg1, arg2) => mem[arg1] += mem[arg2] || parseFloat(arg2),
    "SUB": (mem, arg1, arg2) => mem[arg1] -= mem[arg2] || parseFloat(arg2),
    "MUL": (mem, arg1, arg2) => mem[arg1] *= mem[arg2] || parseFloat(arg2),
    "DIV": (mem, arg1, arg2) => mem[arg1] /= mem[arg2] || parseFloat(arg2),
    
    "DEL": (mem, arg1) => delete mem[arg1],
    
    "CMP": (mem, arg1, arg2) => {
        let val1 = mem[arg1];
        let val2 = mem[arg2];

        if(val1 == undefined){
            val1 = parseFloat(arg1)
        }
        if(val2 == undefined){
            val2 = parseFloat(arg2)
        }
        
        mem["ZF"] = val1 === val2;
        console.log(`Compare: ${val1}(${typeof val1}) == ${val2}(${typeof val2}) (${mem["ZF"]})`);
    },

    //Jump Instructions
    "JMP": (lines, mem, arg1) => {
        const newPC = lines.findIndex(line => line.startsWith(arg1 + ':'));
        
        if(newPC){
            mem["PC"] = newPC;
        }else{
            mem["PC"]++;
        }
    },
    "JE": (lines, mem, arg1) => {
        if(mem["ZF"]){
            const newPC = lines.findIndex(line => line.startsWith(arg1 + ':'));
            mem["PC"] = newPC;
        }else{
            mem["PC"]++;
        }
    },
    "JNE": (lines, mem, arg1) => {
        if(!mem["ZF"]){
            const newPC = lines.findIndex(line => line.startsWith(arg1 + ':'));
            mem["PC"] = newPC;
        }else{
            mem["PC"]++;
        }
    },
};

function interpret(code) {
    document.querySelector("#error").textContent = "";

    // Divide o código em linhas e remove quaisquer espaços em branco
    const lines = code.split("\n").map(line => line.trim());

    // Inicializa a memória
    const memory = {
        "PC": 0,
        "ZF": false,
    };

    let i = 0; //To prevent loops
  
    while (memory["PC"] < lines.length) {
        i++;
        if(i > 9999){ //Previne Loops Infinitos
            const error = `Erro! Loop Infinito`;
            document.querySelector("#error").textContent = error;
            return memory;
        }

        const line = lines[memory["PC"]];

        // Se a linha esta vazia ou a instrução é um rótulo, pula para a próxima linha
        if(line === "" || line.endsWith(':')){
            memory["PC"]++;
            continue;
        }

        // Divide a linha em instrução e argumentos
        const [instruction, arg1, arg2] = line.split(" ");

        // Verifica se a instrução é suportada
        if (instruction in instructions) {  
            // Executa a instrução
            
            if(instruction.startsWith('J')){
                instructions[instruction](lines, memory, arg1, arg2);

            } else {
                
                console.log(`${instruction}: ${arg1}(${memory[arg1] || parseFloat(arg1)}), ${arg2}(${memory[arg2] || parseFloat(arg2)})`);
                
                instructions[instruction](memory, arg1, arg2);

                //console.log(memory)
                
                memory["PC"]++;  //Atualiza o contador de programa (PC)
            }
        }
        else {
            const error = `Erro! Instrução não suportada: ${instruction}`;
            document.querySelector("#error").textContent = error;
            return memory;
        }
    }

    return memory;
}
  

document.querySelector("#input").textContent = 
`START:
MOV X 2
MOV Y 3
ADD X Y
SUB X 1
CMP X 4
JE LABEL1
MOV RESULT 0
JMP END

LABEL1:
MOV RESULT 1

END:
DEL X
DEL Y`;


function run(){
    const memory = interpret(document.querySelector("#input").value);

    let output = "";
    let counter = 0;

    for(const i in memory) {
        counter++;

        if(counter == 1){
            output += `Registradores:\n`;
            output += `\t$PC: ${memory["PC"]} \n`;
        }
        else if(counter == 2){
            output += `\t$ZF: ${memory["ZF"]} \n\n`;
            output += `Variáveis:\n`;
        }
        else{
            if(i == "PC" || i == "ZF")
                continue;
            
            output += `\t${i}: ${memory[i]} \n`;
        }
    }

    document.querySelector("#output").textContent = output;
}

document.querySelector("#execute").addEventListener("click", e => {
    run();
});
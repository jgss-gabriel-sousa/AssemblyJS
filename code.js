// Define um objeto com instruções suportadas e suas funções correspondentes
const instructions = {
  "MOV": (mem, arg1, arg2) => mem[arg1] = mem[arg2] || parseFloat(arg2),
  "ADD": (mem, arg1, arg2) => mem[arg1] += mem[arg2] || parseFloat(arg2),
  "SUB": (mem, arg1, arg2) => mem[arg1] -= mem[arg2] || parseFloat(arg2),
  "MUL": (mem, arg1, arg2) => mem[arg1] *= mem[arg2] || parseFloat(arg2),
  "DIV": (mem, arg1, arg2) => mem[arg1] /= mem[arg2] || parseFloat(arg2),
  "JMP": (mem, arg1) => mem["PC"] = mem[arg1],
  "JE": (mem, arg1) => {
    if (mem["ZF"]) mem["PC"] = mem[arg1];
  },
  "JNE": (mem, arg1) => {
    if (!mem["ZF"]) mem["PC"] = mem[arg1];
  },
  "CMP": (mem, arg1, arg2) => {
    const val1 = mem[arg1];
    const val2 = mem[arg2] || parseFloat(arg2);
    mem["ZF"] = val1 === val2;
  },
};


// Define a função principal que interpreta o código Assembly
function interpret(code) {
  // Divide o código em linhas e remove quaisquer espaços em branco
  const lines = code.split("\n").map(line => line.trim());

  // Inicializa o registro de memória
  const memory = {
    "PC": 0,
    "ZF": false,
  };

  // Loop através de cada linha e executa a instrução correspondente
  while (memory["PC"] < lines.length) {
    // Obtém a linha atual
    const line = lines[memory["PC"]];

    if(line === ""){
      memory["PC"]++;
      continue;
    }
    
    console.log(line)

    // Divide a linha em instrução e argumentos
    const [instruction, arg1, arg2] = line.split(" ");

    // Verifica se a instrução é suportada
    if (instruction in instructions) {
      // Executa a instrução e atualiza o contador de programa (PC)
      instructions[instruction](memory, arg1, arg2);
      memory["PC"]++;
    } else {
      throw new Error(`Instrução não suportada: ${instruction}`);
    }
  }

  // Retorna o resultado final
  return memory;
}

// Exemplo de código Assembly
const code = `
  MOV X 2
  MOV Y 3
  ADD X Y
  SUB X 1
  CMP X 4
  JE LABEL1
  MOV RESULT 0
  JMP LABEL2
LABEL1:
  MOV RESULT 1
LABEL2:
`;

// Interpreta o código e imprime o resultado
const result = interpret(code);
console.log(result["RESULT"]); // Output: 0
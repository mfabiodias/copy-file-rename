const scandir   = require('scandir').create();
const fileCopy  = require('fs-copy-file-sync');
const fs        = require("fs");
const os        = require("os");
const oFolder   = "pdf_origem";  
const dFolder   = "pdf_destino"; 
const osBar     = os.platform() == "win32" ? "\\" : "/"; 
const perf      = require('execution-time')();
const debug     = false; 
let contador    = 0;

// Start no tempo para contagem
perf.start();

// Executa na leitura de cada arquivo retornado
scandir.on('file', (file, stats) => {

    const parts = file.split(osBar)[1].split(".");
    const ext   = parts.pop();
    const nFile = parts.join(" ");
    const oFile = dFolder+osBar+removeAcentos(nFile)+"."+ext;
    
    if(debug) {
        console.log(`De: ${file} - Para: ${oFile}`);
    }
    
    try {
        if (!fs.existsSync(dFolder)) {
            fs.mkdirSync(dFolder, function(err) {
                if (err) {
                    console.log(err)
                } 
            });
        }
    } catch(err) {
        console.error(err)
    } finally {
        contador++;
        fileCopy(file, oFile);
    }

});

// Imprime error na leitura do arquivo se falhar
scandir.on('error', err => console.log(err));

// Executado na conclusão de leitura da lista dos arquivos
scandir.on('end', _ => {
    // Stop no tempo de contagem
    const results = perf.stop();
    console.log(`\nConcluído! ${contador} arquivo(s) renomeados em ${(results.time/1000).toFixed(2)} segundo(s).`)
});

// Função que percorre o diretório em busca de arquivos
scandir.scan({
    dir: `./${oFolder}`,
    recursive: true,
    filter: /.*/
});

// Remove acentuação 
const removeAcentos = str => str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .replace("_", " ")
    .replace(/[^a-z0-9-\s]/gi,'');
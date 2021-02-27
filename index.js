const scandir  = require('scandir').create();
const fileCopy = require('fs-copy-file-sync');
const fs       = require("fs");
const os       = require("os");
const oFolder  = "pdf_origem";  
const dFolder  = "pdf_destino"; 
const osBar    = os.platform() == "win32" ? "\\" : "/"; 
const debug    = true; 

// Executa na leitura de cada arquivo retornado
scandir.on('file', (file, stats) => {

    const parts = file.split(osBar)[1].split(".");
    const ext   = parts.pop();
    const nFile = parts.join(" ");
    const ofile = dFolder+osBar+removeAcentos(nFile)+"."+ext;
    
    if(debug) {
        console.log(`De: ${file} - Para: ${ofile}`);
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
        fileCopy(file, ofile);
    }

});

// Imprime error se houver
scandir.on('error', err => console.log(err));

// Executado na conclusão de leitura da lista de arquivos
scandir.on('end', _ => console.log('Concluído'));

// Função que percorre o diretório en busca de arquivos
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
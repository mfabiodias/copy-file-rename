const scandir  = require('scandir').create();
const fileCopy = require('fs-copy-file-sync');
const fs = require("fs");
const os = require("os");
const oFolder  = "pdf_origem";  
const dFolder  = "pdf_destino"; 
const osBar    = os.platform() == "win32" ? "\\" : "/";  

// Executa na leitura de cada arquivo retornado
scandir.on('file', (file, stats) => {

    fs.mkdir(dFolder, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log("New directory successfully created.")
        }
    })

    const gfile = file.split(osBar)[1].split(".");
    const ofile = dFolder+osBar+removeAcentos(gfile[0])+"."+gfile[1];
    
    fileCopy(
        file, // path/file.ext
        ofile // renomeia pasta de origem/destino
    );
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
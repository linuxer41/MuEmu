const fs = require('fs');
const path = require('path');

// Función para buscar archivos .cs recursivamente en una carpeta
function findCsFiles(dirPath) {
    let csFiles = [];

    // Leer el contenido del directorio
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dirPath, item.name);

        if (item.isDirectory()) {
            // Si es un directorio, busca recursivamente dentro de él
            csFiles = csFiles.concat(findCsFiles(fullPath));
        } else if (item.isFile() && path.extname(item.name) === '.cs') {
            // Si es un archivo .cs, añádelo a la lista
            csFiles.push(fullPath);
        }
    }

    return csFiles;
}

// Función para acumular los nombres y contenidos de los archivos .cs en code.txt
function accumulateCsFilesToCodeFile(dirPath, outputFile) {
    const csFiles = findCsFiles(dirPath);

    // Leer el contenido actual del archivo code.txt (si existe)
    let currentContent = '';
    if (fs.existsSync(outputFile)) {
        currentContent = fs.readFileSync(outputFile, 'utf-8');
    }

    // Acumular los nombres y contenidos de los archivos .cs con el formato deseado
    let newContent = '';
    for (const filePath of csFiles) {
        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Formato: --file nombre_archivo
        // Contenido del archivo
        newContent += `--file ${fileName}\n${fileContent}\n\n`;
    }

    // Escribir el nuevo contenido al archivo code.txt
    fs.writeFileSync(outputFile, `${currentContent}${newContent}`, 'utf-8');
}

// Configuración: Ruta de la carpeta y archivo de salida
const folderPath = './'; // Cambia esto por la ruta de tu carpeta
const outputFilePath = './code.txt'; // Archivo donde se guardará la acumulación

// Ejecutar la función
accumulateCsFilesToCodeFile(folderPath, outputFilePath);

console.log(`Los nombres y contenidos de los archivos .cs han sido acumulados en ${outputFilePath}`);
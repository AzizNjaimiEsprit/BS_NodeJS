
function composeImagePaths (files) {
    finalPath = ""
    if (files.length == 1) finalPath = "C:\\Users\\mariahi\\Desktop\\Projects\\Esprit\\BooksCovers\\" + files[0].filename;
    else if (files.length > 1) for (let file of files) finalPath += file.filename + "/";
    else finalPath = "No images";
    return finalPath;
}

module.exports = {composeImagePaths}
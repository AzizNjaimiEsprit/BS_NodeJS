
function composeImagePaths (files) {
    finalPath = ""

    for (file of files) {
        finalPath += file.path.replace("uploads\\offersBooksImages\\", "") + "*";
    }
    
    return finalPath.substring(0, finalPath.length - 1);
}

module.exports = {composeImagePaths}
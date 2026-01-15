export function getFileName(url: string, defaultStr: string) {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1] || defaultStr;
}



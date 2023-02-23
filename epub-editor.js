/* - Ana klasöre bu veriyle "stylesheet.css" oluştur:
`       * { font-family: "Arial"}       ` */
const fs = require('fs')
var path = require('path')
const glob = require('glob');

let css = `* {
  font-family:  'Times New Roman', "Times", "serif", "Helvetica", "Garamond", "Cambria", "Palatino", "Arial", "Calibri", "Verdana", "Georgia", "Open Sans", sans-serif;
}`

const extensions = ['xhtml', 'html', 'mhtml', 'htm']

function recFindByExt(base, exts, files, result) {
    files = files || fs.readdirSync(base)
    result = result || []

    files.forEach(
        function (file) {
            var newbase = path.join(base, file)
            if (fs.statSync(newbase).isDirectory()) {
                result = recFindByExt(newbase, extensions, fs.readdirSync(newbase), result)
            }
            else {
                
                if (extensions.includes(file.split('.')[1])) {
                    result.push(newbase)
                }
            }
        }
    )
    return result
}

fs.writeFile("epub/epub-editor/stylesheet.css", css, function (err) {
    if (err) {
        return console.error(err);
    }
})

/*  - Bütün klasörleri tara ve uzantısı.mhtml, .xhtml veya.html olanların adreslerini[contentPaths] topla. */
   
    //glob.sync("test/OEBPS/Text/" + '/**/*.xhtml', {})
    
recFindByExt('epub/', extensions).map(contentPath => {
        console.log(contentPath)
        
        /* - Elemanın(contentPath) işaret ettiği dosyayı çek. */
        fs.readFile(contentPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            /* - İçerisindeki type = "text/css" elemanlarından sonuncusunun sonraki satırına şunu ekle: ` <link href="stylesheet.css" rel="../../stylesheet.css" type="text/css" /> ` */

            let searchTerm = `type="text/css"`

            let lines = data.split("\n")
            let index = 0
            
            lines.map((line, lineIndex) => {
                if (line.includes(searchTerm)) {
                    index = lineIndex
                    console.log(line, lineIndex)
                }
            })

            console.log(index)

            

            // Kaç tane "text/css" />" olduğunu bul
            let importCount = (data.match(searchTerm) || []).length;

            // Sonuncusunun indexini al
            const importIndex = data.indexOf(searchTerm, (data.indexOf(searchTerm, data.indexOf(searchTerm) + 1) ))

            // stylesheet.css dosyasının importunu ekle
            const textToBeAdded = `<link href="stylesheet" rel="` + ('../'.repeat((contentPath.match(/\\/g) || []).length - 1) || "./") + `epub-editor/stylesheet.css" type="text/css" />`

            

            String.prototype.splice = function (idx, rem, str) {
                return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
            };
            
            var result = data.splice(importIndex < 1 ? 0 : importIndex + searchTerm.length, 0, textToBeAdded);

            lines.splice(index + 1, 0, textToBeAdded)

            fs.writeFile(contentPath, lines.join('\n') , function (err) {
                if (err) {
                    return console.error(err);
                }
            })

        });
    })
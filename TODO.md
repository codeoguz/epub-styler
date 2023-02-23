- Ana klasöre bu veriyle "stylesheet.css" oluştur:
`       * { font-family: "Arial"}       `
- Bütün klasörleri tara ve uzantısı .mhtml, .xhtml veya .html olanların adreslerini [ contentPaths ] topla.
- Her contentPaths elemanı için sorgu başlat
    - Elemanın (contentPath) işaret ettiği dosyayı çek.
    - İçerisindeki type="text/css" elemanlarından sonuncusunun sonraki satırına şunu ekle: ` <link href="stylesheet.css" rel="../../stylesheet.css" type="text/css" /> `


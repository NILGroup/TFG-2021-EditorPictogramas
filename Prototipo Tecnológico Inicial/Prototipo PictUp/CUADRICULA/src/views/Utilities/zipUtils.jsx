
import React from 'react'

//npm i decompress

export default class ZipUtils extends React.Component {

 
  constructor() {
    super()
  }

  getData() {
    return this.data
  }

  getImage() {
    //console.log("Eyy")
  }



  getFiles(f) {

    var url = []
    var slidesobj = {};

    //Archivo
    var file = f.target.files[0]
    var JSZip = require('jszip')();

    JSZip.loadAsync(file)
      .then(function (zip) {
        //Recorremos cada archivo del zip
        zip.forEach(function (zipEntry) {
          if (zipEntry.endsWith(".jpg")) {
            zip.files[zipEntry].async('arraybuffer')
              .then(function (data) {

                var buffer = new Uint8Array(data);
                var blob = new Blob([buffer.buffer]);
                slidesobj[zipEntry] = URL.createObjectURL(blob)

                url.push(URL.createObjectURL(blob))
              })
          }
        });
      }, function (e) {
        alert("Error reading " + f.name + ": " + e.message);
      })

    return url

  }


  async getZipFilesContent(f) {
    const zipContent = []
    const promises = []

    var file = f.target.files[0]

    var JSZip = require('jszip')();

    const zip = (await JSZip.loadAsync(file))
    zip.forEach(async (zipEntry) => {
      if (zipEntry.endsWith(".jpg")) {
        const promise =  zip.files[zipEntry].async('arraybuffer')
        promises.push(promise)
        zipContent.push({
          file: zipEntry,
          content: await promise
        })
      }
    })

    
    return Promise.all(promises).then((x) => {
      //console.log("x", x)
    })
  }
}
module.export = ZipUtils
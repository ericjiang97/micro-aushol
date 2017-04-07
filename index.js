const microApi = require('micro-api')
const fs = require('fs-promise')
var fileS = require('fs');

function JSONHandler(file){
  try {
      var obj = JSON.parse(fileS.readFileSync(file, 'utf8'));

      return obj;
  } catch(e) {
      return false;
  }
}


const handleNone = (() => 'You must use a valid request')

const handleState = async ({ params: { state }, res }) => {
  state = state.toUpperCase()
  try {
    var FileObject = JSONHandler('./australianhol.json')
    FileObject = FileObject.ausgovEvents.jurisdiction
    for(var i=0; i <= FileObject.length; i++){
      if(FileObject[i].jurisdictionName == state){
          return FileObject[i] 
      }
    }
    return null 
  } catch (err) {
    // Autos to 404
    return null
  }
}

const handleList = async ({ res }) => {
  try {
    res.setHeader('Content-Type', 'application/json')
    const list = await fs.readFile('./australianhol.json')
    
    return list;
  } catch (err) {
    // Autos to 404
    return null
  }
}

const api = microApi([
  {
    method: 'get',
    path: '/',
    handler: handleNone
  },
  {
    method: 'get',
    path: '/all',
    handler: handleList
  },
  {
    method: 'get',
    path: '/state/:state',
    handler: handleState
  }
])

module.exports = api
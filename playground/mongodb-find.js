const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connected to MongoDB server')

  // db.collection('Todos').find({ 
  //   _id: new ObjectID('5b6fa3ed94f17a1fcda61cac')
  // }).toArray().then((docs) => {
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   console.log('Unable to fetch the data', err)
  // })
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`)
    
  // }, (err) => {
  //   console.log('Unable to fetch the data', err)
  // })

  db.collection('Users').find({name: 'Nami Kim'}).toArray().then((res) => {
    console.log('Users')
    console.log(JSON.stringify(res, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch the users', err)
  })
  // db.close()
})
import swarm from 'discovery-swarm';
var sw = swarm()

sw.listen(8011)
sw.join('ubuntu-14.04') // can be any id/name/hash

sw.on('connection', function (connection) {
  console.log('found + connected to peer')
})

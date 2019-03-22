# RouteFinder
Map live: https://sailarn.github.io/AnotherMapInTheWorld/build
To launch it from the source code:
* Download it
* npm install to install required node_modules
* yarn start / npm start to start dev server
* yarn build / npm build to build a production version
* yarn test / npm test to launch tests

## About:
Application based on React. It is a map with settings. You can add a waypoint by entering a name of it in field "Add a waypoint".
An autocomplete will offer you some variants from Google maps. Choose a variant with arrows or a mouse, press enter or left click on a mouse and waypoint will appear on map. Add more than 2 waypoints and they will automatically be connected with lines. You may click on a marker to see what a waypoint it is. Under the input will be a list of created waypoints. Click on item from list map will be centered on chosen waypoint. Click on X to delete waypoint. Toggle switch 'Edit mode' to activate edit mode in which you may drag a list item to change their order on map and list. Click 'Create Route' to create an actual route from waypoints. You may delete created route by clicking on X under the map. 

## Features:
* Waypoint creation from input
* List of created waypoints
* Editing order from list
* Deleting chosen waypoint
* Draggable markers
* Info from a marker on map
* Creating an actual route
* You may create not just one route
* Deleting chosen route from the list

## Screenshot:
![alt text](https://i.ibb.co/tz8y40n/Another-Map-In-The-World.png)

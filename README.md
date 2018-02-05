# embalsesPuertoRico

 Embalse Project - Puerto Rico's Water Reservoirs
 Jordan Caraballo & Elio Ramos, University of Puerto Rico at Humacao
 Mathematics Department, Comp-4019
 Details: This file contains JS functions to process and graph data
 from Puerto Rico's principal water reservoirs.

The aim of this project is to develop a JS application able to monitor
and graph the live status of Puerto Rico's reservoirs from USGS data.
There are going to be Leaflet markers located at the exact point in
Puerto Rico where the reservoir is located.

At the time of clicking on the marker, the program will show a time
series graph from the specific point. It will show the change in the
level of the reservoir for the last two days.

This program implements JS, HTML, CSS and multiple frameworks such as
D3.js, Leaflet.js, JQuery.js and others. At the end, the professor will
judge the program based on performance and visualization.

This directory contains:

mapaEmbalses.html - main html file for the application

d3        - directory that contains D3.js library to create visualizations
embalse   - directory that contains embalse library that stores the different
            functions needed for performing operations
jquery    - directory that contains JQuery library
leaflet   - directory that contains Leaflet library to construct geographic maps
spin      - directory that contains "spinner" library to create spinner

Visualization:
To see the application just open it on a web browser with an internet connection.
This will show the map and the graphs from each marker.

Acknowledgements:
Thanks to professor Elio Ramos for his support and help in the development of this project.

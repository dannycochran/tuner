/*
// Create a Paper.js Path to draw a line into it:
var path = new Path();
// Give the stroke a color
path.strokeColor = 'orange';
var start = new Point(100, 100);
// Move to start and draw a line from there
path.moveTo(start);
// Note the plus operator on Point objects.
// PaperScript does that for us, and much more!
path.lineTo(start + [ 100, -50 ]);
*/

// rectangle
var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
var size = new Size(600,150);
var point = new Point(view.center._x/2,view.center._y/2)
var center = view.center;
var rectangle = new Rectangle(0, size);
var cornerSize = new Size(10,10);
var roundRectangleMask = new Path.RoundRectangle(rectangle,cornerSize);
var roundRectangleMask = new Path.RoundRectangle(rectangle,cornerSize);
roundRectangleMask.strokeWidth = 6;
roundRectangleMask.position = view.center;

// text

var frequencies = {
	'A': "A#",
	'A#': "A#",
	'B': "B",
	'C': "C",
	'C#': "C#",
	'D': "D",
	'D#': "D#",
	'E': "E",
	'F': "F",
	'F#': "F#",
	'G': "G",
	'G#': "G#"
};

var A = new PointText(point);
var aSharp = new PointText(point);
var B = new PointText(point);
var C = new PointText(point);
var cSharp = new PointText(point);
var D = new PointText(point);
var dSharp = new PointText(point);
var E = new PointText(point);
var F = new PointText(point);
var fSharp = new PointText(point);
var G = new PointText(point);
var gSharp = new PointText(point);

var text = new PointText(point);
var fontSize = 50;
var textAdjuster = 20;
text.characterStyle = {
    fontSize: fontSize,
    fillColor: 'black',
};
text.justification = 'center';
text.position = view.center+fontSize-textAdjuster;
text.content = frequencies;




var group = new Group([roundRectangleMask,text]);
group.clipped = true;

var roundRectangle = new Path.RoundRectangle(rectangle,cornerSize);
roundRectangle.strokeColor = '#0EBFE9';
roundRectangle.strokeWidth = 12;
roundRectangle.position = view.center;


function onResize(event) {
    roundRectangleMask.position = view.center;
	roundRectangle.position = view.center;
    text.position = view.center+fontSize-textAdjuster;
}

function onMouseDrag(event) {
    text.position = event.point
}
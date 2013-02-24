//globals
	var frequencies = {
		'A': "A",
		'aSharp': "A#",
		'B': "B",
		'C': "C",
		'cSharp': "C#",
		'D': "D",
		'dSharp': "D#",
		'E': "E",
		'F': "F",
		'fSharp': "F#",
		'G': "G",
		'gSharp': "G#"
	};

	var width = 500,
		height = 100,
		stroke = 6;
		fontSize = height / 3,
		fontSpace = width / 5,
		fontHeightMargin = height/(fontSize/5);
	
    //static points
	var aPoint = {width: -width, height:fontHeightMargin},
		aSharpPoint = {width: -width+fontSpace, height:fontHeightMargin},
		bPoint = {width: -width+fontSpace*2, height:fontHeightMargin},
		cPoint = {width: -width+fontSpace*3, height:fontHeightMargin},
		cSharpPoint = {width: -width+fontSpace*4, height:fontHeightMargin},
		dPoint = {width: -width+fontSpace*5, height:fontHeightMargin},
		dSharpPoint = {width: -width+fontSpace*6, height:fontHeightMargin},
		ePoint = {width: -width+fontSpace*7, height:fontHeightMargin},
		fPoint = {width: -width+fontSpace*8, height:fontHeightMargin},
		fSharpPoint = {width: -width+fontSpace*9, height:fontHeightMargin},
		gPoint = {width: -width+fontSpace*10, height:fontHeightMargin},
		gSharpPoint = {width: -width+fontSpace*11, height:fontHeightMargin};


// rectangle housing notes clipMask
	var size = new Size(width,height),
		rectangle = new Rectangle(0, size),
		cornerSize = new Size(10,10),
		roundRectangleMask = new Path.RoundRectangle(rectangle,cornerSize);
	roundRectangleMask.position = view.center;
	roundRectangleMask.clipMask = true;

// pseudo spectrometer
	var rectangleSpec = new Rectangle(0, size);
	var roundSpec = new Path.RoundRectangle(rectangleSpec,cornerSize);
		roundSpec.strokeColor = '#0EBFE9';
		roundSpec.strokeWidth = stroke;
		roundSpec.position = new Point(view.center._x,view.center._y+height+20);
	
	var gSpotSize = new Size(width/8, height-stroke),
		gSpotRect = new Rectangle(0, gSpotSize),
		gSpot = new Path.Rectangle(gSpotRect);
	gSpot.fillColor = 'green';
	gSpot.position = roundSpec.position;
	
	var gLocator = new Path.Circle(roundSpec.position, 10);
	gLocator.fillColor = 'blue';
	
// text
	var A = new PointText(aPoint.width,aPoint.height);
		A.content = frequencies.A;
		A.characterStyle.fontSize = fontSize;
	var aSharp = new PointText(aSharpPoint.width,aSharpPoint.height);
		aSharp.content = frequencies.aSharp;
		aSharp.characterStyle.fontSize = fontSize;
	var B = new PointText(bPoint.width,bPoint.height);
		B.content = frequencies.B;
		B.characterStyle.fontSize = fontSize;
	var C = new PointText(cPoint.width,cPoint.height);
		C.content = frequencies.C;
		C.characterStyle.fontSize = fontSize;
	var cSharp = new PointText(cSharpPoint.width,cSharpPoint.height);
		cSharp.content = frequencies.cSharp;
		cSharp.characterStyle.fontSize = fontSize;
	var D = new PointText(dPoint.width,dPoint.height);
		D.content = frequencies.D;
		D.characterStyle.fontSize = fontSize;
	var dSharp = new PointText(dSharpPoint.width,dSharpPoint.height);
		dSharp.content = frequencies.dSharp;
		dSharp.characterStyle.fontSize = fontSize;
	var E = new PointText(ePoint.width,ePoint.height);
		E.content = frequencies.E;
		E.characterStyle.fontSize = fontSize;
	var F = new PointText(fPoint.width,fPoint.height);
		F.content = frequencies.F;
		F.characterStyle.fontSize = fontSize;
	var fSharp = new PointText(fSharpPoint.width,fSharpPoint.height);
		fSharp.content = frequencies.fSharp;
		fSharp.characterStyle.fontSize = fontSize;
	var G = new PointText(gPoint.width,gPoint.height);
		G.content = frequencies.G;
		G.characterStyle.fontSize = fontSize;
	var gSharp = new PointText(gSharpPoint.width,gSharpPoint.height);
		gSharp.content = frequencies.gSharp;
		gSharp.characterStyle.fontSize = fontSize;
	
	var notesGroup = new Group([A,aSharp,B,C,cSharp,D,dSharp,E,F,fSharp,G,gSharp]); 
		notesGroup.position = view.center;
	
	var group = new Group([roundRectangleMask,notesGroup]);

// rectangle housing notes
	var roundRectangle = new Path.RoundRectangle(rectangle,cornerSize);
		roundRectangle.strokeColor = '#0EBFE9';
		roundRectangle.strokeWidth = stroke;
		roundRectangle.position = view.center;

// function testers
	function onResize(event) {
	    roundRectangleMask.position = view.center;
		roundRectangle.position = view.center;
		roundSpec.position = new Point(view.center._x,view.center._y+height+20)
		gSpot.position = roundSpec.position;
		gLocator.position = roundSpec.position;
		notesGroup.position = view.center;
	}
	
	function onMouseDown(event) {
	    notesGroup.position = new Point(aPoint.width+fontSpace*12.5,notesGroup.position._y);
	    A.characterStyle.fillColor = "green";
	    console.log(notesGroup.position);
	}

// pseudo code

/*
function onAudioTrue(note,freq) {
	transform note into our variable name and then -> note.CharacterStyle.fillColor = "green";
	come up with someFactor and then -> notesGroup.position = new Point(notePoint.width+fontSpace*__someFactor,notesGroup.position._y);
	look at frequency and map it to range in round spec and then -> gLocator.position = freq*mapped factor
}
*/

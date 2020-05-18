(function (){

  function makeDraggableTags(){
    $("#tag").createDrag();
    console.log("Script started! Tags should be draggable.")
  }

  $(window).on('load', makeDraggableTags);

}) ();

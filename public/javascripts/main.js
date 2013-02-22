$(function(){

	function split( val ) {
      return val.split( /,\s*/ );
    }
  function extractLast( term ) {
    return split( term ).pop();
  }
 
  $( "#inviteFriends" )
    // don't navigate away from the field on tab when selecting an item
    .bind( "keydown", function( event ) {
      if ( event.keyCode === $.ui.keyCode.TAB &&
          $( this ).data( "ui-autocomplete" ).menu.active ) {
        event.preventDefault();
      }
    })
    .autocomplete({
      minLength: 0,
      source: function( request, response ) {
        // delegate back to autocomplete, but extract the last term
        response( $.ui.autocomplete.filter(
          friendArr, extractLast( request.term ) ) );
      },
      focus: function() {
        // prevent value inserted on focus
        return false;
      },
      select: function( event, ui ) {
        var terms = split( this.value );
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push( ui.item.value );
        // add placeholder to get the comma-and-space at the end
        terms.push( "" );
        this.value = terms.join( ", " );
        return false;
      }
    });

	$("#newPad").on('click', function(){
			var inputFriendsNames = split($("#inviteFriends").val());
			inputFriendsNames.pop();
			var inputFriendsIDs = [];
			for (i = 0; i< inputFriendsNames.length; i++){
				allFriends.filter(function(person){if(person.name == inputFriendsNames[i]) inputFriendsIDs.push(person.id)});
				
			}


			$.post('/newPad', {inputFriendsIDs: inputFriendsIDs}, function(data){

					console.log(data);
					$("#myPads").append(data);

        $(".postButton").on('click', function(){
          var id = $(this).attr('id');
          console.log(id);
          $.post('/postFB', {padID: id}, function(data){
              // console.log(data);
              $('#myPads').append(data);
          });
        });
			});
	});

	$("#joinSession").on('click', function(){
		var sessionID = $("#sessionCode").val();
		$.post('/joinPad', {padID: sessionID}, function(data){
			$("#joinPads").append(data);
      $(".postButton").on('click', function(){
        var id = $(this).attr('id');
        console.log(id);
        $.post('/postFB', {padID: id}, function(data){
            $('#joinPads').append(data);
        });
      });
		});
	});


	//friendArr contains names of user's facebook friends
  //allFriends contains names and ids



});
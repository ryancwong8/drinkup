function renderListWithPhotos(results){
  var numberResultsToReturn = results.length<8 ? results.length : 8;
  for(var i = 0; i < numberResultsToReturn; i++){

    var locationListItem = document.createElement('li');
    locationListItem.setAttribute("class", "list-group-item location listItem");
    locationListItem.setAttribute("onclick", "setActiveListItem()");

    var itemContainer = document.createElement('div');
    itemContainer.setAttribute("class", "location container");
    createLocationImage(results[i], itemContainer);

    var pid = results[i].place_id;
    setPlaceDetails(pid, itemContainer);    
    locationListItem.appendChild(itemContainer);    
    $("#resultsList").append(locationListItem).attr("class","list-group well").height("250px");
  }
}

function createLocationImage(place, parentNode) {
  var container = document.createElement("div");
  container.setAttribute("class","location image container");
  var image = document.createElement("img");
  var photos = place.photos;
  //if photos is not undefined, we create an image from the url in the array
  if(photos){
    var photosUrl = photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100});
    image.setAttribute("src",photosUrl);
    container.appendChild(image);
    parentNode.appendChild(container);
  }
}

function setPlaceDetails(pid, parentNode){
  service.getDetails({
    placeId: pid
    }, 
    function(place, status, result) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var detailsContainer = createListItemDetails(place);
        parentNode.appendChild(detailsContainer);
      }
  });
}

function setActiveListItem() {
      $(".list-group-item").click(function(){
      $(".list-group-item").removeClass("active");
      $(this).addClass("active");
      var locationData = $(this).find("h3").data("locationData");
      fillForm(locationData);
    });
}

function createListItemDetails(place) {
  var container = document.createElement("div");
  container.setAttribute("class", "location details container");
  var placeHeader = document.createElement("h3");

  $(placeHeader).data('locationData', { location_name: place.name, location_address: place.vicinity, 
    lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), place_id: place.place_id });

  $(placeHeader).append(place.name);

  container.appendChild(placeHeader);
  container.appendChild(document.createElement("br"));

  if(place.formatted_address !== undefined){
    container.appendChild(document.createTextNode("Address: "+place.formatted_address));
    container.appendChild(document.createElement("br"));
  }
  if(place.website !== undefined){
    var text = document.createTextNode("Website: ");
    container.appendChild(text);
    var link = document.createElement("a");
    link.setAttribute("href",place.website);
    link.appendChild(document.createTextNode(place.website));
    container.appendChild(link);
    container.appendChild(document.createElement("br"));
  }
  if(place.rating !== undefined){
    container.appendChild(document.createTextNode("Rating: "+place.rating+"/5"));
    container.appendChild(document.createElement("br"));
  }
  if(place.formatted_phone_number !== undefined){
    container.appendChild(document.createTextNode("Phone number: "+place.formatted_phone_number));
    container.appendChild(document.createElement("br"));
  }
  return container;
}

function createShowListButton (){
  var child = $("#locationDetails").firstChild;
  if($("#show-list-toggle").length === 0){
    var showListButton = "<a id='show-list-toggle' onclick = 'toggleList()'>Hide List</a>";
    $("#locationDetails").prepend(showListButton);
  }
}

function fillForm(data){
  $("#event_location_name").val(data.location_name);
  $("#event_location_address").val(data.location_address);
  $("#lat").val(data.lat);
  $("#lng").val(data.lng);
  $("#place_id").val(data.place_id);
}

function toggleList() {
    var list = document.getElementById("resultsList");

    if (list.style.display == "none"){
        list.style.display = "block";
        $("#show-list-toggle").text("Hide List");
    }else{
        list.style.display = "none";
        $("#show-list-toggle").text("Show List");
    }
}


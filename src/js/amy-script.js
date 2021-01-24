// app object  
const app = {};
// base API
app.baseUrl = `https://pokeapi.co/api/v2/`;

// api call function to get pokemon habitats
app.getHabitatDetails = (selection) => {
  $.ajax({
    url: `${app.baseUrl}pokemon-habitat/`,
    method: 'GET', 
    dateType: 'json'
  }).then( (res) => {
    app.habitats =  res.results
    console.log(app.habitats)
    })       
}

// create init function
// get user selection from the dropdown menu
app.init = () => {
    $('select').on('change', function(e){
        const selection = $('option:selected').val();

        // console.log(selection);
        console.log(e.target);
        // this empties both <divs> and will make space for the array info
        $('.introContent, .lunaImg').empty();
        
        app.getHabitatDetails(selection);
        $(".introContent").append("<p>Insert text here!</p>");
    })
    app.getHabitatDetails();
}

// doc ready
$(document).ready(function(){
    app.init();
})
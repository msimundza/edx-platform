var button = $("#input-users");
var counter = 0;
var usersDataList = [];
var error = 0;

button.on("click", function(e) {
  e.preventDefault();
  usersDataList = grabValues();
  $("#status-message").html("Checking/Adding users in progress");
  sendReq();
});

$("#download-users").on("click", function(e) {
  e.preventDefault();
  $("#status-message").html("Uploading xlsx file to S3 bucket");
  $.ajax({
      url: '/create_mass_accounts/mass_users_download_list',
      data: {
        'data': JSON.stringify(usersDataList)
      },
      type: 'POST',
      success: function(dat) {

        $("#status-message").html("File <a class='file' href='" + dat.uploadedTo + dat.filename + "'> "+dat.filename+" </a> is uploaded to S3 bucket");
      }
  });
});

// returns an array
function grabValues() {
  var usernameValues = [];
  var emailValues = [];

  $("td.username").each(function() {
      var data = $(this).data('username');    
      usernameValues.push(data);
  });
  $("td.email").each(function() {
    var emailData = $(this).data('email');
    emailValues.push(emailData);
  });

  return {
    'usernameValues': usernameValues,
    'emailValues': emailValues
  }
}

/////////////////////////////////////////
// for this part I need username and email 
function registerUser(userName, email, firstname, lastname, elementNbr) {
  targetElement = $("#reg-"+elementNbr);
  regElement = $("#reg-done-"+elementNbr);

  $.ajax({
      url: '/create_mass_accounts/mass_users_add_user_ajax',
      data: {
        'username': userName,
        'email': email,
        'first_name': firstname,
        'last_name': lastname
      },
      type: 'POST',
      success: function(dat) {
        targetElement.html('<p>'+dat.message+'</p>');
        regElement.html('<p>' + dat.regKey + '</p>');

        if(dat.success=="true") {
          regElement.parent().addClass('success');
        } else if(dat.success=="false") {
          regElement.parent().addClass('error');
        }

        counter++;
        if(usersDataList.usernameValues[counter]) {
          sendReq();
        } else {
          doneAdding();
        }

      }
  });
}


function doneAdding() {
  $(".download-list").removeClass('hidden');
  
  if(error > 0) {
    $("#status-message").html("Checking/Adding users in done. You can upload xlsx file, but there are some errors, please fix them to ensure that you get all the data. If you don't fix it, then result xlsx file will be without that field (and user will not be created for that instance)");
  } else {
    $("#status-message").html("Checking/Adding users in done. You can upload xlsx file.");
  }
} 


////////////////////////////////////////
// send request for all users
function sendReq() {
  $("#input-users").attr("disabled");
  if(!usersDataList.emailValues[counter] || !usersDataList.usernameValues[counter]){
    return false;
  }
  $.ajax({
      url: '/create_mass_accounts/mass_user_check_if_users_exist_ajax',
      data: {
        'data': usersDataList.usernameValues[counter],
        'email': usersDataList.emailValues[counter]
      },
      type: 'POST',
      success: function(dat) {
        var targetElement = $("#reg-"+counter);
        var regElement = $("#reg-done-"+counter);
        var emailElement = $("#email-"+counter);
        var first_name = $("#fname-"+counter);
        var last_name = $("#lname-"+counter);
        $("#proc-users").html(counter+1);

        targetElement.html('<p>'+dat.message+'</p>');
        if(dat.status == "true") {  
          regElement.html('<p>' + dat.regKey + '</p>');
          regElement.parent().addClass('success');
        } else if(dat.status == "false") {
          var email = emailElement.data('email');
          var fname = first_name.data('firstname');
          var lname = last_name.data('lastname');

          registerUser(usersDataList.usernameValues[counter], email, fname, lname, counter);
          
        } else if(dat.status == "error") {
          regElement.parent().addClass('error');
          error += 1;
          $('#error-users').html(error);

        }
        if(dat.status=="true" || dat.status=="error") {
          counter++;
          if(usersDataList.usernameValues[counter]) {
            sendReq();
          } else {
            doneAdding();
            
          }
        }
      }
  });
}
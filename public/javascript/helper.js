const validateEmail = function(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateUrl = function(url) {
     let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
     return regexp.test(url);
}

const clipboard = new ClipboardJS('.btn');
  clipboard.on('success', function(e) {
  alert('Short Link is copied to clipboard ' + e.text)
  console.log(e);
});


$('#short-url').submit(function(e){
  e.preventDefault();
    $.ajax({
      url: '/api/short',
      type: 'POST',
      dataType: 'JSON',
      data: { url: $('#url-field').val() },
      success: function(data){
        if (validateEmail(data.userUrl)) {
          console.log('its an email', data.userUrl);
          let resultHTML = '<a class="alert alert-success" href="mailto:' + data.userUrl + '" target="_blank">'
              + data.shortUrl + '</a>'
              + '<button data-clipboard-target="#link" data-clipboard-action="copy" class="btn btn-primary"><i class="fa fa-copy"></i></button>';
          $('#link').html(resultHTML);
          $('#link').hide().fadeIn('slow');
        }
         else if (validateUrl(data.userUrl)) {
            // data.userUrl = "http://" + data.userUrl;
            console.log('its a link', data.userUrl);
            resultHTML = '<a class="alert alert-success" href="' + data.userUrl + '" target="_blank">'
               + data.shortUrl + '</a>'
               + '<button data-clipboard-target="#link" data-clipboard-action="copy" class="btn btn-primary"><i class="fa fa-copy"></i></button>';
           $('#link').html(resultHTML);
           $('#link').hide().fadeIn('slow');
        }
      },
      error: function(message) {
        console.log(message);
        let errorHTML = '<p class="alert alert-danger">Please enter or paste the correct format</p>'
        $('#show-message').html(errorHTML);
        $('#show-message').hide().fadeIn('slow').fadeOut(10000);
        }
      });
  });

  $('#long-url').submit(function(e) {
    let mailto = 'mailto:'
    e.preventDefault();
      $.ajax({
        url: '/api/:longUrl',
        type: 'POST',
        data: { longUrl: $('#logn-url-field').val() },
        success: function(data) {
          if (validateEmail(data.userUrl)) {
            console.log('its an email', data.userUrl);
            let resultHTML = '<a class="alert alert-success" href="mailto:' + data.userUrl + '" target="_blank">'
                + mailto + data.userUrl + '</a>'
                + '<button data-clipboard-target="#link" data-clipboard-action="copy" class="btn btn-primary"><i class="fa fa-copy"></i></button>';
            $('#link').html(resultHTML);
            $('#link').hide().fadeIn('slow');
          }
           else if (validateUrl(data.userUrl)) {
              // data.userUrl = "http://" + data.userUrl;
              console.log('its a link', data.userUrl);
              resultHTML = '<a class="alert alert-success" href="' + data.userUrl + '" target="_blank">'
                 + data.userUrl + '</a>'
                 + '<button data-clipboard-target="#link" data-clipboard-action="copy" class="btn btn-primary"><i class="fa fa-copy"></i></button>';
             $('#link').html(resultHTML);
             $('#link').hide().fadeIn('slow');
          }
        },
        error: function(message) {
          console.log(message);
          let errorHTML = '<p class="alert alert-danger">The short URL you entered does not exist in our Database</p>'
          $('#show-message').html(errorHTML);
          $('#show-message').hide().fadeIn('slow').fadeOut(10000);
          }
      })
  })

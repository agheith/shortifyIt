
$('#short-url').submit(function(e){
  e.preventDefault();
    $.ajax({
      url: '/api/short',
      type: 'POST',
      dataType: 'JSON',
      data: { url: $('#url-field').val() },
      success: function(data){
        console.log('before userUrl', data.userUrl);
        if (!/^(f|ht)tps?:\/\//i.test(data.userUrl)) {
            data.userUrl = "http://" + data.userUrl;
        }
        console.log('after userUrl', data.userUrl);
          var resultHTML = '<a class="alert alert-success" href="' + data.userUrl + '">'
              + data.shortUrl + '</a>'
              + '<button data-clipboard-target="#link" data-clipboard-action="copy" class="btn btn-primary"><i class="fa fa-copy"></i></button>';
          $('#link').html(resultHTML);
          $('#link').hide().fadeIn('slow');

      },
      error: function(message) {
        console.log(message);
        var errorHTML = '<p class="alert alert-danger">Please enter or paste the correct format</p>'
        $('#show-message').html(errorHTML);
        $('#show-message').hide().fadeIn('slow').fadeOut(10000);
        }
      });
  });

$('#long-url').submit(function(e) {
  e.preventDefault();
    console.log('hi');
    $.ajax({
      url: '/api/:longUrl',
      type: 'POST',
      data: { longUrl: $('#logn-url-field').val() },
      success: function(data) {
        console.log(data.userUrl);
        var resultHTML = '<a class="alert alert-success" href="' + data.userUrl + '">'
            + data.userUrl + '</a>'
            + '<button data-clipboard-target="#link" data-clipboard-action="copy" class="btn btn-primary"><i class="fa fa-copy"></i></button>';
        $('#link').html(resultHTML);
        $('#link').hide().fadeIn('slow');


      },
      error: function(message) {
        console.log(message);
        var errorHTML = '<p class="alert alert-danger">The short URL you entered does not exist in our Database</p>'
        $('#show-message').html(errorHTML);
        $('#show-message').hide().fadeIn('slow').fadeOut(10000);
        }
    })
})

var clipboard = new ClipboardJS('.btn');
  clipboard.on('success', function(e) {
  alert('Short Link is copied to clipboard ' + e.text)
  console.log(e);
});

// 20083743d PEI Yuxing
$(() => {
  $.ajax({
    url: '/auth/me',
    method: 'GET',
    error: () => {
      alert('Please login');
      window.location.href = '/login.html';
    },
    success: (data) => {
      $('#greet').text(`Welcome back! ${data.user.username} (${data.user.role})`);
    },
  });

  $('#logout').click(() => {
    if (confirm('Confirm to logout?')) {
      $.ajax({
        url: '/auth/logout',
        method: 'POST',
        success: () => {
          window.location.href = '/login.html';
        },
      });
    }
  });
});

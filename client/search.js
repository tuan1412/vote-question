$(document).ready(() => {
  $('#loading').hide();

  $('#formSearch').on('submit', (e) => {
    e.preventDefault();

    $('#loading').show();

    const keyword = $('#searchQuestion').val();
    $.ajax({
      url: '/search-question',
      method: 'GET',
      data: {
        keyword
      },
      success: (res) => {
        if (res.success) {
          $('#result').html('');
          $('#loading').hide();
          const listQuestionDom = res.data.map(question => {
            const { content, yesCount, noCount } = question;

            return `
              <li class="list-group-item">
                ${content}
                <span class="badge badge-success badge-pill">${yesCount}</span>
                <span class="badge badge-danger badge-pill">${noCount}</span>
              </li>
            `;
          }).join('');

          $('#result').append(listQuestionDom)
        }
      }
    })
  })
})
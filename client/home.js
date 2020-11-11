$(document).ready(() => {
  let idQuestion;

  const getRandomQuestion = () => {
    $.ajax({
      url: `/random-question`,
      method: 'GET',
      success: (res) => {
        if (res.success) {
          const question = res.data;
          const { content, yesCount: yes, noCount: no, id } = question;
          // nhiệm vụ render client :
          idQuestion = id;
          $('#contentQuestion').html(content);
        }
      },
      error: (res) => {
        console.log(res);
      }
    })
  }

  getRandomQuestion();

  const otherQuestionBtn = $('#otherQuestion');
  otherQuestionBtn.on('click', () => {
    getRandomQuestion();
  })

  const sendRequestVote = (type) => {
    $.ajax({
      url: `/vote-question/${idQuestion}/${type}`,
      method: 'GET',
      success: (res) => {
        window.location.href = `/question/${idQuestion}`
      }
    })
  };

  $('.voteBtn').on('click', function() {
    const voteType = $(this).attr('data-type');
    sendRequestVote(voteType);
  });

  $('#voteResultBtn').on('click', () => {
    window.location.href = `/question/${idQuestion}`
  })
})
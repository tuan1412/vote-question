const textArea = $('.formQuestion');
const form = $('#form');

// B1: bắt sự kiện
form.on("submit", (event) => {
  event.preventDefault();

  // B2: lấy giá trí của textarea
  const content = textArea.val();

  // B3: Gửi lên server
  $.ajax({
    url: '/create-question',
    type: 'POST',
    data: {
      content
    },
    success: (res) => {
      if (res.success) {
        const idQuestion = res.data.id;
        window.location.href = '/question/' + idQuestion;
      }
    },
    error: (res) => {
      console.log(res);
    }
  })
})

textArea.on('input', () => {
  const content = textArea.val();
  const restCharacterLength = 200 - content.length;

  const restSpan = $('#rest');
  restSpan.html(restCharacterLength);
})
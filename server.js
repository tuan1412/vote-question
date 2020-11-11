const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

const QuestionModel = require('./models/question');

// kết nối mongodb server
mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true },
  (err) => {
    if (err) throw err;
    console.log('connect mongodb successfully')
  });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('client'));

app.get('/', (req, res) => {
  const pathFile = path.resolve(__dirname, './client/home.html');
  res.sendFile(pathFile)
});

app.get('/ask', (req, res) => {
  const pathFile = path.resolve(__dirname, './client/create-question.html');
  res.sendFile(pathFile)
})

app.get('/question/:id', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/detail-question.html'))
})

app.get('/search', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/search.html'))
})

app.get('/search-question', async (req, res) => {
  const { keyword } = req.query;

  const questions = await QuestionModel.find(
    { 
      content: { $regex: keyword, $options: 'i' }
    }
  ).lean();

  const formatQuestions = questions.map(q => ({...q, id: q._id }));
  
  res.send({ success: 1, data: formatQuestions });
});

app.get('/random-question', async (req, res) => {
  const sampleQuestions = await QuestionModel.aggregate([{
    $sample: { size: 1 }
  }]);

  if (sampleQuestions.length) {
    const foundQuestion = sampleQuestions[0];
    return res.send({
      success: 1,
      data:
      {
        ...foundQuestion,
        id: foundQuestion._id
      }
    });
  };

  return res.send({ success: 0 });
})


app.post('/create-question', async (req, res) => {
  const { content } = req.body;

  const newQuestionData = { content };

  const newQuestion = await QuestionModel.create(newQuestionData);

  res.send({
    success: 1,
    data:
    {
      ...newQuestion,
      id: newQuestion._id
    }
  })
})

// app.get('/detail-question') 
app.get('/detail-question/:id', async (req, res) => {
  const idQuestion = req.params.id;
  const foundQuestion = await QuestionModel.findById(idQuestion).lean();

  if (!foundQuestion) {
    return res.send({ success: 0 });
  }

  return res.send({
    success: 1,
    data: {
      ...foundQuestion,
      id: foundQuestion._id
    }
  });
})


app.get('/vote-question/:idQuestion/:voteType', async (req, res) => {
  const { idQuestion, voteType } = req.params;

  const updateQuestion = await QuestionModel.findByIdAndUpdate(
    idQuestion,
    {
      $inc: { [voteType]: 1 }
    },
    {
      new: true
    }
  ).lean();

  return res.send({
    success: 1,
    data:
      { ...updateQuestion, id: updateQuestion._id}
  });
});


app.get('*', (request, response) => {
  response.send({ say: '404' });
})


app.listen(process.env.PORT, (err) => {
  if (err) throw err;

  console.log('Server started');
})
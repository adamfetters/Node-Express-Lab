const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [
  { id: 1, title: 'Mary', content: 'Yes she did' },
  { id: 2, title: 'Chitty Chitty bang bang', content: 'Choo choo' }
];
let id = posts.length + 1;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: your code to handle requests


server.get('/posts', (req, res) => {
  const term = req.query.term;
  if (term) {
    const post = posts.filter(p => p.title === term || p.content === term);
    res.status(200).json(post);
  } else {
    res.status(200).json(posts);
  }
});

server.post('/posts', (req, res) => {
  const post = req.body;

  if (!post.title || !post.content) {
    const error = { error: 'Must have title and content' };
    res.status(422).json(error);
  } else {
    post.id = id++;
    posts.push(post);
    res.status(201).json(post);
  }
});

const findIfId = (postId) => {
  const matchingId = posts.find(p => p.id === postId);
  return matchingId;
};

const updateData = (postId, postTitle, postContent) => {
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === postId) {
      posts[i].title = postTitle;
      posts[i].content = postContent;
    }
  }
};

server.put('/posts', (req, res) => {
  const post = req.body;
  if (!post.title || !post.content || !post.id) {
    const error = { error: 'Need all information' };
    res.status(422).json(error);
  } else if (!findIfId(post.id)) {
    const errorId = { error: 'No Id Found' };
    res.status(404).json(errorId);
  } else {
    updateData(post.id, post.title, post.content);
    res.status(200).json(post);
  }
});

const deletePost = (postId) => {
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === postId) {
      posts.splice(i, 1);
    }
  }
};
server.delete('/posts', (req, res) => {
  const post = req.body;
  if (!post.id || !findIfId(post.id)) {
    const error = { error: 'Invalid Id' };
    res.status(404).json(error);
  } else {
    deletePost(post.id);
    const success = { success: true };
    res.status(200).json(success);
  }
});


module.exports = { posts, server };

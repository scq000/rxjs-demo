const $ = require('jquery');
const Rx = require('rxjs/Rx');

const getAllBtn = $('#getAllBtn');
const searchInput = $('#search-input');
let keyword = '';

const clickEventStream = Rx.Observable.fromEvent(getAllBtn, 'click');
const inputEventStream = Rx.Observable.fromEvent(searchInput, 'keyup').filter(event => event.keyCode !== 13);
const clickUserItemStream = Rx.Observable.fromEvent($('#user-lists'), 'click');

const getUserListStream = clickEventStream.flatMap(() => {
  return Rx.Observable.fromPromise($.getJSON('https://api.github.com/users'));
});

const filterUserStream = inputEventStream.flatMap(event => {
  return Rx.Observable.fromPromise($.getJSON('https://api.github.com/users'));
});

const getUserInformation = clickUserItemStream.flatMap(event => {
  console.log(event.target.innerText);
  return Rx.Observable.fromPromise($.getJSON('https://api.github.com/users/' + event.target.innerText));
});

getUserInformation.subscribe(user => {
  console.log(user);
  renderUserInfo(user);
});

filterUserStream.subscribe(users => {
  console.log(users);
  renderUserLists(users.filter(user => user.login.includes(keyword)));
});

clickEventStream.subscribe(
  value => console.log('GetUsers btn click!')
);

inputEventStream.subscribe(event => {
  console.log(searchInput.val());
  keyword = searchInput.val();
});

clickUserItemStream.subscribe(event => {
  console.log(event.target);
});

getUserListStream.catch(err => {
  Rx.Observable.of(err); //使用catch函数避免错误被中断
}).subscribe(users => {
  console.log(users);
  renderUserLists(users)
});

function renderUserLists(users) {
  $('#user-lists').html('');
  users.forEach((user) => {
    $('#user-lists').append(`<li>${user.login}</li>`);
  });
}

function renderUserInfo(user) {
  $('#user-info').html('');
  for (var key in user) {
    $('#user-info').append(`<div>${key} ---> ${user[key]}</div>`);
  }
}

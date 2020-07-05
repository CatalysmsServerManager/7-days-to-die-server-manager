// eslint-disable-next-line no-unused-vars
class gblComments {
  constructor(loggedInUserId) {
    this.listElement = $('#comments-list');
    // Map of comments, indexed by ID
    this.commentsMap = new Map();
    this.loggedInUserId = loggedInUserId;
  }

  clear() {
    this.commentsMap.forEach(comment => {
      $(`#comment-${comment.id}`).fadeOut('fast', () => {
        $(`#comment-${comment.id}`).remove();
      });
    });


    this.commentsMap.clear();
  }

  add(comment, ban) {
    //console.log('Drawing a new comment' + JSON.stringify(comment))
    if (_.isUndefined(comment.user)) {
      throw new Error('You must provide a user with the comment to add');
    }

    if (_.isUndefined(ban)) {
      throw new Error('You must provide a ban with the comment to add');
    }


    let userPlacedComment = false;

    if (comment.user) {
      userPlacedComment = comment.user.id.toString() === this.loggedInUserId.toString();
    }

    let dateCreated = new Date(comment.createdAt);

    let containers1 = `<li id="comment-${comment.id}"><div class="comment-main-level">`;
    let avatarElement = `<div class="comment-avatar"><img src="${comment.user ? comment.user.avatar : ''}" alt="User avatar"></div>`;
    let containers2 = `<div class="comment-box"><div class="comment-head">`;
    let authorContainer = `<h6 class="comment-name"><p>Unknown user</p></h6>`;

    if (comment.user) {
      if (comment.user.steamId === ban.steamId) {
        authorContainer = `<h6 class="comment-name by-author"><p>${_.escape(comment.user.username)}</p></h6>`;
      } else {
        authorContainer = `<h6 class="comment-name"><p>${_.escape(comment.user.username)}</p></h6>`;
      }
    }

    let createdElem = `<span>${dateCreated.toLocaleDateString()} ${dateCreated.toLocaleTimeString()}</span> `;
    let editAndRemoveButtons = new String();
    if (userPlacedComment) {
      editAndRemoveButtons = `<div class="text-right">
      <div class="btn-group btn-group-sm" role="group" aria-label="Remove or edit comment">
      <button data-commentId="${comment.id}" type="button" class="btn btn-danger remove-comment-btn">Remove</button>
      <button data-commentId="${comment.id}" type="button" class="btn btn-info edit-comment-btn">Edit</button>
    </div>
    </div>
    `;
    }

    let userHasHeartedComment = false;

    if (comment.heartedBy) {
      userHasHeartedComment = _.includes(comment.heartedBy.map(user => user.id.toString()), this.loggedInUserId);
    }

    let heartElem = `<i data-commentId="${comment.id}" class="fa fa-heart comment-heart${userHasHeartedComment ? ' text-danger' : ''}"></i>`;
    let containers3 = `</div>`;
    let commentElem = `<div class="comment-content">${_.escape(comment.content)}</div>`;
    let containers4 = `</div></div></li>`;

    let elementString = containers1 + avatarElement + containers2 + authorContainer + createdElem + editAndRemoveButtons + heartElem + containers3 + commentElem + containers4;

    this.listElement.append(elementString).hide().fadeIn(500);
    this.commentsMap.set(String(comment.id), comment);
  }

  remove(comment) {

    if (_.isUndefined(comment)) {
      throw new Error('Comment is required');
    }

    let commentId = comment.id ? comment.id : comment;

    let commentElement = $(`li #comment-${commentId}`);
    commentElement.remove();
    this.commentsMap.delete(String(commentId));
    console.log('Removed a comment from list ' + commentId);
  }
}

/**
 * General (utility) functions
 */

function loadSdtdServers(userId) {
  let serverslist = $('#sdtd-servers-owned');
  $.ajax({
    url: `/api/user/ownedservers`,
    data: {
      userId: userId
    },
    success: (data, status, xhr) => {
      if (data.length === 0) {
        return serverslist.append(`<a class="dropdown-item"> None </a>`);
      }
      for (let index = 0; index < data.length; index++) {
        const server = data[index];
        let serverDashboardLink = `/sdtdserver/${server.id}/dashboard`;
        let serverHtml = `<a class="dropdown-item" href=${serverDashboardLink}> ${server.name ? server.name : server.ip} </a>`;
        serverslist.append(serverHtml);
      }
    },
    error: function (xhr, status, error) {
      showErrorModal(`${error} - ${xhr.responseText}`, xhr);
    },
    complete: () => {
      $('#loading-servers').remove();
    }
  });
}

async function checkUserPermission(userId, serverId, permissionField) {
  return new Promise((resolve, reject) => {
    if (_.isUndefined(serverId) || _.isUndefined(userId) || _.isUndefined(permissionField)) {
      return showErrorModal(`checkUserPermission - Invalid input! Function requires serverId, userId and permissionField`);
    }

    $.ajax({
      url: '/api/permission',
      type: 'GET',
      data: {
        serverId: serverId,
        userId: userId,
        permissionField: permissionField
      },
      success: (data, status, xhr) => {
        resolve(data);

      },
      error: function (xhr, status, error) {
        displayAjaxToSupportData(xhr, this);
        reject(xhr);

      }
    });

  });

}

// Error modal controller

function showErrorModal(errorMessage, xhr) {

  if (xhr && xhr.responseJSON && xhr.responseJSON.problems && xhr.responseJSON.problems.length > 0) {
    errorMessage = xhr.responseJSON.problems.join('\n');
  }

  $('#error-modal-message').text(errorMessage);

  if (errorMessage) {
    $('#error-modal-message-bool').show();
  } else {
    $('#error-modal-message-bool').hide();
  }

  $('#error-modal').modal('show');
}

// This function parses an xhr object and displays a console.log which users can copy and send to support.
function displayAjaxToSupportData(xhr, ajaxRequest) {

  console.log('---------');
  console.log(`
  _____                    
  |  ___|                   
  | |__ _ __ _ __ ___  _ __ 
  |  __| '__| '__/ _ \| '__|
  | |__| |  | | | (_) | |   
  \____/_|  |_|  \___/|_|   
                                                     
  `);
  console.log('Ajax request ERROR!');
  console.log('You can copy and paste this info to the support team.');
  console.log('Be careful! The data of your request might include sensitive details about your session (csrf token). Make sure you create a support ticket and share the info there if you are unsure.');
  console.log('---------');
  console.log('Headers:');
  console.log(xhr.getAllResponseHeaders());
  console.log(`Status: ${xhr.status} - ${xhr.statusText}`);
  console.log(`URL: ${ajaxRequest.type} ${ajaxRequest.url}`);
  console.log('Data:');
  console.log(ajaxRequest.data);
  console.log('---------');
}

function hhmmss(seconds) {
  var d = ifNanZero(Number(seconds));
  var h = ifNanZero(Math.floor(d / 3600));
  var m = ifNanZero(Math.floor(d % 3600 / 60));
  var s = ifNanZero(Math.floor(d % 3600 % 60));
  return padNumber(h) + ':' + padNumber(m) + ':' + padNumber(s);
}

function ifNanZero(v) {
  return isNaN(v) ? 0 : v;
}

function padNumber(n) {
  return (n < 10 ? '0' : '') + n;
}

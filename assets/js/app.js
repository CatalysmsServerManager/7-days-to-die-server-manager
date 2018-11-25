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
    error: (xhr, status, error) => {
      showErrorModal(`${error} - ${xhr.responseText}`);
    },
    complete: () => {
      $('#loading-servers').remove();
    }
  });
}

async function checkUserPermission(userId, serverId, permissionField) {
  return new Promise((resolve, reject) => {
    if (_.isUndefined(serverId) || _.isUndefined(userId) || _.isUndefined(permissionField)) {
      return showErrorModal(`checkUserPermission - Invalid input! Function requires serverId, userId and permissionField`)
    }

    $.ajax({
      url: "/api/permission",
      type: 'GET',
      data: {
        serverId: serverId,
        userId: userId,
        permissionField: permissionField
      },
      success: (data, status, xhr) => {
        resolve(data);

      },
      error: (xhr, status, error) => {
        displayAjaxToSupportData(xhr, this.URL);
        reject(xhr)

      }
    })

  })

}

// Error modal controller

function showErrorModal(errorMessage) {

  $("#error-modal-message").text(errorMessage)

  if (errorMessage) {
    $("#error-modal-message-bool").show();
  } else {
    $("#error-modal-message-bool").hide();
  }

  $('#error-modal').modal('show');
}

// This function parses an xhr object and displays a console.log which users can copy and send to support.
function displayAjaxToSupportData(xhr, url) {

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
  console.log('You can copy and paste this info to the support team, please also include what you were doing (eg, what button(s) did you press, what data did you fill in?');
  console.log('---------');
  console.log('Headers:')
  console.log(xhr.getAllResponseHeaders());
  console.log(`Status: ${xhr.status} - ${xhr.statusText}`);
  console.log(`URL: ${url}`);
  console.log('---------');
}

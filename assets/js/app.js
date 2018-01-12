/**
 * General (utility) functions
 */

function loadSdtdServers(userId) {
  let serverslist = $('#sdtd-servers-owned')
  $.ajax({
    url: `/api/user/ownedservers`,
    data: {
      userId: userId
    },
    success: (data, status, xhr) => {
      if (data.length === 0) {
        return serverslist.append('None')
      }
      for (let index = 0; index < data.length; index++) {
        const server = data[index];
        let serverDashboardLink = `/sdtdserver/${server.id}/dashboard`
        let serverHtml = `<a class="dropdown-item" href=${serverDashboardLink}> ${server.name ? server.name : server.ip} </a>`
        serverslist.append(serverHtml)
      }
    },
    error: (xhr, status, error) => {
      let errorHtml = `<a class="dropdown-item .text-danger"> Error loading servers </a>`
      serverslist.append(errorHtml)

    },
    complete: () => {
      $('#loading-servers').remove()
    }
  })
}
